export const computeElapsed = (
	baseElapsed: number,
	startTime: number,
): number => {
	return baseElapsed + Math.floor((Date.now() - startTime) / 1000);
};

export const formatTime = (totalSeconds: number): string => {
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	const pad = (n: number) => String(n).padStart(2, "0");
	return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};
