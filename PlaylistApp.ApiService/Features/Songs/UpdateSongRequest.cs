namespace PlaylistApp.ApiService.Features.Songs;

public record UpdateSongRequest(
    string Title,
    string Duration,
    IReadOnlyList<Guid> ArtistIds
);