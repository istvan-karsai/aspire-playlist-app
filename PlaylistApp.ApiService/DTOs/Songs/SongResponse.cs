namespace PlaylistApp.ApiService.DTOs.Songs;

public record SongResponse(
    Guid Id,
    string Title,
    string Artist,
    TimeSpan Duration
);