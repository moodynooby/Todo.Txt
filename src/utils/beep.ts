let ctx: AudioContext | null = null;

export const playBeep = (duration = 200, frequency = 880, volume = 0.3) => {
	try {
		if (!ctx) {
			ctx = new AudioContext();
		}
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = frequency;
		gain.gain.value = volume;
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + duration / 1000);
	} catch {
		// Audio context not available
	}
};
