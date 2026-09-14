import { apiDelete, apiGet, apiPost, apiPut } from "../../../core/api/client";
import { API_ENDPOINTS } from "../../../core/api/config";
import type { Song, SongPayload } from "../types";


export const fetchSongs = async (artistId?: string): Promise<Song[]> => {
    const url = artistId ? `${API_ENDPOINTS.songs}?artistId=${artistId}` : API_ENDPOINTS.songs;
    return await apiGet<Song[]>(url);
};

export const createSong = async (newSong: SongPayload): Promise<Song> => {
    return await apiPost<Song, SongPayload>(`${API_ENDPOINTS.songs}`, newSong);
};

export const deleteSong = async (id: string): Promise<void> => {
    await apiDelete(`${API_ENDPOINTS.songs}/${id}`);
};

export const updateSong = async (id: string, song: SongPayload): Promise<void> => {
    await apiPut<SongPayload>(`${API_ENDPOINTS.songs}/${id}`, song);
};
