export function safeGetItem<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		if (raw === null) return fallback;
		return JSON.parse(raw) as T;
	} catch (e) {
		console.warn(`Failed to read "${key}" from localStorage:`, e);
		return fallback;
	}
}

export function safeSetItem<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error(`Failed to write "${key}" to localStorage:`, e);
	}
}
