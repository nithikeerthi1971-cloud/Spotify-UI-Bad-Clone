import type { Track, Album, PlaylistItem } from "@/types";

// Royalty-free audio samples (SoundHelix) - these play DIFFERENT songs than what's shown
const audio = (id: number) =>
  `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${id}.mp3`;

// Interstellar / space-style album covers
const covers = [
  "https://images.pexels.com/photos/28235563/pexels-photo-28235563.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/14667506/pexels-photo-14667506.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/13237926/pexels-photo-13237926.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/14768761/pexels-photo-14768761.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/31046021/pexels-photo-31046021.png?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/32054508/pexels-photo-32054508.png?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/35528399/pexels-photo-35528399.png?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/36277136/pexels-photo-36277136.png?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/35098929/pexels-photo-35098929.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/15196120/pexels-photo-15196120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/33931029/pexels-photo-33931029.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/37558868/pexels-photo-37558868.png?auto=compress&cs=tinysrgb&h=650&w=940",
];

// Tamil song titles with Tamil artist names - but audio is completely different random tracks
export const tracks: Track[] = [
  // Album: Interstellar Dreams
  { id: "t1", title: "Nila Kaalam", artist: "A.R. Rahman", album: "Interstellar Dreams", albumId: "a1", cover: covers[0], duration: 213, audioUrl: audio(7) },
  { id: "t2", title: "Kadhal Sadugudu", artist: "A.R. Rahman", album: "Interstellar Dreams", albumId: "a1", cover: covers[0], duration: 198, audioUrl: audio(12) },
  { id: "t3", title: "Vaseegara", artist: "A.R. Rahman", album: "Interstellar Dreams", albumId: "a1", cover: covers[0], duration: 245, audioUrl: audio(3) },

  // Album: Cosmic Rhythms
  { id: "t4", title: "Munbe Vaa", artist: "Ilaiyaraaja", album: "Cosmic Rhythms", albumId: "a2", cover: covers[1], duration: 187, audioUrl: audio(9) },
  { id: "t5", title: "Anbe Sivam", artist: "Ilaiyaraaja", album: "Cosmic Rhythms", albumId: "a2", cover: covers[1], duration: 224, audioUrl: audio(14) },
  { id: "t6", title: "Thendrale", artist: "Ilaiyaraaja", album: "Cosmic Rhythms", albumId: "a2", cover: covers[1], duration: 201, audioUrl: audio(5) },

  // Album: Galaxy Beats
  { id: "t7", title: "Ooh La La", artist: "Anirudh Ravichander", album: "Galaxy Beats", albumId: "a3", cover: covers[2], duration: 234, audioUrl: audio(1) },
  { id: "t8", title: "Why This Kolaveri", artist: "Anirudh Ravichander", album: "Galaxy Beats", albumId: "a3", cover: covers[2], duration: 176, audioUrl: audio(11) },
  { id: "t9", title: "Vaathi Coming", artist: "Anirudh Ravichander", album: "Galaxy Beats", albumId: "a3", cover: covers[2], duration: 209, audioUrl: audio(8) },

  // Album: Nebula Nights
  { id: "t10", title: "Rowdy Baby", artist: "Yuvan Shankar Raja", album: "Nebula Nights", albumId: "a4", cover: covers[3], duration: 192, audioUrl: audio(15) },
  { id: "t11", title: "Penne Penne", artist: "Yuvan Shankar Raja", album: "Nebula Nights", albumId: "a4", cover: covers[3], duration: 218, audioUrl: audio(4) },
  { id: "t12", title: "Kannamma", artist: "Yuvan Shankar Raja", album: "Nebula Nights", albumId: "a4", cover: covers[3], duration: 167, audioUrl: audio(13) },

  // Album: Stardust Melodies
  { id: "t13", title: "Oru Deivam Thantha", artist: "Harris Jayaraj", album: "Stardust Melodies", albumId: "a5", cover: covers[4], duration: 256, audioUrl: audio(2) },
  { id: "t14", title: "Vennilave", artist: "Harris Jayaraj", album: "Stardust Melodies", albumId: "a5", cover: covers[4], duration: 184, audioUrl: audio(10) },
  { id: "t15", title: "Sahana", artist: "Harris Jayaraj", album: "Stardust Melodies", albumId: "a5", cover: covers[4], duration: 201, audioUrl: audio(6) },

  // Album: Black Hole Bass
  { id: "t16", title: "Megam Kottu", artist: "Devi Sri Prasad", album: "Black Hole Bass", albumId: "a6", cover: covers[5], duration: 278, audioUrl: audio(14) },
  { id: "t17", title: "Jai Shri Ram", artist: "Devi Sri Prasad", album: "Black Hole Bass", albumId: "a6", cover: covers[5], duration: 195, audioUrl: audio(3) },
  { id: "t18", title: "Laila Laila", artist: "Devi Sri Prasad", album: "Black Hole Bass", albumId: "a6", cover: covers[5], duration: 222, audioUrl: audio(7) },

  // Album: Wormhole Wonders
  { id: "t19", title: "Tamil Pasanga", artist: "G.V. Prakash Kumar", album: "Wormhole Wonders", albumId: "a7", cover: covers[6], duration: 189, audioUrl: audio(11) },
  { id: "t20", title: "Yen Uyire", artist: "G.V. Prakash Kumar", album: "Wormhole Wonders", albumId: "a7", cover: covers[6], duration: 213, audioUrl: audio(5) },
  { id: "t21", title: "Kadhalikathey", artist: "G.V. Prakash Kumar", album: "Wormhole Wonders", albumId: "a7", cover: covers[6], duration: 241, audioUrl: audio(9) },

  // Album: Supernova Sound
  { id: "t22", title: "Marana Mass", artist: "Santhosh Narayanan", album: "Supernova Sound", albumId: "a8", cover: covers[7], duration: 207, audioUrl: audio(1) },
  { id: "t23", title: "Kathi Theme", artist: "Santhosh Narayanan", album: "Supernova Sound", albumId: "a8", cover: covers[7], duration: 178, audioUrl: audio(12) },
  { id: "t24", title: "Enge Pogutho", artist: "Santhosh Narayanan", album: "Supernova Sound", albumId: "a8", cover: covers[7], duration: 233, audioUrl: audio(8) },

  // Album: Event Horizon
  { id: "t25", title: "Pogathe Pogathe", artist: "Vidyasagar", album: "Event Horizon", albumId: "a9", cover: covers[8], duration: 265, audioUrl: audio(15) },
  { id: "t26", title: "Kooduvittu", artist: "Vidyasagar", album: "Event Horizon", albumId: "a9", cover: covers[8], duration: 198, audioUrl: audio(4) },
  { id: "t27", title: "Anjali Anjali", artist: "Vidyasagar", album: "Event Horizon", albumId: "a9", cover: covers[8], duration: 212, audioUrl: audio(10) },

  // Album: Quantum Quasar
  { id: "t28", title: "Sollamale", artist: "Bharathwaj", album: "Quantum Quasar", albumId: "a10", cover: covers[9], duration: 234, audioUrl: audio(6) },
  { id: "t29", title: "En Kadhal Solla", artist: "Bharathwaj", album: "Quantum Quasar", albumId: "a10", cover: covers[9], duration: 187, audioUrl: audio(13) },
  { id: "t30", title: "Pirai Thedum", artist: "Bharathwaj", album: "Quantum Quasar", albumId: "a10", cover: covers[9], duration: 201, audioUrl: audio(2) },
];

