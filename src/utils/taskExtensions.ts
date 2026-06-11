import { Extension } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import {
	type EditorState,
	Plugin,
	PluginKey,
	type Transaction,
} from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";
import type { Filter } from "@/types/todo";
import { getToday, getTomorrow, getYesterday } from "./dateUtils";
import { matchesFilter } from "./filterUtils";
import { parseTodoLine } from "./todoParser";

export interface TaskFilterStorage {
	activeFilter: Filter | null;
	searchQuery: string;
	showCompleted: boolean;
}

export const TaskFilterExtension = Extension.create<unknown, TaskFilterStorage>(
	{
		name: "taskFilter",

		addStorage() {
			return {
				activeFilter: null,
				searchQuery: "",
				showCompleted: true,
			};
		},

		addProseMirrorPlugins() {
			const extension = this;
			return [
				new Plugin({
					key: new PluginKey("taskFilter"),
					state: {
						init() {
							return DecorationSet.empty;
						},
						apply(_tr: Transaction, _oldState: DecorationSet) {
							return DecorationSet.empty;
						},
					},
					props: {
						decorations(state: EditorState) {
							const { activeFilter, searchQuery, showCompleted } =
								extension.storage;
							const decos: Decoration[] = [];
							const today = getToday();
							const tomorrow = getTomorrow();
							const yesterday = getYesterday();
							const dateContext = { today, tomorrow, yesterday };
							const lowerSearch = searchQuery.toLowerCase();

							state.doc.descendants((node: PMNode, pos: number) => {
								if (node.isBlock) {
									const text = node.textContent;
									if (!text.trim()) return;

									const task = parseTodoLine(text, pos, dateContext);

									let matches = true;

									if (!showCompleted && task.completed) {
										matches = false;
									}

									if (matches && activeFilter) {
										matches = matchesFilter(task, activeFilter, today);
									}

									if (matches && searchQuery) {
										matches = text.toLowerCase().includes(lowerSearch);
									}

									if (!matches) {
										decos.push(
											Decoration.node(pos, pos + node.nodeSize, {
												class: "filter-hidden",
											}),
										);
									}
								}
							});

							return DecorationSet.create(state.doc, decos);
						},
					},
				}),
			];
		},
	},
);

interface TaskTaggingOptions {
	onFilterClick?: (type: string, value: string) => void;
}

export const TaskTaggingExtension = Extension.create<TaskTaggingOptions>({
	name: "taskTagging",

	addOptions() {
		return {
			onFilterClick: undefined,
		};
	},

	addProseMirrorPlugins() {
		const extension = this;
		return [
			new Plugin({
				key: new PluginKey("taskTagging"),
				props: {
					decorations(state: EditorState) {
						const decos: Decoration[] = [];
						const today = getToday();

						state.doc.descendants((node: PMNode, pos: number) => {
							if (node.isText) {
								const text = node.text || "";
								const blockPos = pos;

								const projectRegex = /\+([\w-]+)/g;
								let match = projectRegex.exec(text);
								while (match !== null) {
									const start = blockPos + match.index;
									const end = start + match[0].length;
									decos.push(
										Decoration.inline(start, end, {
											class: "tag-interactive tag-project",
											"data-filter-type": "project",
											"data-filter-value": match[1],
										}),
									);
									match = projectRegex.exec(text);
								}

								const contextRegex = /@([\w-]+)/g;
								match = contextRegex.exec(text);
								while (match !== null) {
									const start = blockPos + match.index;
									const end = start + match[0].length;
									decos.push(
										Decoration.inline(start, end, {
											class: "tag-interactive tag-context",
											"data-filter-type": "context",
											"data-filter-value": match[1],
										}),
									);
									match = contextRegex.exec(text);
								}

								const priorityRegex = /\(([A-Z])\)/g;
								match = priorityRegex.exec(text);
								while (match !== null) {
									const start = blockPos + match.index;
									const end = start + match[0].length;
									const priority = match[1];
									decos.push(
										Decoration.inline(start, end, {
											class: `tag-interactive tag-priority tag-priority-${priority}`,
											"data-filter-type": "priority",
											"data-filter-value": priority,
										}),
									);
									match = priorityRegex.exec(text);
								}

								const dueRegex = /due:([\w-]+)/g;
								match = dueRegex.exec(text);
								while (match !== null) {
									const start = blockPos + match.index;
									const end = start + match[0].length;
									const value = match[1].toLowerCase();

									let isOverdue = false;
									if (value !== "today" && value !== "tomorrow") {
										if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
											isOverdue = value < today;
										}
									}

									decos.push(
										Decoration.inline(start, end, {
											class: `tag-interactive tag-due${isOverdue ? " tag-due-overdue" : ""}`,
											"data-filter-type": "due",
											"data-filter-value": value,
										}),
									);
									match = dueRegex.exec(text);
								}
							}
						});

						return DecorationSet.create(state.doc, decos);
					},

					handleClick(_view: EditorView, _pos: number, event: MouseEvent) {
						const target = event.target as HTMLElement;
						if (target?.classList.contains("tag-interactive")) {
							const type = target.getAttribute("data-filter-type");
							const value = target.getAttribute("data-filter-value");
							if (type && value && extension.options.onFilterClick) {
								extension.options.onFilterClick(type, value);
								return true;
							}
						}
						return false;
					},
				},
			}),
		];
	},
});
