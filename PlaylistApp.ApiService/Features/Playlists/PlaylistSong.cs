using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.ApiService.Features.Playlists;

internal sealed class PlaylistSong
{
    public Guid PlaylistId { get; set; }
    public Playlist Playlist { get; set; } = null!;

    public Guid SongId { get; set; }
    public Song Song { get; set; } = null!;

    // Tracks the order of songs in the playlist
    public int Position { get; set; }
}