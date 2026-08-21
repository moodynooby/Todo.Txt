import { Box } from "@mantine/core";
import { useEffect, useState } from "react";

/**
 * One-shot confetti burst for the "all tasks done" moment (`cheer` mood).
 *
 * Deliberately quiet: ~14 small particles in the three brand scales,
 * gone in 1.4s, and skipped entirely under `prefers-reduced-motion`
 * (DESIGN.md motion rules).
 */

const PARTICLE_COUNT = 14;

export default function CelebrationBurst({ active }: { active: boolean }) {
	const [visible, setVisible] = useState(false);
	const [burstKey, setBurstKey] = useState(0);

	useEffect(() => {
		if (!active) return undefined;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return undefined;
		}
		setVisible(true);
		setBurstKey((k) => k + 1);
		const t = window.setTimeout(() => setVisible(false), 1400);
		return () => window.clearTimeout(t);
	}, [active]);

	if (!visible) return null;

	return (
		<Box key={burstKey} className="celebration-burst" aria-hidden="true">
			{Array.from({ length: PARTICLE_COUNT }, (_, i) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: static particle list
					key={i}
					className="celebration-particle"
					style={
						{
							"--angle": `${(i / PARTICLE_COUNT) * 360 + Math.random() * 14}deg`,
							"--distance": `${72 + Math.random() * 64}px`,
							animationDelay: `${Math.random() * 120}ms`,
						} as React.CSSProperties
					}
				/>
			))}
		</Box>
	);
}
