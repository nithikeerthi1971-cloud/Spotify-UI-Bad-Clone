import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Mic2,
  ListMusic,
  Maximize2,
  BatteryLow,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/data/music";
import { useState, useRef, useEffect } from "react";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    muted,
    repeat,
    shuffle,
    trollTogglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    isLiked,
    toggleLike,
    trollMessage,
    batteryLevel,
    networkStatus,
    showLoading,
  } = usePlayer();

  const [volPos, setVolPos] = useState({ x: 0, y: 0 });
  const [volRunning, setVolRunning] = useState(false);
  const volRef = useRef<HTMLDivElement>(null);

  const dur = duration || currentTrack?.duration || 0;
  const liked = currentTrack ? isLiked(currentTrack.id) : false;
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!volRef.current) return;
      const rect = volRef.current.getBoundingClientRect();
      const sliderCx = rect.left + rect.width / 2;
      const sliderCy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - sliderCx, e.clientY - sliderCy);

      if (dist < 100) {
        setVolRunning(true);
        const maxX = window.innerWidth - 180;
        const maxY = window.innerHeight - 120;
        const newX = Math.random() * maxX - maxX / 2;
        const newY = Math.random() * (maxY - 100) - (maxY - 100) / 2;
        setVolPos({ x: newX, y: newY });
      } else if (dist > 200) {
        setVolRunning(false);
        setVolPos({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-[88px] bg-gradient-to-r from-green-950 via-emerald-950 to-lime-950 px-4 flex items-center justify-between gap-4 border-t-2 border-green-500/40 relative">
      {/* Battery indicator */}
      <div className={`absolute top-1 right-4 flex items-center gap-1 text-xs font-bold ${batteryLevel < 20 ? "text-red-500 animate-pulse" : batteryLevel < 50 ? "text-yellow-500" : "text-green-400"}`}>
        <BatteryLow size={14} />
        {batteryLevel}%
        {batteryLevel < 15 && <span className="ml-1 text-red-400">LOW BATTERY!</span>}
      </div>

      {/* Network indicator */}
      <div className={`absolute top-1 left-4 flex items-center gap-1 text-xs font-bold ${networkStatus === "disconnected" ? "text-red-500 animate-pulse" : networkStatus === "weak" ? "text-yellow-500" : "text-green-400"}`}>
        {networkStatus === "disconnected" ? <WifiOff size={14} /> : <Wifi size={14} />}
        {networkStatus === "disconnected" ? "NO NETWORK" : networkStatus === "weak" ? "WEAK SIGNAL" : "ONLINE"}
      </div>

      {/* Troll message */}
      {trollMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-400 text-black font-bold text-sm px-4 py-2 rounded-lg shadow-xl z-50 animate-bounce whitespace-nowrap max-w-[90vw] border-2 border-lime-300">
          {trollMessage}
        </div>
      )}

      {/* Loading overlay */}
      {showLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <Loader2 size={24} className="animate-spin text-green-400" />
          <span className="ml-2 text-green-400 font-bold text-sm">Loading... maybe...</span>
        </div>
      )}

      {/* Left: track info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.cover}
              alt={currentTrack.album}
              className="w-14 h-14 rounded-md object-cover shrink-0 border-2 border-green-500 hover:rotate-12 transition-transform"
            />
            <div className="min-w-0">
              <p className="text-sm text-green-300 font-medium truncate hover:underline cursor-pointer hover:text-lime-300 transition-colors">
                {currentTrack.title}
              </p>
              <p className="text-xs text-lime-400 truncate hover:underline hover:text-white cursor-pointer">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`ml-2 shrink-0 transition-colors ${liked ? "text-green-400" : "text-neutral-400 hover:text-green-300"}`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
          </>
        ) : (
          <div className="text-sm text-green-500 font-bold">Select a song... if you dare</div>
        )}
      </div>

      {/* Center: controls + progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[45%]">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`transition-colors ${shuffle ? "text-green-400" : "text-neutral-400 hover:text-green-300"}`}
            title="Shuffle"
          >
            <Shuffle size={18} className={shuffle ? "animate-wiggle" : ""} />
          </button>
          <button
            onClick={prev}
            className="text-neutral-300 hover:text-green-300 transition-colors"
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          {/* TROLL PLAY BUTTON */}
          <button
            onClick={trollTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center hover:scale-110 hover:rotate-180 transition-all shadow-lg"
            title="Play... or maybe not"
          >
            {isPlaying ? (
              <Pause size={18} fill="black" className="text-black" />
            ) : (
              <Play size={18} fill="black" className="text-black ml-0.5" />
            )}
          </button>
          <button
            onClick={next}
            className="text-neutral-300 hover:text-green-300 transition-colors"
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button
            onClick={toggleRepeat}
            className={`transition-colors ${repeat !== "off" ? "text-green-400" : "text-neutral-400 hover:text-green-300"}`}
            title="Repeat"
          >
            {repeat === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-green-400 tabular-nums w-10 text-right">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={dur || 1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 troll-range"
            style={{ "--progress": `${dur > 0 ? (progress / dur) * 100 : 0}%` } as React.CSSProperties}
          />
          <span className="text-xs text-green-400 tabular-nums w-10">
            {formatTime(dur)}
          </span>
        </div>
      </div>

      {/* Right: volume + extras - THE RUNAWAY SLIDER */}
      <div className="flex items-center gap-3 justify-end w-[25%] min-w-0 relative">
        <button className="text-neutral-400 hover:text-green-300 transition-colors hidden lg:block" title="Lyrics">
          <Mic2 size={18} />
        </button>
        <button className="text-neutral-400 hover:text-green-300 transition-colors hidden lg:block" title="Queue">
          <ListMusic size={18} />
        </button>
        <div
          ref={volRef}
          className="flex items-center gap-1 transition-all duration-300 ease-out"
          style={{
            transform: volRunning ? `translate(${volPos.x}px, ${volPos.y}px)` : "translate(0,0)",
            position: volRunning ? "fixed" : "relative",
            zIndex: volRunning ? 9999 : "auto",
            right: volRunning ? "auto" : 0,
          }}
        >
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-green-300 transition-colors"
            title="Mute"
          >
            <VolumeIcon size={20} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 troll-range"
            style={{ "--progress": `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
          />
        </div>
        <button className="text-neutral-400 hover:text-green-300 transition-colors hidden lg:block" title="Full screen">
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
