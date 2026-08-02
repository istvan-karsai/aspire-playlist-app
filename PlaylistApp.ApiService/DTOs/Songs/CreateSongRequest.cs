namespace PlaylistApp.ApiService.DTOs.Songs;

public record CreateSongRequest(
    string Title,
    TimeSpan Duration
);