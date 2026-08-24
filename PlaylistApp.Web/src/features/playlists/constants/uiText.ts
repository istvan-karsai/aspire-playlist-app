export const PlaylistApiMessages = {
    SavePlaylistErrorPrefix: "Failed to save playlist because of the following error(s):",
    DeletePlaylistError: (message: string) => `Error deleting playlist: ${message}`,
} as const;

export const PlaylistValidationMessages = {
    NameRequired: "Name is required.",
} as const;

export const PlaylistUILabels = {
    TableName: "Name",
    TableDescription: "Description",
    InputNameLabel: "Name *",
    InputDescriptionLabel: "Description",
    Songs: "Songs",
    NoSongsAvailable: "No songs available.",
    AddPlaylistHeader: "Add a New Playlist",
    EditPlaylistHeader: "Edit Playlist",
    PlaylistLibraryHeader: "Playlists",
    EmptyPlaylistLibrary: "Your playlist library is currently empty. Create one to get started!",
    LoadingPlaylistLibrary: "Loading the playlist library...",
    ErrorLoadingPlaylistsHeader: "Error loading playlists",
} as const;

export const PlaylistUIPlaceholders = {
    PlaylistName: "e.g. Summer Vibes, Workout Mix...",
    PlaylistDescription: "e.g. The ultimate playlist for running...",
} as const;

export const PlaylistUIButtons = {
    AddNewPlaylist: "Add New Playlist",
} as const;