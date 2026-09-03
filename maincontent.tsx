import { Play, Pause, Heart, MoreHorizontal, AlertTriangle } from "lucide-react";
import type { Album, Track } from "@/types";
import { albums, tracks as allTracks, playlists, getAlbumTracks } from "@/data/music";
import AlbumCard from "@/components/AlbumCard";
import TrackList from "@/components/TrackList";
import { usePlayer } from "@/context/PlayerContext";

interface MainContentProps {
  view: "home" | "search" | "library" | "album" | "playlist";
  selectedAlbumId: string | null;
  selectedPlaylistId: string | null;
  searchQuery: string;
  onOpenAlbum: (id: string) => void;
}

export default function MainContent({
  view,
  selectedAlbumId,
  selectedPlaylistId,
  searchQuery,
  onOpenAlbum,
}: MainContentProps) {
  const { currentTrack, isPlaying, playQueue, togglePlay, networkStatus } = usePlayer();

  // ---- HOME ----
  if (view === "home") {
    const greeting = (() => {
      const h = new Date().getHours();
      if (h < 12) return "Good morning (if you say so)";
      if (h < 18) return "Good afternoon (allegedly)";
      return "Good evening (or is it?)";
    })();

    const quickPicks = albums.slice(0, 6);

    return (
      <div className="px-6 pb-8">
        <h1 className="text-2xl font-bold text-green-400 mb-6 animate-drift-rotate" style={{ fontFamily: "monospace" }}>{greeting}</h1>

        {/* Network warning banner */}
        {networkStatus !== "connected" && (
          <div className="mb-6 bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-3 flex items-center gap-2 animate-pulse">
            <AlertTriangle size={18} className="text-red-400" />
            <span className="text-red-300 text-sm font-bold">
              {networkStatus === "disconnected" ? "NETWORK DISCONNECTED! Songs may not load. Or they might. Who knows." : "WEAK NETWORK SIGNAL! Things might be slow."}
            </span>
          </div>
        )}

        {/* Quick pick cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {quickPicks.map((album) => {
            const isCurrent = currentTrack?.albumId === album.id;
            return (
              <div
                key={album.id}
                onClick={() => onOpenAlbum(album.id)}
                className="group flex items-center gap-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 hover:from-green-800/60 hover:to-emerald-800/60 rounded-md cursor-pointer transition-all overflow-hidden hover:skew-x-2 hover:rotate-1"
              >
                <img src={album.cover} alt={album.title} className="w-16 h-16 object-cover shrink-0 border-r-2 border-green-500/30" />
                <span className="text-green-300 font-bold text-sm truncate flex-1 group-hover:text-lime-400 transition-colors">{album.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCurrent) togglePlay();
                    else playQueue(getAlbumTracks(album.id), 0);
                  }}
                  className="mr-4 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:rotate-12 shrink-0"
                >
                  {isCurrent && isPlaying ? (
                    <Pause size={18} fill="black" className="text-black" />
                  ) : (
                    <Play size={18} fill="black" className="text-black ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <Section title="Popular Albums (in no particular order)" onSeeAll={() => {}}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} onClick={() => onOpenAlbum(album.id)} />
            ))}
          </div>
        </Section>

        <Section title="Trending Now (allegedly)" onSeeAll={() => {}}>
          <TrackList tracks={allTracks.slice(0, 8)} showAlbum={true} showArt={true} />
        </Section>
      </div>
    );
  }

  // ---- SEARCH ----
  if (view === "search") {
    const q = searchQuery.trim().toLowerCase();
    let filteredTracks: Track[] = [];
    let filteredAlbums: Album[] = [];

    if (q) {
      filteredTracks = allTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q)
      );
      filteredAlbums = albums.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artist.toLowerCase().includes(q)
      );

      // TROLL: randomly add irrelevant results
      if (q.length > 2 && Math.random() < 0.5) {
        const randomTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
        if (!filteredTracks.includes(randomTrack)) {
          filteredTracks = [randomTrack, ...filteredTracks];
        }
      }
    }

    if (!q) {
      const categories = [
        { name: "Pop", color: "from-green-600 to-emerald-700" },
        { name: "Hip-Hop", color: "from-lime-600 to-green-800" },
        { name: "Rock", color: "from-teal-600 to-green-900" },
        { name: "Electronic", color: "from-emerald-600 to-teal-800" },
        { name: "Chill", color: "from-green-500 to-emerald-800" },
        { name: "Tamil Hits", color: "from-green-700 to-lime-900" },
        { name: "Jazz", color: "from-lime-500 to-green-700" },
        { name: "Classical", color: "from-teal-500 to-emerald-800" },
        { name: "Workout", color: "from-green-400 to-lime-700" },
        { name: "Focus", color: "from-emerald-500 to-green-800" },
        { name: "Party", color: "from-lime-400 to-green-600" },
        { name: "Sleep", color: "from-green-800 to-emerald-950" },
      ];

      return (
        <div className="px-6 pb-8">
          <h1 className="text-2xl font-bold text-green-400 mb-6 animate-drift-rotate" style={{ fontFamily: "monospace" }}>Browse all (good luck)</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                className={`relative aspect-[16/10] rounded-lg bg-gradient-to-br ${cat.color} overflow-hidden cursor-pointer hover:scale-105 hover:rotate-3 transition-all`}
              >
                <span className="absolute top-4 left-4 text-white font-bold text-xl drop-shadow-lg">
                  {cat.name}
                </span>
                <div className="absolute -bottom-2 -right-2 w-24 h-24 rotate-25 rounded-md overflow-hidden shadow-2xl">
                  <img
                    src={albums[i % albums.length].cover}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="px-6 pb-8">
        {filteredAlbums.length > 0 && (
          <Section title="Albums (might be wrong)" onSeeAll={() => {}}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} onClick={() => onOpenAlbum(album.id)} />
              ))}
            </div>
          </Section>
        )}

        {filteredTracks.length > 0 ? (
          <Section title="Songs (will play different audio)" onSeeAll={() => {}}>
            <TrackList tracks={filteredTracks} showAlbum={true} showArt={true} />
          </Section>
        ) : (
          filteredAlbums.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-bold text-green-500 mb-2 animate-wiggle">No results found</h2>
              <p className="text-lime-400">
                Try searching for something else. Or don't. We don't care.
              </p>
            </div>
          )
        )}
      </div>
    );
  }

  // ---- LIBRARY ----
  if (view === "library") {
    return (
      <div className="px-6 pb-8">
        <h1 className="text-2xl font-bold text-green-400 mb-6 animate-drift-rotate" style={{ fontFamily: "monospace" }}>Your Library (messy)</h1>

        <Section title="Playlists" onSeeAll={() => {}}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {playlists.map((pl, i) => (
              <div
                key={pl.id}
                className="group bg-gradient-to-br from-green-950/60 to-emerald-950/60 hover:from-green-900/80 hover:to-emerald-900/80 rounded-lg p-4 transition-all cursor-pointer hover:scale-105 hover:rotate-1 border border-green-500/20"
              >
                <div className="relative mb-4 aspect-square">
                  <div className={`w-full h-full rounded-md overflow-hidden ${i === 0 ? "bg-gradient-to-br from-green-400 to-lime-300 flex items-center justify-center" : ""}`}>
                    {i === 0 ? (
                      <Heart size={32} fill="white" className="text-white group-hover:animate-spin" />
                    ) : (
                      <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                    )}
                  </div>
                </div>
                <h3 className="text-green-300 font-bold text-sm truncate group-hover:text-lime-400 transition-colors">{pl.name}</h3>
                <p className="text-lime-500 text-sm truncate mt-1">{pl.trackCount} songs</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Albums" onSeeAll={() => {}}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} onClick={() => onOpenAlbum(album.id)} />
            ))}
          </div>
        </Section>
      </div>
    );
  }

  // ---- ALBUM DETAIL ----
  if (view === "album" && selectedAlbumId) {
    const album = albums.find((a) => a.id === selectedAlbumId);
    if (!album) return null;
    const albumTracks = getAlbumTracks(album.id);
    const isCurrentAlbum = currentTrack?.albumId === album.id;
    const totalDuration = albumTracks.reduce((sum, t) => sum + t.duration, 0);
    const totalMin = Math.floor(totalDuration / 60);

    return (
      <div>
        <div
          className="flex items-end gap-6 px-6 pt-6 pb-8"
          style={{
            background: `linear-gradient(to bottom, rgba(0,30,10,0.7), transparent), url(${album.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        >
          <div className="w-48 h-48 lg:w-56 lg:h-56 shrink-0 rounded-md overflow-hidden shadow-2xl border-4 border-green-500/30 hover:rotate-6 hover:scale-105 transition-all">
            <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <span className="text-xs font-bold text-green-400 uppercase">Album (space-themed)</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-green-300 drop-shadow-lg animate-drift-rotate" style={{ fontFamily: "monospace" }}>{album.title}</h1>
            <p className="text-sm text-lime-400 mt-2">
              <span className="font-bold text-emerald-400">{album.artist}</span> &middot; {album.year} &middot; {albumTracks.length} songs, {totalMin} min
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-6">
          <button
            onClick={() => {
              if (isCurrentAlbum) togglePlay();
              else playQueue(albumTracks, 0);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-lime-500 hover:from-green-300 hover:to-lime-400 flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all shadow-lg"
          >
            {isCurrentAlbum && isPlaying ? (
              <Pause size={26} fill="black" className="text-black" />
            ) : (
              <Play size={26} fill="black" className="text-black ml-1" />
            )}
          </button>
          <button className="text-green-400 hover:text-green-300 hover:rotate-12 transition-all">
            <Heart size={32} />
          </button>
          <button className="text-lime-400 hover:text-green-400 hover:rotate-12 transition-all">
            <MoreHorizontal size={28} />
          </button>
        </div>

        <div className="px-6 pb-8">
          <TrackList tracks={albumTracks} showAlbum={false} />
        </div>
      </div>
    );
  }

  // ---- PLAYLIST DETAIL ----
  if (view === "playlist" && selectedPlaylistId) {
    const playlist = playlists.find((p) => p.id === selectedPlaylistId);
    if (!playlist) return null;
    const playlistTracks = allTracks.slice(0, playlist.trackCount > allTracks.length ? allTracks.length : 10);

    return (
      <div>
        <div
          className="flex items-end gap-6 px-6 pt-6 pb-8"
          style={{
            background: `linear-gradient(to bottom, rgba(0,40,10,0.7), transparent), url(${playlist.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        >
          <div className="w-48 h-48 lg:w-56 lg:h-56 shrink-0 rounded-md overflow-hidden shadow-2xl border-4 border-green-500/30 hover:rotate-3 transition-transform">
            {selectedPlaylistId === "p1" ? (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-lime-300 flex items-center justify-center">
                <Heart size={48} fill="white" className="text-white" />
              </div>
            ) : (
              <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <span className="text-xs font-bold text-green-400 uppercase">Playlist</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-lime-400 drop-shadow-lg animate-drift-rotate" style={{ fontFamily: "monospace" }}>{playlist.name}</h1>
            <p className="text-sm text-green-400 mt-2">
              <span className="font-bold text-lime-400">{playlist.owner}</span> &middot; {playlist.trackCount} songs
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-6">
          <button
            onClick={() => playQueue(playlistTracks, 0)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-lime-500 hover:from-green-300 hover:to-lime-400 flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all shadow-lg"
          >
            <Play size={26} fill="black" className="text-black ml-1" />
          </button>
          <button className="text-green-400 hover:text-green-300 hover:rotate-12 transition-all">
            <Heart size={32} />
          </button>
          <button className="text-lime-400 hover:text-green-400 hover:rotate-12 transition-all">
            <MoreHorizontal size={28} />
          </button>
        </div>

        <div className="px-6 pb-8">
          <TrackList tracks={playlistTracks} showAlbum={true} showArt={true} />
        </div>
      </div>
    );
  }

  return null;
}

function Section({
  title,
  children,
  onSeeAll,
}: {
  title: string;
  children: React.ReactNode;
  onSeeAll: () => void;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-green-400 hover:text-lime-400 hover:underline cursor-pointer transition-colors" style={{ fontFamily: "monospace" }}>{title}</h2>
        <button
          onClick={onSeeAll}
          className="text-xs font-bold uppercase tracking-wider text-lime-500 hover:text-green-400 hover:underline transition-colors"
        >
          Show all (won't work)
        </button>
      </div>
      {children}
    </section>
  );
}