export const albums: Album[] = [
  { id: "a1", title: "Interstellar Dreams", artist: "A.R. Rahman", cover: covers[0], year: 2024, trackIds: ["t1", "t2", "t3"] },
  { id: "a2", title: "Cosmic Rhythms", artist: "Ilaiyaraaja", cover: covers[1], year: 2023, trackIds: ["t4", "t5", "t6"] },
  { id: "a3", title: "Galaxy Beats", artist: "Anirudh Ravichander", cover: covers[2], year: 2024, trackIds: ["t7", "t8", "t9"] },
  { id: "a4", title: "Nebula Nights", artist: "Yuvan Shankar Raja", cover: covers[3], year: 2022, trackIds: ["t10", "t11", "t12"] },
  { id: "a5", title: "Stardust Melodies", artist: "Harris Jayaraj", cover: covers[4], year: 2024, trackIds: ["t13", "t14", "t15"] },
  { id: "a6", title: "Black Hole Bass", artist: "Devi Sri Prasad", cover: covers[5], year: 2023, trackIds: ["t16", "t17", "t18"] },
  { id: "a7", title: "Wormhole Wonders", artist: "G.V. Prakash Kumar", cover: covers[6], year: 2024, trackIds: ["t19", "t20", "t21"] },
  { id: "a8", title: "Supernova Sound", artist: "Santhosh Narayanan", cover: covers[7], year: 2022, trackIds: ["t22", "t23", "t24"] },
  { id: "a9", title: "Event Horizon", artist: "Vidyasagar", cover: covers[8], year: 2021, trackIds: ["t25", "t26", "t27"] },
  { id: "a10", title: "Quantum Quasar", artist: "Bharathwaj", cover: covers[9], year: 2023, trackIds: ["t28", "t29", "t30"] },
];

export const playlists: PlaylistItem[] = [
  { id: "p1", name: "Liked Songs", owner: "You", cover: covers[10], trackCount: 30 },
  { id: "p2", name: "Tamil Hits 2024", owner: "You", cover: covers[11], trackCount: 24 },
  { id: "p3", name: "Workout Energy", owner: "You", cover: covers[0], trackCount: 18 },
  { id: "p4", name: "Focus Flow", owner: "You", cover: covers[3], trackCount: 32 },
  { id: "p5", name: "Late Night Drive", owner: "You", cover: covers[5], trackCount: 15 },
  { id: "p6", name: "Throwback Tamil", owner: "You", cover: covers[8], trackCount: 42 },
];

export const trackMap: Record<string, Track> = Object.fromEntries(
  tracks.map((t) => [t.id, t])
);

export const albumMap: Record<string, Album> = Object.fromEntries(
  albums.map((a) => [a.id, a])
);

export function getAlbumTracks(albumId: string): Track[] {
  const album = albumMap[albumId];
  if (!album) return [];
  return album.trackIds.map((id) => trackMap[id]).filter(Boolean);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
