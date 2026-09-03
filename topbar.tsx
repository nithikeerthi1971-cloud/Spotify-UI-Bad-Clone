import { ChevronLeft, ChevronRight, Bell, Search as SearchIcon, X, BatteryLow, Wifi, WifiOff } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface TopBarProps {
  onBack: () => void;
  onForward: () => void;
  canBack: boolean;
  canForward: boolean;
  view: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
}

export default function TopBar({
  onBack,
  onForward,
  canBack,
  canForward,
  view,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: TopBarProps) {
  const { batteryLevel, networkStatus } = usePlayer();

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 sticky top-0 z-20 bg-gradient-to-r from-green-950/80 to-emerald-950/80 backdrop-blur-md rounded-t-lg">
      {/* Nav arrows + search */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          disabled={!canBack}
          className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-green-400 disabled:opacity-40 hover:enabled:bg-green-900 hover:enabled:-rotate-12 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onForward}
          disabled={!canForward}
          className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-lime-400 disabled:opacity-40 hover:enabled:bg-lime-900 hover:enabled:rotate-12 transition-all"
        >
          <ChevronRight size={20} />
        </button>

        {/* Search bar */}
        {view === "search" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="ml-4 relative"
          >
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 animate-spin-slow" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for songs you won't find..."
              className="w-72 lg:w-96 bg-neutral-900 text-green-300 text-sm rounded-full pl-10 pr-10 py-2.5 outline-none ring-1 ring-green-500/30 focus:ring-green-500 transition-all placeholder:text-neutral-600 border border-lime-500/20"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-red-400"
              >
                <X size={16} />
              </button>
            )}
          </form>
        )}

        {/* Battery + network indicators */}
        <div className="flex items-center gap-3 ml-2">
          <div className={`flex items-center gap-1 text-xs font-bold ${batteryLevel < 20 ? "text-red-500 animate-pulse" : batteryLevel < 50 ? "text-yellow-500" : "text-green-400"}`}>
            <BatteryLow size={14} />
            {batteryLevel}%
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${networkStatus === "disconnected" ? "text-red-500 animate-pulse" : networkStatus === "weak" ? "text-yellow-500" : "text-green-400"}`}>
            {networkStatus === "disconnected" ? <WifiOff size={14} /> : <Wifi size={14} />}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-green-400 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 px-4 py-2 rounded-full transition-colors animate-pulse">
          Buy Premium (we need money)
        </button>
        <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-lime-400 hover:text-green-400 hover:rotate-12 transition-all">
          <Bell size={18} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-lime-400 flex items-center justify-center text-white text-sm font-bold hover:rotate-180 transition-transform duration-500">
          U
        </button>
      </div>
    </div>
  );
}
