using PlaylistApp.ApiService.DTOs.Artists;

namespace PlaylistApp.ApiService.DTOs.Songs;

public record SongResponse(
    Guid Id,
    string Title,
    TimeSpan Duration,
    IReadOnlyList<ArtistSummaryResponse> Artists
);