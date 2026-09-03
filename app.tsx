import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MainContent from "@/components/MainContent";
import PlayerBar from "@/components/PlayerBar";
import FakePopupAd from "@/components/FakePopupAd";
import LoginScreen from "@/components/LoginScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { PlayerProvider } from "@/context/PlayerContext";

type View = "home" | "search" | "library" | "album" | "playlist";

interface HistoryEntry {
  view: View;
  albumId: string | null;
  playlistId: string | null;
}

type AppPhase = "login" | "loading" | "main";

function App() {
  const [phase, setPhase] = useState<AppPhase>("login");
  const [view, setView] = useState<View>("home");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([{ view: "home", albumId: null, playlistId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [rotateUI, setRotateUI] = useState(false);
  const [rotateAngle, setRotateAngle] = useState(0);

  // Randomly rotate the entire UI for maximum chaos - now more frequent and varied
  useEffect(() => {
    if (phase !== "main") return;
    const interval = setInterval(() => {
      if (Math.random() < 0.2) {
        setRotateAngle(Math.random() * 8 - 4);
        setRotateUI(true);
        setTimeout(() => setRotateUI(false), 2500);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [phase]);

  const navigate = useCallback(
    (newView: View, albumId: string | null = null, playlistId: string | null = null) => {
      const entry: HistoryEntry = { view: newView, albumId, playlistId };
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), entry]);
      setHistoryIndex((prev) => prev + 1);
      setView(newView);
      setSelectedAlbumId(albumId);
      setSelectedPlaylistId(playlistId);
    },
    [historyIndex]
  );

  const handleNavigate = useCallback(
    (v: View) => {
      navigate(v, null, null);
      if (v !== "search") setSearchQuery("");
    },
    [navigate]
  );

  const handleOpenAlbum = useCallback(
    (id: string) => {
      navigate("album", id, null);
    },
    [navigate]
  );

  const handleOpenPlaylist = useCallback(
    (id: string) => {
      navigate("playlist", null, id);
    },
    [navigate]
  );

  const handleBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const entry = history[newIdx];
      setHistoryIndex(newIdx);
      setView(entry.view);
      setSelectedAlbumId(entry.albumId);
      setSelectedPlaylistId(entry.playlistId);
    }
  }, [historyIndex, history]);

  const handleForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      const entry = history[newIdx];
      setHistoryIndex(newIdx);
      setView(entry.view);
      setSelectedAlbumId(entry.albumId);
      setSelectedPlaylistId(entry.playlistId);
    }
  }, [historyIndex, history]);

  // LOGIN PHASE
  if (phase === "login") {
    return <LoginScreen onLogin={() => setPhase("loading")} />;
  }

  // LOADING PHASE
  if (phase === "loading") {
    return <LoadingScreen onDone={() => setPhase("main")} />;
  }

  // MAIN PHASE
  const bgGradient =
    view === "album" && selectedAlbumId
      ? "from-green-900/40 via-emerald-950 to-lime-950"
      : view === "playlist"
      ? "from-green-800/30 via-emerald-950 to-teal-950"
      : "from-green-900/30 via-emerald-950 to-lime-950";

  return (
    <PlayerProvider>
      <div
        className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden"
        style={{
          transform: rotateUI ? `rotate(${rotateAngle}deg)` : "rotate(0deg)",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {/* Main area: sidebar + content */}
        <div className="flex-1 flex gap-2 p-2 pb-0 min-h-0">
          {/* Sidebar */}
          <aside className="w-[280px] shrink-0 hidden md:flex flex-col">
            <Sidebar view={view} onNavigate={handleNavigate} onOpenPlaylist={handleOpenPlaylist} />
          </aside>

          {/* Content area */}
          <main className={`flex-1 min-w-0 rounded-lg overflow-hidden flex flex-col bg-gradient-to-b ${bgGradient} border border-green-500/20`}>
            <TopBar
              onBack={handleBack}
              onForward={handleForward}
              canBack={historyIndex > 0}
              canForward={historyIndex < history.length - 1}
              view={view}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={() => {}}
            />
            <div className="flex-1 overflow-y-auto main-scroll">
              <MainContent
                view={view}
                selectedAlbumId={selectedAlbumId}
                selectedPlaylistId={selectedPlaylistId}
                searchQuery={searchQuery}
                onOpenAlbum={handleOpenAlbum}
              />
            </div>
          </main>
        </div>

        {/* Player bar */}
        <PlayerBar />

        {/* Fake popup ad - now in bottom right corner */}
        <FakePopupAd />
      </div>
    </PlayerProvider>
  );
}

export default App;
export type { View };
