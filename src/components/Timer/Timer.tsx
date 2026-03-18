import { Pause, Play, RotateCcw, Timer as TimerIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TIMER_BASE_X = 20;
const TIMER_BASE_Y = 100;
const TIMER_X_OFFSET = 20;
const TIMER_Y_OFFSET = 30;

const formatTime = (totalSeconds: number): string => {
	const hrs = Math.floor(totalSeconds / 3600);
	const mins = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;
	return `${hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : ""}${mins
		.toString()
		.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
		// biome-ignore lint/a11y/noStaticElementInteractions: Draggable timer element
		<div
			className={`floating-timer ${isDragging ? "dragging" : ""}`}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
			}}
			onMouseDown={handleMouseDown}
		>
			<div className="flex justify-between w-full items-center mb-1">
				<TimerIcon size={14} className="text-primary opacity-70" />
				<button
					type="button"
					onClick={() => onRemove(id)}
					className="text-base-content hover:text-error transition-colors"
				>
					<X size={14} />
				</button>
			</div>
			<div className="timer-display font-mono text-primary">
				{formatTime(seconds)}
			</div>
			<div className="timer-controls">
				<button
					type="button"
					onClick={() => setIsActive(!isActive)}
					className="btn btn-xs btn-circle btn-ghost"
				>
					{isActive ? <Pause size={14} /> : <Play size={14} />}
				</button>
				<button
					type="button"
					onClick={() => {
						setSeconds(0);
						setIsActive(false);
					}}
					className="btn btn-xs btn-circle btn-ghost"
				>
					<RotateCcw size={14} />
				</button>
			</div>
		</div>
	);
};

export default Timer;
