import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Track } from "@/types";
import { tracks as allTracks } from "@/data/music";

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeat: "off" | "all" | "one";
  shuffle: boolean;
  likedTrackIds: Set<string>;
  trollMessage: string | null;
  showPopupAd: boolean;
  pendingTrack: Track | null;
  batteryLevel: number;
  networkStatus: "connected" | "weak" | "disconnected";
  showLoading: boolean;
}

interface PlayerContextValue extends PlayerState {
  playTrack: (track: Track, queue?: Track[]) => void;
  playQueue: (queue: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  trollTogglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  closePopupAd: () => void;
  dismissTrollMessage: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

const trollMessages = [
  "Are you sure you want to enjoy music right now?",
  "Playing music will drain your battery. Continue?",
  "Warning: This song may cause uncontrollable head bobbing.",
  "Are you REALLY sure? Like, really really sure?",
  "Music detected. Are you sure you're not just pretending to have taste?",
  "Error 404: Good taste not found. Play anyway?",
];

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [shuffle, setShuffle] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [trollMessage, setTrollMessage] = useState<string | null>(null);
  const [showPopupAd, setShowPopupAd] = useState(false);
  const [pendingTrack, setPendingTrack] = useState<Track | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [networkStatus, setNetworkStatus] = useState<"connected" | "weak" | "disconnected">("connected");
  const [showLoading, setShowLoading] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Battery drain simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 1) return 1;
        const drain = isPlaying ? 2 : 1;
        return Math.max(1, prev - drain);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Network status simulation - randomly drops
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.15) setNetworkStatus("disconnected");
      else if (rand < 0.4) setNetworkStatus("weak");
      else setNetworkStatus("connected");
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleEnded = useCallback(() => {
    setRepeat((prevRepeat) => {
      setQueueIndex((prevIdx) => {
        setQueue((prevQueue) => {
          if (prevRepeat === "one") {
            const t = prevQueue[prevIdx];
            if (t && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
            return prevQueue;
          }
          let nextIdx = prevIdx + 1;
          if (nextIdx >= prevQueue.length) {
            if (prevRepeat === "all") {
              nextIdx = 0;
            } else {
              setIsPlaying(false);
              return prevQueue;
            }
          }
          const nextTrack = prevQueue[nextIdx];
          if (nextTrack && audioRef.current) {
            audioRef.current.src = nextTrack.audioUrl;
            audioRef.current.play().catch(() => {});
            setCurrentTrack(nextTrack);
            setIsPlaying(true);
          }
          return prevQueue;
        });
        return prevIdx;
      });
      return prevRepeat;
    });
  }, []);

  const _actuallyPlayTrack = useCallback((track: Track, trackQueue?: Track[]) => {
    const q = trackQueue && trackQueue.length > 0 ? trackQueue : [track];
    const idx = q.findIndex((t) => t.id === track.id);
    setQueue(q);
    setQueueIndex(idx >= 0 ? idx : 0);
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
  }, []);

  const playTrack = useCallback(
    (track: Track, trackQueue?: Track[]) => {
      // FAKE POP-UP TRAP: show popup ad, store pending track
      setPendingTrack({ ...track, queue: trackQueue } as any);
      setShowPopupAd(true);
    },
    []
  );

  const playQueue = useCallback(
    (q: Track[], startIndex = 0) => {
      if (q.length === 0) return;
      const track = q[startIndex] || q[0];
      playTrack(track, q);
    },
    [playTrack]
  );

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      playQueue(allTracks, 0);
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [currentTrack, isPlaying, playQueue]);

  // TROLL PLAY BUTTON: randomly plays, pauses, mutes, or shows annoying alert
  const trollTogglePlay = useCallback(() => {
    const roll = Math.floor(Math.random() * 4);
    if (roll === 0) {
      // Actually play/pause normally
      togglePlay();
    } else if (roll === 1) {
      // Mute/unmute instead of playing
      setMuted((prev) => {
        const newMuted = !prev;
        if (audioRef.current) {
          audioRef.current.volume = newMuted ? 0 : volume;
        }
        setTrollMessage(newMuted ? "Just muted you. You're welcome." : "Unmuted. But why?");
        setTimeout(() => setTrollMessage(null), 3000);
        return newMuted;
      });
    } else if (roll === 2) {
      // Show annoying alert
      setTrollMessage(trollMessages[Math.floor(Math.random() * trollMessages.length)]);
      setTimeout(() => setTrollMessage(null), 4000);
    } else {
      // Fake loading then play
      setShowLoading(true);
      setTrollMessage("Buffering... please hold your breath...");
      setTimeout(() => {
        setShowLoading(false);
        setTrollMessage(null);
        togglePlay();
      }, 2500);
    }
  }, [togglePlay, volume]);

  const next = useCallback(() => {
    // Random chance to show loading instead
    if (Math.random() < 0.3) {
      setShowLoading(true);
      setTrollMessage("Connecting to next track...");
      setTimeout(() => {
        setShowLoading(false);
        setTrollMessage(null);
        setQueueIndex((prevIdx) => {
          if (prevIdx < 0 || queue.length === 0) return prevIdx;
          let nextIdx = prevIdx + 1;
          if (nextIdx >= queue.length) {
            if (repeat === "all") nextIdx = 0;
            else return prevIdx;
          }
          const nextTrack = queue[nextIdx];
          if (nextTrack && audioRef.current) {
            audioRef.current.src = nextTrack.audioUrl;
            audioRef.current.play().catch(() => {});
            setCurrentTrack(nextTrack);
            setIsPlaying(true);
          }
          return nextIdx;
        });
      }, 2000);
      return;
    }
    setQueueIndex((prevIdx) => {
      if (prevIdx < 0 || queue.length === 0) return prevIdx;
      let nextIdx = prevIdx + 1;
      if (nextIdx >= queue.length) {
        if (repeat === "all") nextIdx = 0;
        else return prevIdx;
      }
      const nextTrack = queue[nextIdx];
      if (nextTrack && audioRef.current) {
        audioRef.current.src = nextTrack.audioUrl;
        audioRef.current.play().catch(() => {});
        setCurrentTrack(nextTrack);
        setIsPlaying(true);
      }
      return nextIdx;
    });
  }, [queue, repeat]);

  const prev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    setQueueIndex((prevIdx) => {
      if (prevIdx < 0 || queue.length === 0) return prevIdx;
      let prevIdxNew = prevIdx - 1;
      if (prevIdxNew < 0) prevIdxNew = repeat === "all" ? queue.length - 1 : 0;
      const prevTrack = queue[prevIdxNew];
      if (prevTrack && audioRef.current) {
        audioRef.current.src = prevTrack.audioUrl;
        audioRef.current.play().catch(() => {});
        setCurrentTrack(prevTrack);
        setIsPlaying(true);
      }
      return prevIdxNew;
    });
  }, [queue, repeat]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  }, []);

  // TROLL VOLUME: increasing volume randomly increases it to max or mutes
  const setVolume = useCallback((v: number) => {
    // 30% chance to do the opposite of what you want
    if (Math.random() < 0.3) {
      const trollV = v > 0.5 ? 0.1 : 1;
      setVolumeState(trollV);
      setMuted(false);
      if (audioRef.current) audioRef.current.volume = trollV;
      setTrollMessage(trollV === 1 ? "MAX VOLUME! Enjoy!" : "Quieter than you wanted.");
      setTimeout(() => setTrollMessage(null), 2500);
      return;
    }
    setVolumeState(v);
    setMuted(v === 0);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.volume = newMuted ? 0 : volume;
      }
      return newMuted;
    });
  }, [volume]);

  const toggleRepeat = useCallback(() => {
    setRepeat((prev) => (prev === "off" ? "all" : prev === "all" ? "one" : "off"));
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => {
      if (!prev && queue.length > 1) {
        const shuffled = [...queue];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const curIdx = shuffled.findIndex((t) => t.id === currentTrack?.id);
        setQueue(shuffled);
        setQueueIndex(curIdx >= 0 ? curIdx : 0);
      }
      return !prev;
    });
  }, [queue, currentTrack]);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  }, []);

  const isLiked = useCallback((trackId: string) => likedTrackIds.has(trackId), [likedTrackIds]);

  const closePopupAd = useCallback(() => {
    setShowPopupAd(false);
    // Now actually play the pending track
    if (pendingTrack) {
      const track = pendingTrack;
      const trackQueue = (track as any).queue as Track[] | undefined;
      const cleanTrack: Track = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        albumId: track.albumId,
        cover: track.cover,
        duration: track.duration,
        audioUrl: track.audioUrl,
      };
      _actuallyPlayTrack(cleanTrack, trackQueue);
      setPendingTrack(null);
    }
  }, [pendingTrack, _actuallyPlayTrack]);

  const dismissTrollMessage = useCallback(() => setTrollMessage(null), []);

  const value: PlayerContextValue = {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    progress,
    duration,
    volume,
    muted,
    repeat,
    shuffle,
    likedTrackIds,
    trollMessage,
    showPopupAd,
    pendingTrack,
    batteryLevel,
    networkStatus,
    showLoading,
    playTrack,
    playQueue,
    togglePlay,
    trollTogglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    toggleLike,
    isLiked,
    closePopupAd,
    dismissTrollMessage,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
