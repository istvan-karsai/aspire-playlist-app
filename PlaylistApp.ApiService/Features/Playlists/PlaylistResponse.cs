using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.ApiService.Features.Playlists;

public record PlaylistResponse(
    Guid Id,
    string Name,
    string? Description,
    DateTime CreatedAt,
    IReadOnlyList<SongResponse> Songs
);