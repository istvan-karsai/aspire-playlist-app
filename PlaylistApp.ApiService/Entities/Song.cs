namespace PlaylistApp.ApiService.Entities;

internal sealed class Song
{
    public const int MaxTitleLength = 200;
    public const int MaxArtistLength = 100;

    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
}