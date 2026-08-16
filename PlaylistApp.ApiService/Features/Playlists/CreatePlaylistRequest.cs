namespace PlaylistApp.ApiService.Features.Playlists;

public record CreatePlaylistRequest(
    string Name,
    string? Description,
    IReadOnlyList<Guid> SongIds
);