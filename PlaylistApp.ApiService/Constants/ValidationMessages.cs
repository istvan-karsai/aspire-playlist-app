namespace PlaylistApp.ApiService.Constants;

public static class ValidationMessages
{
    public const string TitleRequired = "Title is required.";
    public const string TitleMaxLength = "Title cannot exceed {MaxLength} characters.";
    public const string ArtistRequired = "Artist is required.";
    public const string ArtistMaxLength = "Artist cannot exceed {MaxLength} characters.";
    public const string DurationGreaterThanZero = "Duration must be greater than zero.";
}