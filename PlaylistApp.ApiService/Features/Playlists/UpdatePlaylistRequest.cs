namespace PlaylistApp.ApiService.Features.Playlists;

public record UpdatePlaylistRequest(
    string Name,
    string? Description,
    IReadOnlyList<Guid> SongIds
);