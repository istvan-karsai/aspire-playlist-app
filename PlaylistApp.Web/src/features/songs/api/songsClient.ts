import { apiFetch } from "../../../api/core";
import type { Song, SongPayload } from "../types";


export const fetchSongs = async (artistId?: string): Promise<Song[]> => {
    const url = artistId ? `/api/songs?artistId=${artistId}` : '/api/songs';
    const response = await apiFetch(url);

    return response.json();
};

export const createSong = async (newSong: SongPayload): Promise<Song> => {
    const response = await apiFetch('/api/songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
    });

    return response.json();
};

export const deleteSong = async (id: string): Promise<void> => {
    await apiFetch(`/api/songs/${id}`, {
        method: 'DELETE',
    });
};

export const updateSong = async (id: string, song: SongPayload): Promise<void> => {
    await apiFetch(`/api/songs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
    });
};
