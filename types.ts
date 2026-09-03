export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  cover: string;
  duration: number; // seconds
  audioUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  year: number;
  trackIds: string[];
}

export interface PlaylistItem {
  id: string;
  name: string;
  owner: string;
  cover: string;
  trackCount: number;
}
