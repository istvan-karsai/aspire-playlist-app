import { apiFetch } from "../../../api/core";
import type { Playlist, PlaylistPayload } from "../types";

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    const response = await apiFetch('/api/playlists');

    return response.json();
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
    const response = await apiFetch(`/api/playlists/${id}`);

    return response.json();
};

export const createPlaylist = async (newPlaylist: PlaylistPayload): Promise<Playlist> => {
    const response = await apiFetch("/api/playlists", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlaylist),
    });

    return response.json();
};

export const deletePlaylist = async (id: string): Promise<void> => {
    await apiFetch(`/api/playlists/${id}`, {
        method: 'DELETE',
    });
};

export const updatePlaylist = async (id: string, playlist: PlaylistPayload): Promise<void> => {
    await apiFetch(`/api/playlists/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
    });
};