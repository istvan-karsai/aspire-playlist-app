namespace PlaylistApp.ApiService.Features.Songs;

public record CreateSongRequest(
    string Title,
    string Duration,
    IReadOnlyList<Guid> ArtistIds
);