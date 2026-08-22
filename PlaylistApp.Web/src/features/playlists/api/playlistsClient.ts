import { apiDelete, apiGet, apiPost, apiPut } from "../../../core/api/client";
import type { Playlist, PlaylistPayload } from "../types";

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    return await apiGet<Playlist[]>('/api/playlists');
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
    return await apiGet<Playlist>(`/api/playlists/${id}`);
};

export const createPlaylist = async (newPlaylist: PlaylistPayload): Promise<Playlist> => {
    return await apiPost<Playlist, PlaylistPayload>('/api/playlists', newPlaylist);
};

export const deletePlaylist = async (id: string): Promise<void> => {
    await apiDelete(`/api/playlists/${id}`);
};

export const updatePlaylist = async (id: string, playlist: PlaylistPayload): Promise<void> => {
    await apiPut<PlaylistPayload>(`/api/playlists/${id}`, playlist);
};