namespace PlaylistApp.ApiService.Constants;

public static class ValidationMessages
{
    // Song messages
    public const string SongTitleRequired = "Title is required.";
    public const string SongTitleMaxLength = "Title cannot exceed {MaxLength} characters.";
    public const string DurationGreaterThanZero = "Duration must be greater than zero.";
    public const string ArtistIdsRequired = "The Artist identifiers collection cannot be null";

    // Artist messages
    public const string NameRequired = "Name is required.";
    public const string NameMaxLength = "Name cannot exceed {MaxLength} characters.";
    public const string BioMaxLength = "Bio cannot exceed {MaxLength} characters.";
    public const string CountryMaxLength = "Country cannot exceed {MaxLength} characters.";
    public const string ImageUrlMaxLength = "Image URL cannot exceed {MaxLength} characters.";
    public const string InvalidYear = "Active From Year must be between {From} and {To}.";
}