import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X, Timer as TimerIcon } from "lucide-react";

// Timer positioning
const TIMER_BASE_X = 20;
const TIMER_BASE_Y = 100;
const TIMER_X_OFFSET = 20;
const TIMER_Y_OFFSET = 30;

const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs > 0 ? hrs.toString().padStart(2, "0") + ":" : ""}${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Timer = ({ id, onRemove }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({
    x: TIMER_BASE_X + (id % 5) * TIMER_X_OFFSET,
    y: TIMER_BASE_Y + (id % 10) * TIMER_Y_OFFSET,
  });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div
      className="floating-timer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isDragging ? 0.8 : 1,
        transition: isDragging ? "none" : "opacity 0.2s",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between w-full items-center mb-1">
        <TimerIcon size={14} className="text-primary opacity-70" />
        <button
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
          onClick={() => setIsActive(!isActive)}
          className="btn btn-xs btn-circle btn-ghost"
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
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
