using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.ApiService.Features.Artists;

internal sealed class Artist
{
    public const int MaxNameLength = 100;
    public const int MaxBioLength = 2_000;
    public const int MaxCountryLength = 100;
    public const int MaxImageUrlLength = 500;
    public const int MinActiveFromYear = 1800;

    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public int? ActiveFromYear { get; set; }
    public string? Country { get; set; }
    public string? ImageUrl { get; set; }

    public ICollection<SongArtist> SongArtists { get; set; } = [];
    public ICollection<Song> Songs { get; set; } = []; // Skip Navigation
}