export const ArtistApiMessages = {
    DeleteArtistError: (message: string) => `Error deleting artist: ${message}`,
    SaveArtistErrorPrefix: "Failed to save artist because of the following error(s):",
} as const;

export const ArtistValidationMessages = {
    InvalidYear: "Please enter a valid four-digit year.",
    NameRequired: "Name is required.",
} as const;

export const ArtistUILabels = {
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
    // Artist Details Page
    LoadingArtistDetails: "Loading artist details...",
    ErrorLoadingArtistProfile: "Failed to load artist profile.",
    ErrorLoadingDiscography: "Failed to load discography.",
    BackToArtists: "Back to Artists",
    ActiveSince: "Active since",
    Biography: "Biography",
    Discography: "Discography",
    EmptyDiscography: "No songs found for this artist.",
} as const;

export const ArtistUIPlaceholders = {
    Name: "e.g. Freddie Mercury",
    Bio: "e.g. Lead vocalist of the rock band Queen...",
    ActiveFrom: "1970",
    Country: "e.g. United Kingdom",
    ImageUrl: "https://example.com/image.jpg",
} as const;

export const ArtistUIButtons = {
    AddNewArtist: "Add New Artist",
} as const;