import { Play, Pause } from "lucide-react";
import type { Album } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { getAlbumTracks } from "@/data/music";

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
  const { currentTrack, isPlaying, playQueue } = usePlayer();
  const isCurrentAlbum = currentTrack?.albumId === album.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const albumTracks = getAlbumTracks(album.id);
    playQueue(albumTracks, 0);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-br from-green-950/60 to-emerald-950/60 hover:from-green-900/80 hover:to-emerald-900/80 rounded-lg p-4 transition-all cursor-pointer hover:rotate-2 hover:scale-105 border border-green-500/20"
    >
      <div className="relative mb-4 aspect-square">
        <img
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover rounded-md shadow-lg border-2 border-green-500/30 group-hover:border-lime-400/50 group-hover:rotate-3 transition-all"
        />
        <button
          onClick={handlePlay}
          className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center shadow-xl transition-all hover:scale-110 hover:rotate-12 ${
            isCurrentAlbum && isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          {isCurrentAlbum && isPlaying ? (
            <Pause size={20} fill="black" className="text-black" />
          ) : (
            <Play size={20} fill="black" className="text-black ml-0.5" />
          )}
        </button>
      </div>
      <h3 className="text-green-300 font-bold text-sm truncate group-hover:text-lime-400 transition-colors">{album.title}</h3>
      <p className="text-lime-500 text-sm truncate mt-1 group-hover:text-green-400 transition-colors">{album.artist}</p>
    </div>
  );
}
