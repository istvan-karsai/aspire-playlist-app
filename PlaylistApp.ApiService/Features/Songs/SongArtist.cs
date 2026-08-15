using PlaylistApp.ApiService.Features.Artists;

namespace PlaylistApp.ApiService.Features.Songs;

internal sealed class SongArtist
{
    public Guid SongId { get; set; }
    public Song Song { get; set; } = null!;

    public Guid ArtistId { get; set; }
    public Artist Artist { get; set; } = null!;
}