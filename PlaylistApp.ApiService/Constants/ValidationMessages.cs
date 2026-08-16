namespace PlaylistApp.ApiService.Constants;

public static class ValidationMessages
{
    // Song messages
    public const string SongTitleRequired = "Title is required.";
    public const string SongTitleMaxLength = "Title cannot exceed {MaxLength} characters.";
    public const string DurationGreaterThanZero = "Duration must be greater than zero.";
    public const string ArtistIdsRequired = "The Artist identifiers collection cannot be null";
    public const string InvalidDurationFormat = "Duration must be in the format HH:mm:ss and cannot exceed 23:59:59.";

    // Artist messages
    public const string NameRequired = "Name is required.";
    public const string NameMaxLength = "Name cannot exceed {MaxLength} characters.";
    public const string BioMaxLength = "Bio cannot exceed {MaxLength} characters.";
    public const string CountryMaxLength = "Country cannot exceed {MaxLength} characters.";
    public const string ImageUrlMaxLength = "Image URL cannot exceed {MaxLength} characters.";
    public const string InvalidYear = "Active From Year must be between {From} and {To}.";

    // Playlist messages
    public const string PlaylistNameRequired = "Playlist name is required.";
    public const string PlaylistNameMaxLength = "Playlist name cannot exceed {MaxLength} characters.";
    public const string PlaylistDescriptionMaxLength = "Playlist description cannot exceed {MaxLength} characters.";
    public const string SongIdsRequired = "The Song identifiers collection cannot be null.";
}