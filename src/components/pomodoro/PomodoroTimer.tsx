import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { CircularProgress } from "./CircularProgress";

interface PomodoroTimerProps {
  activeTask?: Task;
  onComplete: () => void;
}

export function PomodoroTimer({ activeTask, onComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    onComplete();
    if (!isBreak) {
      setIsBreak(true);
      setTimeLeft(5 * 60); // 5 minute break
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center">
      <CircularProgress
        percentage={(timeLeft / (isBreak ? 300 : 1500)) * 100}
        size={200}
      >
        <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
        <div className="text-sm text-gray-500">
          {isBreak ? "Break Time" : "Focus Time"}
        </div>
      </CircularProgress>

      {activeTask && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Current Task</h3>
          <p className="text-sm text-gray-600">{activeTask.title}</p>
        </div>
      )}

      <div className="mt-6 space-x-4">
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "destructive" : "default"}
        >
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsActive(false);
            setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
