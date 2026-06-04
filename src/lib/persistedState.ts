import type { FirestoreSyncState } from "@/hooks/useFirestoreSync";

export const STORAGE_KEY = "todo_persist";

export interface PersistedState {
	viewMode: string;
	sidebarCollapsed: boolean;
	sidebar: {
		expandedSections: string[];
		search: string;
		showCompleted: boolean;
	};
	syncBackup?: {
		data: FirestoreSyncState;
		savedAt: number;
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

function readAll(): PersistedState {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...defaults, sidebar: { ...defaults.sidebar } };
		const parsed = JSON.parse(raw) as Partial<PersistedState>;
		return {
			...defaults,
			...parsed,
			sidebar: { ...defaults.sidebar, ...parsed.sidebar },
		};
	} catch {
		return { ...defaults, sidebar: { ...defaults.sidebar } };
	}
}

function writeAll(state: PersistedState): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateBackup(backup: FirestoreSyncState): void {
	const state = readAll();
	state.syncBackup = { data: backup, savedAt: Date.now() };
	writeAll(state);
}

export function readBackup(): {
	data: FirestoreSyncState;
	savedAt: number;
} | null {
	return readAll().syncBackup ?? null;
}
