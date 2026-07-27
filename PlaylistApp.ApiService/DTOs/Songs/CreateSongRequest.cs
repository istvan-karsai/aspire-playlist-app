namespace PlaylistApp.ApiService.DTOs.Songs;

public record CreateSongRequest(
    string Title,
    string Artist,
    TimeSpan Duration
);