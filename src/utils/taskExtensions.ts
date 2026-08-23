import { Extension } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import {
	type EditorState,
	Plugin,
	PluginKey,
	type Transaction,
} from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";
import { parseTodoLine } from "@/lib/core";
import type { Filter } from "@/types/todo";
import { getToday } from "./dateUtils";

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

							state.doc.descendants((node: PMNode, pos: number) => {
								if (node.isBlock) {
									const text = node.textContent;
									if (!text.trim()) return;

									const task = parseTodoLine(text, pos);

									let matches = true;

									if (!showCompleted && task.completed) {
										matches = false;
									}

									if (matches && activeFilter) {
										if (activeFilter.type === "priority") {
											matches = task.priority === activeFilter.value;
										} else if (activeFilter.type === "project") {
											matches =
												task.projects?.includes(activeFilter.value) ?? false;
										} else if (activeFilter.type === "context") {
											matches =
												task.contexts?.includes(activeFilter.value) ?? false;
										} else if (activeFilter.type === "due") {
											if (activeFilter.value === "overdue") {
												matches = !!task.due && task.due < today;
											} else {
												matches = task.due === activeFilter.value;
											}
										} else if (activeFilter.type === "completion") {
											matches =
												activeFilter.value === "done"
													? task.completed
													: !task.completed;
										}
									}

									if (matches && searchQuery) {
										matches = text
											.toLowerCase()
											.includes(searchQuery.toLowerCase());
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

/**
 * Absolute [start, end] spans of every guarded occurrence of a literal
 * `+token` / `@token`. The token itself was extracted by the core parser;
 * the left/right boundary guards here mirror its lookbehind and greedy
 * `[\\w.-]*` tail so glued text (`me@work.com`, `a+project`) and prefixes
 * (`@work` inside `@worker`) never highlight.
 */
function pushTokenSpans(
	text: string,
	blockPos: number,
	token: string,
): Array<[number, number]> {
	const forbiddenBefore = token.startsWith("@") ? /[\w.]/ : /\w/;
	const forbiddenAfter = /[\w.-]/;
	const spans: Array<[number, number]> = [];
	let cursor = text.indexOf(token);
	while (cursor >= 0) {
		const before = cursor > 0 ? text[cursor - 1] : "";
		const afterIndex = cursor + token.length;
		const after = afterIndex < text.length ? text[afterIndex] : "";
		if (
			(!before || !forbiddenBefore.test(before)) &&
			(!after || !forbiddenAfter.test(after))
		) {
			spans.push([blockPos + cursor, blockPos + afterIndex]);
		}
		cursor = text.indexOf(token, cursor + 1);
	}
	return spans;
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

								// Tokens come from the shared core parser, so the chips can
								// never drift from what the app actually treats as a token
								// (letter-first projects/contexts, `due:+7d`, `T`-times…).
								// Only the SPANS are located here, by literal search for
								// the exact tokens the parser returned.
								const task = parseTodoLine(text);

								for (const project of task.projects ?? []) {
									pushTokenSpans(text, blockPos, `+${project}`).forEach(
										([start, end]) => {
											decos.push(
												Decoration.inline(start, end, {
													class: "tag-interactive tag-project",
													"data-filter-type": "project",
													"data-filter-value": project,
												}),
											);
										},
									);
								}

								for (const context of task.contexts ?? []) {
									pushTokenSpans(text, blockPos, `@${context}`).forEach(
										([start, end]) => {
											decos.push(
												Decoration.inline(start, end, {
													class: "tag-interactive tag-context",
													"data-filter-type": "context",
													"data-filter-value": context,
												}),
											);
										},
									);
								}

								if (task.priority) {
									const prioritySpan = text.indexOf(`(${task.priority})`);
									if (prioritySpan >= 0) {
										decos.push(
											Decoration.inline(
												blockPos + prioritySpan,
												blockPos + prioritySpan + task.priority.length + 2,
												{
													class: `tag-interactive tag-priority tag-priority-${task.priority}`,
													"data-filter-type": "priority",
													"data-filter-value": task.priority,
												},
											),
										);
									}
								}

								if (task.due) {
									// Decorate the whole `due:…` token up to whitespace; the
									// parser already validated the value inside it.
									let cursor = text.indexOf("due:");
									while (cursor >= 0) {
										let end = cursor;
										while (end < text.length && !/\s/.test(text[end])) {
											end++;
										}
										if (end > cursor) {
											const token = text.slice(cursor, end);
											const base = token
												.slice(4)
												.replace(/[@tT]\d{1,2}:\d{2}(?::\d{2})?$/, "");
											const hasTime = base !== token.slice(4);

											let isOverdue = false;
											if (base !== "today" && base !== "tomorrow") {
												if (/^\d{4}-\d{2}-\d{2}$/.test(base)) {
													isOverdue = base < today;
												}
											}

											decos.push(
												Decoration.inline(blockPos + cursor, blockPos + end, {
													class: `tag-interactive tag-due${isOverdue ? " tag-due-overdue" : ""}${hasTime ? " tag-due-timed" : ""}`,
													"data-filter-type": "due",
													"data-filter-value": base.toLowerCase() || "today",
												}),
											);
										}
										cursor = text.indexOf("due:", cursor + 1);
									}
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
