using PlaylistApp.ApiService.Features.Artists;
using PlaylistApp.ApiService.Features.Playlists;

namespace PlaylistApp.ApiService.Features.Songs;

internal sealed class Song
{
    public const int MaxTitleLength = 200;

    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }

    public ICollection<SongArtist> SongArtists { get; set; } = [];
    public ICollection<Artist> Artists { get; set; } = []; // Skip Navigation

    public ICollection<PlaylistSong> PlaylistSongs { get; set; } = [];
    public ICollection<Playlist> Playlists { get; set; } = []; // Skip Navigation
}