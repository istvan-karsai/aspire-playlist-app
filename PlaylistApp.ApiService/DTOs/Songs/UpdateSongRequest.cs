namespace PlaylistApp.ApiService.DTOs.Songs;

public record UpdateSongRequest(
    string Title,
    string Artist,
    TimeSpan Duration
);