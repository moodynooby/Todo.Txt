export const toggleFullscreen = (): void => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen().catch((err) => {
			console.error(`Error attempting to enable fullscreen: ${err.message}`);
		});
		return;
	}

	if (document.exitFullscreen) {
		document.exitFullscreen();
	}
};
