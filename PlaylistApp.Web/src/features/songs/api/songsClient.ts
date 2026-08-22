import { apiDelete, apiGet, apiPost, apiPut } from "../../../core/api/client";
import type { Song, SongPayload } from "../types";


export const fetchSongs = async (artistId?: string): Promise<Song[]> => {
    const url = artistId ? `/api/songs?artistId=${artistId}` : '/api/songs';
    return await apiGet<Song[]>(url);
};

export const createSong = async (newSong: SongPayload): Promise<Song> => {
    return await apiPost<Song, SongPayload>('/api/songs', newSong);
};

export const deleteSong = async (id: string): Promise<void> => {
    await apiDelete(`/api/songs/${id}`);
};

export const updateSong = async (id: string, song: SongPayload): Promise<void> => {
    await apiPut<SongPayload>(`/api/songs/${id}`, song);
};
