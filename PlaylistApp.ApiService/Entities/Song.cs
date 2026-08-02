namespace PlaylistApp.ApiService.Entities;

internal sealed class Song
{
    public const int MaxTitleLength = 200;

    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }

    public ICollection<SongArtist> SongArtists { get; set; } = [];
    public ICollection<Artist> Artists { get; set; } = []; // Skip Navigation
}