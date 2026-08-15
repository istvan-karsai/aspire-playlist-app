using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.ApiService.Features.Playlists;

internal sealed class Playlist
{
    public const int MaxNameLength = 100;
    public const int MaxDescriptionLength = 500;

    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PlaylistSong> PlaylistSongs { get; set; } = [];
    public ICollection<Song> Songs { get; set; } = []; // Skip Navigation
}