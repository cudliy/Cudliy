import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const targetDate = new Date("October 1, 2024 00:00:00").getTime();
      
      // If the target date has passed, set it to next year
      const target = targetDate < now 
        ? new Date("October 1, 2025 00:00:00").getTime()
        : targetDate;
      
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow transform hover:scale-105 transition-transform duration-300">
          <span className="text-white font-bold text-lg md:text-xl">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-20 animate-pulse"></div>
      </div>
      <span className="text-sm font-medium text-muted-foreground mt-2 capitalize">
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Calendar className="h-4 w-4" />
          Launch Countdown
        </div>
        <h3 className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Get Ready for October 1st!
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Something amazing is coming
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-4 justify-center">
        <TimeUnit value={timeRemaining.days} label="days" />
        <TimeUnit value={timeRemaining.hours} label="hours" />
        <TimeUnit value={timeRemaining.minutes} label="minutes" />
        <TimeUnit value={timeRemaining.seconds} label="seconds" />
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Until the big reveal</span>
      </div>
    </div>
  );
};