export type SyncStatus =
	| "disconnected"
	| "connecting"
	| "synced"
	| "syncing"
	| "error";

export interface ExcalidrawData {
	elements: readonly unknown[];
	appState: Record<string, unknown>;
	scrollToContent?: boolean;
}

export interface BackupData {
	content: string;
	updatedAt: number;
}
