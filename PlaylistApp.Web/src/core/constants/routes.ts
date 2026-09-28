export const ROUTES = {
    HOME: "/",
    SONGS: "/songs",
    SONG_DETAILS: (id: string) => `/songs/${id}`,
    ARTISTS: "/artists",
    ARTIST_DETAILS: (id: string) => `/artists/${id}`,
    PLAYLISTS: "/playlists",
    PLAYLIST_DETAILS: (id: string) => `/playlists/${id}`,
} as const;