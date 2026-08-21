export const CoreApiMessages = {
    ValidationFailed: "Validation Failed",
    NetworkError: "Network error: Could not connect to the server. Please check your connection or try again later.",
    NotFound: "The requested resource could not be found. It may have already been deleted.",
    TooManyRequests: "Too many requests. Please wait a few minutes and try again.",
} as const;

export const CoreUILabels = {
    AppTitle: "István's Playlist Manager",
    NavSongs: "Songs",
    NavArtists: "Artists",
    NavPlaylists: "Playlists",
    TableActions: "Actions",
    LoadingStatus: "Loading...",
    EmptyValueFallback: "-",
} as const;

export const CoreUIButtons = {
    Save: "Save",
    SaveChanges: "Save Changes",
    Saving: "Saving...",
    Cancel: "Cancel",
    Edit: "Edit",
    Delete: "Delete",
    Deleting: "Deleting...",
} as const;

export const CoreUIPrompts = {
    ConfirmDelete: (title: string) => `Are you sure you want to permanently delete "${title}"?`,
} as const;