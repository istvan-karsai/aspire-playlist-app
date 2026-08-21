namespace PlaylistApp.ApiService.Features.Songs.Constants;

public static class SongValidationMessages
{
    public const string SongTitleRequired = "Title is required.";
    public const string SongTitleMaxLength = "Title cannot exceed {MaxLength} characters.";
    public const string DurationGreaterThanZero = "Duration must be greater than zero.";
    public const string ArtistIdsRequired = "The Artist identifiers collection cannot be null";
    public const string InvalidDurationFormat = "Duration must be in the format HH:mm:ss and cannot exceed 23:59:59.";
}