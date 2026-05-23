import { ActionIcon, FloatingWindow, Group, Text } from "@mantine/core";
import { Pause, Play, RotateCcw, Timer as TimerIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerState } from "../../hooks/useTimers";
import { playBeep } from "../../utils/beep";
import { computeElapsed, formatTime } from "../../utils/formatTime";

interface TimerProps {
	timer: TimerState;
	onRemove: (id: number) => void;
	onStateChange: (
		id: number,
		elapsed: number,
		isActive: boolean,
		startTime: number | null,
	) => void;
	onPositionChange: (
		id: number,
		position: { top: number; left: number },
	) => void;
}

const Timer = ({
	timer,
	onRemove,
	onStateChange,
	onPositionChange,
}: TimerProps) => {
	const startTimeRef = useRef(timer.startTime);
	const baseElapsedRef = useRef(timer.elapsed);
	const [isActive, setIsActive] = useState(timer.isActive);
	const [displaySeconds, setDisplaySeconds] = useState(() => {
		if (timer.isActive && timer.startTime !== null) {
			return computeElapsed(timer.elapsed, timer.startTime);
		}
		return timer.elapsed;
	});

	useEffect(() => {
		if (!isActive) return;
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
	}, [isActive]);

	const handlePositionChange = useCallback(
		(pos: { x: number; y: number }) => {
			onPositionChange(timer.id, { top: pos.y, left: pos.x });
		},
		[timer.id, onPositionChange],
	);

	const handlePlayPause = () => {
		const startTime = startTimeRef.current;
		if (isActive && startTime !== null) {
			const currentElapsed = computeElapsed(baseElapsedRef.current, startTime);
			baseElapsedRef.current = currentElapsed;
			startTimeRef.current = null;
			setDisplaySeconds(currentElapsed);
			setIsActive(false);
			playBeep(100, 660);
			onStateChange(timer.id, currentElapsed, false, null);
		} else if (!isActive) {
			const now = Date.now();
			startTimeRef.current = now;
			setIsActive(true);
			playBeep(100, 880);
			onStateChange(timer.id, baseElapsedRef.current, true, now);
		}
	};

	const handleReset = () => {
		baseElapsedRef.current = 0;
		startTimeRef.current = null;
		setDisplaySeconds(0);
		setIsActive(false);
		playBeep();
		onStateChange(timer.id, 0, false, null);
	};

	return (
		<FloatingWindow
			w={160}
			p="sm"
			withBorder
			shadow="md"
			dragHandleSelector=".timer-drag-handle"
			excludeDragHandleSelector="button"
			initialPosition={{ top: timer.position.top, left: timer.position.left }}
			constrainToViewport
			onPositionChange={handlePositionChange}
			style={{ cursor: "move", touchAction: "none" }}
		>
			<Group justify="space-between" mb="xs" className="timer-drag-handle">
				<TimerIcon
					size={14}
					color="var(--mantine-primary-color-6)"
					style={{ opacity: 0.7 }}
				/>
				<ActionIcon
					variant="subtle"
					size="xs"
					color="gray"
					onClick={() => onRemove(timer.id)}
					aria-label="Remove timer"
				>
					<X size={14} />
				</ActionIcon>
			</Group>

			<Text
				size="xl"
				fw={700}
				ff="monospace"
				c="var(--mantine-primary-color-6)"
				ta="center"
				mb="xs"
			>
				{formatTime(displaySeconds)}
			</Text>

			<Group justify="center" gap="xs">
				<ActionIcon
					variant="subtle"
					size="sm"
					color="gray"
					onClick={handlePlayPause}
					aria-label={isActive ? "Pause timer" : "Start timer"}
				>
					{isActive ? <Pause size={14} /> : <Play size={14} />}
				</ActionIcon>
				<ActionIcon
					variant="subtle"
					size="sm"
					color="gray"
					onClick={handleReset}
					aria-label="Reset timer"
				>
					<RotateCcw size={14} />
				</ActionIcon>
			</Group>
		</FloatingWindow>
	);
};

export default Timer;
