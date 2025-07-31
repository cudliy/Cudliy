import { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypingEffect = ({ 
  text, 
  speed = 100, 
  delay = 0, 
  className = "", 
  onComplete 
}: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, isStarted, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse ml-1 text-primary">|</span>
      )}
    </span>
  );
};

interface MultiLineTypingEffectProps {
  lines: string[];
  speed?: number;
  lineDelay?: number;
  className?: string;
}

export const MultiLineTypingEffect = ({ 
  lines, 
  speed = 100, 
  lineDelay = 800, 
  className = "" 
}: MultiLineTypingEffectProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  const handleLineComplete = () => {
    setCompletedLines(prev => [...prev, lines[currentLineIndex]]);
    if (currentLineIndex < lines.length - 1) {
      setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, lineDelay);
    }
  };

  return (
    <div className={className}>
      {completedLines.map((line, index) => (
        <div key={index}>
          {line}
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <TypingEffect
          text={lines[currentLineIndex]}
          speed={speed}
          onComplete={handleLineComplete}
        />
      )}
    </div>
  );
};