namespace PlaylistApp.ApiService.Features.Playlists.Constants;

public static class PlaylistValidationMessages
{
    public const string PlaylistNameRequired = "Playlist name is required.";
    public const string PlaylistNameMaxLength = "Playlist name cannot exceed {MaxLength} characters.";
    public const string PlaylistDescriptionMaxLength = "Playlist description cannot exceed {MaxLength} characters.";
    public const string SongIdsRequired = "The Song identifiers collection cannot be null.";
}