namespace PlaylistApp.ApiService.DTOs.Songs;

public record UpdateSongRequest(
    string Title,
    string Duration,
    IReadOnlyList<Guid> ArtistIds
);