import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  onDone: () => void;
}

const loadingMessages = [
  "Loading songs...",
  "Connecting to server...",
  "Server is taking a coffee break...",
  "Downloading 47MB of ads...",
  "Checking your subscription status...",
  "Verifying your existence...",
  "Aligning the planets...",
  "Almost there... maybe...",
  "Just kidding, still loading...",
  "Have you tried turning it off and on again?",
];

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (Math.random() < 0.3) return prev;
        const inc = Math.random() * 15;
        const next = Math.min(100, prev + inc);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 500);
        }
        return next;
      });
    }, 400);

    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(msgInterval);
    };
  }, [onDone]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-950 via-emerald-950 to-lime-950">
      <Loader2 size={48} className="animate-spin text-green-400 mb-6" />
      <div className="w-64 h-3 bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-lime-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-green-400 font-bold text-sm text-center max-w-xs animate-pulse">
        {loadingMessages[msgIndex]}
      </p>
      <p className="text-neutral-500 text-xs mt-2">{Math.floor(progress)}% (probably lying)</p>
    </div>
  );
}
