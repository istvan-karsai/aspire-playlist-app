export const ApiMessages = {
    ValidationFailed: "Validation Failed",
    NetworkError: "Network error: Could not connect to the server. Please check your connection or try again later.",
    NotFound: "The requested resource could not be found. It may have already been deleted.",
    DeleteError: (message: string) => `Error deleting song: ${message}`,
    SaveErrorPrefix: "Failed to save song because of the following error(s):",
    DeleteArtistError: (message: string) => `Error deleting artist: ${message}`,
    SaveArtistErrorPrefix: "Failed to save artist because of the following error(s):",
} as const;

export const ValidationMessages = {
    InvalidDurationFormat: "Duration must be in hh:mm:ss format.",
    InvalidYear: "Please enter a valid four-digit year.",
} as const;

export const UILabels = {
    AppTitle: "István's Playlist Manager",
    NavSongs: "Songs",
    NavArtists: "Artists",
    NavPlaylists: "Playlists",
    AddSongHeader: "Add a New Song",
    EditSongHeader: "Edit Song",
    LibraryHeader: "Current Library",
    EmptyLibrary: "Your library is currently empty. Add your first song to get started!",
    LoadingLibrary: "Loading the song library...",
    ErrorLoadingHeader: "Error loading songs",
    TableTitle: "Title",
    TableArtist: "Artist",
    TableDuration: "Duration",
    TableActions: "Actions",
    InputTitleLabel: "Title *",
    InputArtistLabel: "Artist *",
    InputDurationLabel: "Duration *",
    AddArtistHeader: "Add a New Artist",
    EditArtistHeader: "Edit Artist",
    ArtistLibraryHeader: "Artist Library",
    EmptyArtistLibrary: "Your artist library is currently empty. Add your first artist to get started!",
    LoadingArtistLibrary: "Loading the artist library...",
    ErrorLoadingArtistsHeader: "Error loading artists",
    TableName: "Name",
    TableBio: "Bio",
    TableActiveFrom: "Active From",
    TableCountry: "Country",
    InputNameLabel: "Name *",
    InputBioLabel: "Bio",
    InputActiveFromLabel: "Active From (Year)",
    InputCountryLabel: "Country",
    InputImageLabel: "Image URL",
} as const;

export const UIPlaceholders = {
    Title: "e.g. Bohemian Rhapsody",
    Artist: "e.g Queen",
    Duration: "00:03:45",
    Name: "e.g. Freddie Mercury",
    Bio: "e.g. Lead vocalist of the rock band Queen...",
    ActiveFrom: "1970",
    Country: "e.g. United Kingdom",
    ImageUrl: "https://example.com/image.jpg",
} as const;

export const UIHints = {
    DurationFormat: "hh:mm:ss",
} as const;

export const UIButtons = {
    Save: "Save",
    SaveChanges: "Save Changes",
    Saving: "Saving...",
    Cancel: "Cancel",
    Edit: "Edit",
    Delete: "Delete",
    Deleting: "Deleting...",
} as const;

export const UIPrompts = {
    ConfirmDelete: (title: string) => `Are you sure you want to permanently delete "${title}"?`,
} as const;