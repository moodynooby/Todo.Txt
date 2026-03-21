import {
	ActionIcon,
	Box,
	Group,
	Paper,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Pause, Play, RotateCcw, Timer as TimerIcon, X } from "lucide-react";

dayjs.extend(duration);

import { useEffect, useRef, useState } from "react";
import { Z_INDEX } from "../../providers/layout";

const TIMER_BASE_X = 20;
const TIMER_BASE_Y = 100;
const TIMER_X_OFFSET = 20;
const TIMER_Y_OFFSET = 30;

const formatTime = (totalSeconds: number): string => {
	const hrs = Math.floor(totalSeconds / 3600);
	return dayjs
		.duration(totalSeconds, "seconds")
		.format(hrs > 0 ? "HH:mm:ss" : "mm:ss");
};

interface TimerProps {
	id: number;
	onRemove: (id: number) => void;
}

interface Position {
	x: number;
	y: number;
}

const Timer = ({ id, onRemove }: TimerProps) => {
	const [seconds, setSeconds] = useState(0);
	const [isActive, setIsActive] = useState(false);
	const [position, setPosition] = useState<Position>({
		x: TIMER_BASE_X + (id % 5) * TIMER_X_OFFSET,
		y: TIMER_BASE_Y + (id % 10) * TIMER_Y_OFFSET,
	});
	const [isDragging, setIsDragging] = useState(false);
	const offsetRef = useRef({ x: 0, y: 0 });
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";

	const handleMouseDown = (e: React.MouseEvent): void => {
		if ((e.target as Element).closest("button")) return;
		setIsDragging(true);
		offsetRef.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};

		const handleMouseMove = (e: MouseEvent): void => {
			setPosition({
				x: e.clientX - offsetRef.current.x,
				y: e.clientY - offsetRef.current.y,
			});
		};

		const handleMouseUp = (): void => {
			setIsDragging(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;
		if (isActive) {
			interval = setInterval(() => {
				setSeconds((s) => s + 1);
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive]);

	return (
		<Box
			component="div"
			style={{
				position: "fixed",
				left: position.x,
				top: position.y,
				zIndex: Z_INDEX.TIMER,
				cursor: isDragging ? "grabbing" : "move",
				opacity: isDragging ? 0.8 : 1,
				transition: isDragging ? "none" : "opacity 0.2s",
			}}
			onMouseDown={handleMouseDown}
		>
			<Paper p="sm" radius="md" shadow="md" bg={isDark ? "dark.7" : "white"}>
				<Group justify="space-between" mb="xs">
					<TimerIcon
						size={14}
						color="var(--mantine-color-violet-6)"
						style={{ opacity: 0.7 }}
					/>
					<ActionIcon
						variant="subtle"
						size="xs"
						color="gray"
						onClick={() => onRemove(id)}
						aria-label="Remove timer"
					>
						<X size={14} />
					</ActionIcon>
				</Group>

				<Text
					size="xl"
					fw={700}
					ff="monospace"
					c="violet.6"
					ta="center"
					mb="xs"
				>
					{formatTime(seconds)}
				</Text>

				<Group justify="center" gap="xs">
					<ActionIcon
						variant="subtle"
						size="sm"
						color="gray"
						onClick={() => setIsActive(!isActive)}
						aria-label={isActive ? "Pause timer" : "Start timer"}
					>
						{isActive ? <Pause size={14} /> : <Play size={14} />}
					</ActionIcon>
					<ActionIcon
						variant="subtle"
						size="sm"
						color="gray"
						onClick={() => {
							setSeconds(0);
							setIsActive(false);
						}}
						aria-label="Reset timer"
					>
						<RotateCcw size={14} />
					</ActionIcon>
				</Group>
			</Paper>
		</Box>
	);
};

export default Timer;
