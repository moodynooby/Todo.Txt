import {
	ActionIcon,
	FloatingWindow,
	Group,
	RingProgress,
	Stack,
	Text,
} from "@mantine/core";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerState } from "../../hooks/useTimers";
import { playBeep } from "../../utils/beep";
import { computeElapsed, formatTime } from "../../utils/formatTime";

interface TimerProps {
	timer: TimerState;
	onRemove: (id: number) => void;
	onUpdate: (id: number, updates: Partial<Omit<TimerState, "id">>) => void;
}

const getTimerColor = (seconds: number) => {
	if (seconds < 600) return "teal";
	if (seconds < 1800) return "yellow";
	return "red";
};

const Timer = ({ timer, onRemove, onUpdate }: TimerProps) => {
	const initialPos = useRef({
		top: timer.position.top,
		left: timer.position.left,
	});
	const startTimeRef = useRef(timer.startTime);
	const baseElapsedRef = useRef(timer.elapsed);
	const [displaySeconds, setDisplaySeconds] = useState(() => {
		if (timer.isActive && timer.startTime !== null) {
			return computeElapsed(timer.elapsed, timer.startTime);
		}
		return timer.elapsed;
	});

	useEffect(() => {
		if (!timer.isActive) return;
		const tick = () => {
			if (startTimeRef.current !== null) {
				setDisplaySeconds(
					computeElapsed(baseElapsedRef.current, startTimeRef.current),
				);
			}
		};
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [timer.isActive]);

	const handlePositionChange = useCallback(
		(pos: { x: number; y: number }) => {
			onUpdate(timer.id, { position: { top: pos.y, left: pos.x } });
		},
		[timer.id, onUpdate],
	);

	const handlePlayPause = () => {
		const startTime = startTimeRef.current;
		if (timer.isActive && startTime !== null) {
			const currentElapsed = computeElapsed(baseElapsedRef.current, startTime);
			baseElapsedRef.current = currentElapsed;
			startTimeRef.current = null;
			setDisplaySeconds(currentElapsed);
			playBeep(100, 660);
			onUpdate(timer.id, {
				elapsed: currentElapsed,
				isActive: false,
				startTime: null,
			});
		} else if (!timer.isActive) {
			const now = Date.now();
			startTimeRef.current = now;
			playBeep(100, 880);
			onUpdate(timer.id, {
				elapsed: baseElapsedRef.current,
				isActive: true,
				startTime: now,
			});
		}
	};

	const handleReset = () => {
		baseElapsedRef.current = 0;
		startTimeRef.current = null;
		setDisplaySeconds(0);
		playBeep();
		onUpdate(timer.id, {
			elapsed: 0,
			isActive: false,
			startTime: null,
		});
	};

	const progress =
		displaySeconds > 0 ? Math.min((displaySeconds / 3600) * 100, 100) : 0;
	const color = getTimerColor(displaySeconds);

	return (
		<FloatingWindow
			w={190}
			p="sm"
			withBorder
			shadow="md"
			excludeDragHandleSelector="button"
			initialPosition={initialPos.current}
			constrainToViewport
			onPositionChange={handlePositionChange}
			style={{ cursor: "move", touchAction: "none" }}
		>
			<Stack align="center" gap="xs">
				<RingProgress
					size={120}
					thickness={10}
					roundCaps
					transitionDuration={500}
					sections={[{ value: progress, color }]}
					rootColor="var(--mantine-color-dark-4)"
					label={
						<Text c={color} ff="monospace" fw={700} size="xl" ta="center">
							{formatTime(displaySeconds)}
						</Text>
					}
				/>
				<Group gap="xs">
					<ActionIcon
						variant="subtle"
						size="sm"
						color="gray"
						onClick={handlePlayPause}
						aria-label={timer.isActive ? "Pause timer" : "Start timer"}
					>
						{timer.isActive ? <Pause size={16} /> : <Play size={16} />}
					</ActionIcon>
					<ActionIcon
						variant="subtle"
						size="sm"
						color="gray"
						onClick={handleReset}
						aria-label="Reset timer"
					>
						<RotateCcw size={16} />
					</ActionIcon>
					<ActionIcon
						variant="subtle"
						size="sm"
						color="gray"
						onClick={() => onRemove(timer.id)}
						aria-label="Remove timer"
					>
						<X size={16} />
					</ActionIcon>
				</Group>
			</Stack>
		</FloatingWindow>
	);
};

export default Timer;
