export const SongApiMessages = {
    DeleteError: (message: string) => `Error deleting song: ${message}`,
    SaveErrorPrefix: "Failed to save song because of the following error(s):",
} as const;

export const SongValidationMessages = {
    InvalidDurationFormat: "Duration must be in hh:mm:ss format and cannot exceed 23:59:59.",
    TitleRequired: "Title is required.",
    ArtistRequired: "At least one Artist must be selected.",
    DurationGreaterThanZero: "Duration must be greater than 0.",
} as const;

export const SongUILabels = {
    AddSongHeader: "Add a New Song",
    EditSongHeader: "Edit Song",
    LibraryHeader: "Current Library",
    EmptyLibrary: "Your library is currently empty. Add your first song to get started!",
    LoadingLibrary: "Loading the song library...",
    ErrorLoadingHeader: "Error loading songs",
    TableTitle: "Title",
    TableDuration: "Duration",
    InputTitleLabel: "Title *",
    InputDurationLabel: "Duration *",
    Artists: "Artists",
    NoArtistsAvailable: "No artists available.",
    FilterByArtist: "Filter by Artist",
    AllArtists: "All Artists",
} as const;

export const SongUIPlaceholders = {
    Title: "e.g. Bohemian Rhapsody",
    Artist: "e.g Queen",
    Duration: "00:03:45",
} as const;

export const SongUIHints = {
    DurationFormat: "hh:mm:ss (max 23:59:59)",
} as const;

export const SongUIButtons = {
    AddNewSong: "Add New Song",
} as const;