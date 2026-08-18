import type { Song } from "../../songs/types";

export interface Playlist {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    songs: Song[];
}

export interface PlaylistPayload {
    name: string;
    description: string | null;
    songIds: string[];
}

export interface PlaylistFormData {
    name: string;
    description: string;
    songIds: string[];
}