import { Home, Search, Library, Plus, Heart, Music2, RotateCw } from "lucide-react";
import { playlists } from "@/data/music";
import type { View } from "@/App";

interface SidebarProps {
  view: View;
  onNavigate: (view: View) => void;
  onOpenPlaylist: (id: string) => void;
}

export default function Sidebar({ view, onNavigate, onOpenPlaylist }: SidebarProps) {
  return (
    <div className="flex flex-col gap-2 h-full p-2 pb-0">
      {/* Top nav block */}
      <div className="bg-gradient-to-br from-green-950 to-emerald-950 rounded-lg p-2 border border-green-500/40">
        <button
          onClick={() => onNavigate("home")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-bold transition-all ${
            view === "home" ? "text-green-400 bg-black/40 animate-wiggle" : "text-lime-500 hover:text-green-400 hover:bg-black/20"
          }`}
        >
          <Home size={24} fill="currentColor" className={view === "home" ? "animate-spin-slow" : "hover:rotate-12 transition-transform"} />
          Home
        </button>
        <button
          onClick={() => onNavigate("search")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-bold transition-all ${
            view === "search" ? "text-green-400 bg-black/40 animate-wiggle" : "text-teal-400 hover:text-green-400 hover:bg-black/20"
          }`}
        >
          <Search size={24} className={view === "search" ? "animate-drift-rotate" : "hover:-rotate-12 transition-transform"} />
          Search
        </button>
      </div>

      {/* Library block */}
      <div className="bg-gradient-to-b from-green-950 to-lime-950 rounded-lg flex-1 flex flex-col min-h-0 overflow-hidden border border-green-500/30">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={() => onNavigate("library")}
            className={`flex items-center gap-3 text-sm font-bold transition-colors ${
              view === "library" ? "text-green-400" : "text-lime-500 hover:text-green-300"
            }`}
          >
            <Library size={24} className={view === "library" ? "animate-bounce" : "hover:rotate-6 transition-transform"} />
            Your Library
          </button>
          <button
            className="text-green-400 hover:text-green-300 p-1 rounded-full hover:bg-black/30 transition-colors"
            title="Create playlist (just kidding)"
          >
            <Plus size={20} className="hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 px-3 pb-2 flex-wrap">
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:rotate-12 transition-transform cursor-pointer">
            Playlists
          </span>
          <span className="bg-gradient-to-r from-lime-600 to-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:-rotate-12 transition-transform cursor-pointer">
            Albums
          </span>
          <span className="bg-gradient-to-r from-teal-600 to-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:rotate-6 transition-transform cursor-pointer">
            Artists
          </span>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:scale-110 transition-transform cursor-pointer">
            ????
          </span>
        </div>

        {/* Playlist list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 sidebar-scroll">
          {playlists.map((pl, i) => (
            <button
              key={pl.id}
              onClick={() => onOpenPlaylist(pl.id)}
              className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-green-900/30 transition-colors text-left group hover:translate-x-2"
            >
              <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 overflow-hidden ${i === 0 ? "bg-gradient-to-br from-green-400 to-lime-300" : ""}`}>
                {i === 0 ? (
                  <Heart size={20} fill="white" className="text-white group-hover:animate-spin" />
                ) : (
                  <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-300 truncate group-hover:text-lime-400 transition-colors">{pl.name}</p>
                <p className="text-xs text-emerald-400 truncate">
                  Playlist &middot; {pl.owner}
                </p>
              </div>
            </button>
          ))}

          {/* Random decorative item */}
          <div className="pt-4 pb-2 px-2">
            <p className="text-xs uppercase tracking-wider text-green-500 font-bold mb-2 flex items-center gap-1">
              <RotateCw size={12} className="animate-spin" />
              Mystery Zone
            </p>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-green-900/30 transition-colors cursor-pointer hover:rotate-3">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center shrink-0 animate-pulse">
              <Music2 size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-400 truncate">Discover Mix</p>
              <p className="text-xs text-lime-500 truncate">Auto-mix &middot; 50 songs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
