export const STORAGE_KEY = "todo_persist";

export type Density = "comfortable" | "compact";

export interface PersistedState {
	viewMode: string;
	sidebarCollapsed: boolean;
	density: Density;
	sidebar: {
		expandedSections: string[];
		search: string;
		showCompleted: boolean;
	};
}

export const defaults: PersistedState = {
	viewMode: "todo",
	sidebarCollapsed: false,
	density: "comfortable",
	sidebar: {
		expandedSections: ["priorities", "projects", "contexts", "dueDates"],
		search: "",
		showCompleted: false,
	},
};
