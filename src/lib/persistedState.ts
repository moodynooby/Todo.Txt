export const STORAGE_KEY = "todo_persist";

export interface PersistedState {
	viewMode: string;
	sidebarCollapsed: boolean;
	sidebar: {
		expandedSections: string[];
		search: string;
		showCompleted: boolean;
	};
}

export const defaults: PersistedState = {
	viewMode: "todo",
	sidebarCollapsed: false,
	sidebar: {
		expandedSections: [
			"priorities",
			"projects",
			"contexts",
			"dueDates",
			"tips",
		],
		search: "",
		showCompleted: false,
	},
};
