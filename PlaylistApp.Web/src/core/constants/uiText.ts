export const CoreApiMessages = {
    ValidationFailed: "Validation Failed",
    NetworkError: "Network error: Could not connect to the server. Please check your connection or try again later.",
    NotFound: "The requested resource could not be found. It may have already been deleted.",
    TooManyRequests: "Too many requests. Please wait a few minutes and try again.",
    ServiceUnavailable: "The service is currently unavailable. Please try again later.",
    UnexpectedFormat: "Received an unexpected response format from the server.",
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

export const CoreUILayout = {
    FooterBuiltBy: "Built by",
    FooterAuthor: "István Karsai",
    FooterGithub: "GitHub",
    FooterEmail: "contact@istvankarsai.com",
    OpenMainMenu: "Open main menu",
} as const;

export const CoreUIErrors = {
    // Global Error Boundary
    BoundaryTitle: "Something went wrong.",
    BoundaryMessage: "An unexpected error occurred in the application. Please try refreshing the page or returning home.",
    BoundaryRefreshPage: "Refresh Page",
    BoundaryBackToHome: "Back to Home Page",
    // 404 Page
    NotFoundTitle: "404",
    NotFoundSubtitle: "Page Not Found",
    NotFoundMessage: "The page you are looking for doesn't exist or has been moved.",
    NotFoundBackLink: "Back to Songs",
} as const;