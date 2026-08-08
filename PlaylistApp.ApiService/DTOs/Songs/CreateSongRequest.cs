namespace PlaylistApp.ApiService.DTOs.Songs;

public record CreateSongRequest(
    string Title,
    string Duration,
    IReadOnlyList<Guid> ArtistIds
);