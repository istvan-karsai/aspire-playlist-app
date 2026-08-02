namespace PlaylistApp.ApiService.DTOs.Songs;

public record UpdateSongRequest(
    string Title,
    TimeSpan Duration
);