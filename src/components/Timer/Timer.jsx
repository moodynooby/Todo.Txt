import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X, Timer as TimerIcon } from "lucide-react";
import { formatTime } from "../../utils/timeFormat";

const Timer = ({ id, onRemove }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({
    x: 20 + (id % 5) * 20,
    y: 100 + (id % 10) * 30,
  });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleMouseDown = (e) => {
    // Don't drag if clicking buttons
    if (e.target.closest("button")) return;

    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
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
