export const ApiMessages = {
    ValidationFailed: "Validation Failed",
    NetworkError: "Network error: Could not connect to the server. Please check your connection or try again later.",
    NotFound: "The requested resource could not be found. It may have already been deleted.",
    DeleteError: (message: string) => `Error deleting song: ${message}`,
    SaveErrorPrefix: "Failed to save song because of the following error(s):",
    DeleteArtistError: (message: string) => `Error deleting artist: ${message}`,
    SaveArtistErrorPrefix: "Failed to save artist because of the following error(s):",
    TooManyRequests: "Too many requests. Please wait a few minutes and try again.",
    SavePlaylistErrorPrefix: "Failed to save playlist because of the following error(s):",
} as const;

export const ValidationMessages = {
    InvalidDurationFormat: "Duration must be in hh:mm:ss format and cannot exceed 23:59:59.",
    InvalidYear: "Please enter a valid four-digit year.",
    TitleRequired: "Title is required.",
    ArtistRequired: "At least one Artist must be selected.",
    DurationGreaterThanZero: "Duration must be greater than 0.",
    NameRequired: "Name is required.",
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
    TableDuration: "Duration",
    TableActions: "Actions",
    InputTitleLabel: "Title *",
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
    Artists: "Artists",
    LoadingStatus: "Loading...",
    NoArtistsAvailable: "No artists available.",
    FilterByArtist: "Filter by Artist",
    AllArtists: "All Artists",

    // Artist Details Page
    LoadingArtistDetails: "Loading artist details...",
    ErrorLoadingArtistProfile: "Failed to load artist profile.",
    ErrorLoadingDiscography: "Failed to load discography.",
    BackToArtists: "Back to Artists",
    ActiveSince: "Active since",
    Biography: "Biography",
    Discography: "Discography",
    EmptyDiscography: "No songs found for this artist.",

    // Shared Table Fallbacks
    EmptyArtistsFallback: "-",
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

export const UIPlaceholders = {
    Title: "e.g. Bohemian Rhapsody",
    Artist: "e.g Queen",
    Duration: "00:03:45",
    Name: "e.g. Freddie Mercury",
    Bio: "e.g. Lead vocalist of the rock band Queen...",
    ActiveFrom: "1970",
    Country: "e.g. United Kingdom",
    ImageUrl: "https://example.com/image.jpg",
    PlaylistName: "e.g. Summer Vibes, Workout Mix...",
    PlaylistDescription: "e.g. The ultimate playlist for running...",
} as const;

export const UIHints = {
    DurationFormat: "hh:mm:ss (max 23:59:59)",
} as const;

export const UIButtons = {
    Save: "Save",
    SaveChanges: "Save Changes",
    Saving: "Saving...",
    Cancel: "Cancel",
    Edit: "Edit",
    Delete: "Delete",
    Deleting: "Deleting...",
    AddNewSong: "Add New Song",
    AddNewArtist: "Add New Artist",
    AddNewPlaylist: "Add New Playlist",
} as const;

export const UIPrompts = {
    ConfirmDelete: (title: string) => `Are you sure you want to permanently delete "${title}"?`,
} as const;