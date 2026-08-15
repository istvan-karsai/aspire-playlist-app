import type { Artist } from "../../artists/types";

export interface Song {
    id: string;
    title: string;
    artists: Artist[];
    duration: string;
}

export interface SongPayload {
    title: string;
    artistIds: string[];
    duration: string;
}