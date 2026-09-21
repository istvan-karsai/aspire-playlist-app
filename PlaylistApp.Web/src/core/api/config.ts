const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

export const API_ENDPOINTS = {
    songs: `${API_BASE_URL}/songs`,
    artists: `${API_BASE_URL}/artists`,
    playlists: `${API_BASE_URL}/playlists`,
} as const;