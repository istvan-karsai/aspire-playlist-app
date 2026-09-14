import { apiDelete, apiGet, apiPost, apiPut } from "../../../core/api/client";
import { API_ENDPOINTS } from "../../../core/api/config";
import type { Playlist, PlaylistPayload } from "../types";

export const fetchPlaylists = async (): Promise<Playlist[]> => {
    return await apiGet<Playlist[]>(`${API_ENDPOINTS.playlists}`);
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
    return await apiGet<Playlist>(`${API_ENDPOINTS.playlists}/${id}`);
};

export const createPlaylist = async (newPlaylist: PlaylistPayload): Promise<Playlist> => {
    return await apiPost<Playlist, PlaylistPayload>(`${API_ENDPOINTS.playlists}`, newPlaylist);
};

export const deletePlaylist = async (id: string): Promise<void> => {
    await apiDelete(`${API_ENDPOINTS.playlists}/${id}`);
};

export const updatePlaylist = async (id: string, playlist: PlaylistPayload): Promise<void> => {
    await apiPut<PlaylistPayload>(`${API_ENDPOINTS.playlists}/${id}`, playlist);
};