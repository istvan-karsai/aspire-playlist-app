using PlaylistApp.ApiService.Features.Artists;

namespace PlaylistApp.ApiService.Features.Songs;

public record SongResponse(
    Guid Id,
    string Title,
    TimeSpan Duration,
    IReadOnlyList<ArtistSummaryResponse> Artists
);