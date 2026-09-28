const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

export const API_ENDPOINTS = {
    songs: `${API_BASE_URL}/songs`,
    artists: `${API_BASE_URL}/artists`,
    playlists: `${API_BASE_URL}/playlists`,
} as const;

// React Query Key Factories
export const songKeys = {
    all: ['songs'] as const,
    list: (artistId?: string) => ['songs', { artistId }] as const,
    detail: (id: string) => ['songs', id] as const,
};

export const artistKeys = {
    all: ['artists'] as const,
    detail: (id: string) => ['artists', id] as const,
};

export const playlistKeys = {
    all: ['playlists'] as const,
    detail: (id: string) => ['playlists', id] as const,
};