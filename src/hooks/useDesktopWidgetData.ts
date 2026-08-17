/** Field Notes Ritual: live bridge from the desktop widget plugin to the
 * small floating widget windows.
 *
 * The Rust plugin (`src-tauri/src/desktop_widgets.rs`) forwards the same
 * projection the Android home-screen widgets render from over the
 * `desktop-widget-data` event, and re-emits it whenever a widget window
 * finishes loading. This hook subscribes once and hands every subscriber
 * the same cached snapshot so all widgets stay in lockstep with the app.
 */

import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import type { WidgetPayload } from "@/lib/widgetDataBridge";
import { parseTodoContent } from "@/utils/todoParser";

/** Compact view model the widget cards consume — same shape as
 * `WidgetTaskProjection` plus the optional habit momentum summary. */
export interface DesktopWidgetData {
	date: string;
	tasks: { id: number; text: string; done: boolean; due?: string }[];
	momentum: {
		bestStreak: number;
		bestHabitName: string;
		avgRate28: number;
		habitsDoneToday: number;
		habitsTotal: number;
	} | null;
	aggregate: DesktopWidgetAggregate;
}

const EMPTY_SNAPSHOT: Omit<DesktopWidgetData, "aggregate"> = {
	date: new Date().toISOString().slice(0, 10),
	tasks: [],
	momentum: null,
};

/** Bucket used by the Overview widget for projects and contexts. */
interface Bucket {
	key: string;
	count: number;
}

/** Aggregate of the whole todo.txt — priorities, projects, contexts. */
export interface DesktopWidgetAggregate {
	priorities: Record<string, number>;
	projects: Bucket[];
	contexts: Bucket[];
}

function computeAggregate(content: string | null): DesktopWidgetAggregate {
	const parsed = content ? parseTodoContent(content) : undefined;
	const tasks = parsed?.tasks ?? [];
	const priorities: Record<string, number> = {};
	const projectMap: Record<string, number> = {};
	const contextMap: Record<string, number> = {};
	for (const task of tasks) {
		if (!task.completed) {
			if (task.priority) {
				priorities[task.priority] = (priorities[task.priority] ?? 0) + 1;
			}
			for (const project of task.projects ?? []) {
				projectMap[project] = (projectMap[project] ?? 0) + 1;
			}
			for (const context of task.contexts ?? []) {
				contextMap[context] = (contextMap[context] ?? 0) + 1;
			}
		}
	}
	const toBuckets = (map: Record<string, number>) =>
		Object.entries(map)
			.map(([key, count]) => ({ key, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	return {
		priorities,
		projects: toBuckets(projectMap),
		contexts: toBuckets(contextMap),
	};
}

/** Whether the current webview is one of the floating desktop widgets. */
export function isDesktopWidgetWindow(): boolean {
	return window.location.pathname.startsWith("/widget/");
}

/** Subscribe to the desktop widget data stream (Tauri only). */
export function useDesktopWidgetData(): DesktopWidgetData {
	const [data, setData] =
		useState<Omit<DesktopWidgetData, "aggregate">>(EMPTY_SNAPSHOT);

	useEffect(() => {
		let mounted = true;
		// The Rust plugin pushes full payloads to every widget window, and
		// re-plays the cached projection when a window finishes loading.
		const unlisten = listen<WidgetPayload>("desktop-widget-data", (event) => {
			if (!mounted) return;
			const payload = event.payload;
			setData({
				date: payload.date,
				tasks: payload.tasks,
				momentum: payload.momentum ?? null,
			});
		}).catch(() => undefined);

		return () => {
			mounted = false;
			void unlisten;
		};
	}, []);

	const aggregate = computeAggregate(readLocalMirror());

	return { ...data, aggregate };
}

/** Parse the editor's markdown into the task list widgets show, reading
 * from localStorage so widget windows (which load before the editor
 * hydrates) still get the last saved document. */
export function readLocalMirror(): string | null {
	try {
		const raw = localStorage.getItem("todo_content_backup");
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === "object" &&
			typeof parsed.content === "string"
		) {
			return parsed.content;
		}
		if (typeof raw === "string" && raw.length > 0) return raw;
		return null;
	} catch {
		return null;
	}
}
