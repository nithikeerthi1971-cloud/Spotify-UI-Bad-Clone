import { Play, Pause, Heart, Clock } from "lucide-react";
import type { Track } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/data/music";

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showArt?: boolean;
  numbered?: boolean;
}

export default function TrackList({
  tracks,
  showAlbum = true,
  showArt = false,
  numbered = true,
}: TrackListProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, isLiked, toggleLike } = usePlayer();

  return (
    <div className="flex flex-col">
      {/* Header row */}
      <div className="grid items-center gap-4 px-4 py-2 border-b border-green-500/30 text-xs uppercase tracking-wider text-lime-400 font-bold sticky top-0 bg-neutral-900/95 backdrop-blur z-10">
        <div
          className="grid items-center gap-4"
          style={{
            gridTemplateColumns: `${numbered ? "16px " : ""}1.5fr ${showAlbum ? "1fr" : ""} 50px`,
          }}
        >
          <span className="text-center">{numbered ? "#" : ""}</span>
          <span>Title (probably wrong)</span>
          {showAlbum && <span className="hidden md:block">Album</span>}
          <span className="flex justify-end">
            <Clock size={14} />
          </span>
        </div>
      </div>

      {/* Track rows */}
      {tracks.map((track, i) => {
        const isCurrent = currentTrack?.id === track.id;
        const liked = isLiked(track.id);

        return (
          <div
            key={track.id}
            onDoubleClick={() => playTrack(track, tracks)}
            className={`group grid items-center gap-4 px-4 py-2 rounded-md transition-all cursor-default hover:translate-x-2 ${
              isCurrent ? "bg-gradient-to-r from-green-900/50 to-lime-900/50" : "hover:bg-green-900/20"
            }`}
            style={{
              gridTemplateColumns: `${numbered ? "16px " : ""}1.5fr ${showAlbum ? "1fr" : ""} 50px`,
            }}
          >
            {/* Index / play button */}
            <div className="flex items-center justify-center w-4">
              <span
                className={`text-sm group-hover:hidden ${isCurrent ? "text-green-400" : "text-lime-500"}`}
              >
                {isCurrent && isPlaying ? (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 bg-green-400 animate-eq-bar" style={{ animationDelay: "0ms" }} />
                    <span className="w-0.5 bg-green-400 animate-eq-bar" style={{ animationDelay: "150ms" }} />
                    <span className="w-0.5 bg-green-400 animate-eq-bar" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : (
                  i + 1
                )}
              </span>
              <button
                onClick={() => (isCurrent ? togglePlay() : playTrack(track, tracks))}
                className="hidden group-hover:flex items-center justify-center text-green-400"
              >
                {isCurrent && isPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </button>
            </div>

            {/* Title + art */}
            <div className="flex items-center gap-3 min-w-0">
              {showArt && (
                <img
                  src={track.cover}
                  alt={track.album}
                  className="w-10 h-10 rounded shrink-0 object-cover border border-green-500/30 group-hover:rotate-12 group-hover:scale-110 transition-transform"
                />
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium truncate ${isCurrent ? "text-green-400" : "text-green-300 group-hover:text-lime-400"} transition-colors`}
                >
                  {track.title}
                </p>
                <p className="text-sm text-lime-500 truncate group-hover:text-emerald-400 transition-colors">{track.artist}</p>
              </div>
            </div>

            {/* Album */}
            {showAlbum && (
              <p className="text-sm text-teal-400 truncate hidden md:block hover:text-green-400 transition-colors">{track.album}</p>
            )}

            {/* Duration + like */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => toggleLike(track.id)}
                className={`transition-opacity ${liked ? "text-green-400 opacity-100" : "text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-green-400"}`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
              </button>
              <span className="text-sm text-lime-500 tabular-nums">{formatTime(track.duration)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
