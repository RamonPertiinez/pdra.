import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const total = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, total };
}

interface CountdownProps {
  targetDate: string;
  size?: "sm" | "lg";
  className?: string;
  labelDays?: string;
  labelHours?: string;
  labelMinutes?: string;
  labelSeconds?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const Countdown = ({
  targetDate,
  size = "lg",
  className = "",
  labelDays = "dies",
  labelHours = "hores",
  labelMinutes = "min",
  labelSeconds = "seg",
}: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) return null;

  if (size === "sm") {
    return (
      <div className={`flex items-center gap-3 font-mono-tech ${className}`}>
        <span className="text-white text-xl">{pad(timeLeft.days)}</span>
        <span className="text-white/30 text-xs">d</span>
        <span className="text-white text-xl">{pad(timeLeft.hours)}</span>
        <span className="text-white/30 text-xs">h</span>
        <span className="text-white text-xl">{pad(timeLeft.minutes)}</span>
        <span className="text-white/30 text-xs">m</span>
        <span className="text-white text-xl">{pad(timeLeft.seconds)}</span>
        <span className="text-white/30 text-xs">s</span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {[
        { value: pad(timeLeft.days), label: labelDays },
        { value: pad(timeLeft.hours), label: labelHours },
        { value: pad(timeLeft.minutes), label: labelMinutes },
        { value: pad(timeLeft.seconds), label: labelSeconds },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <div className="rounded-[14px] border border-white/10 bg-black/30 px-3 py-3 w-full text-center backdrop-blur-sm">
            <span className="font-mono-tech text-2xl md:text-3xl text-white tabular-nums">{value}</span>
          </div>
          <span className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-white/35">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
