namespace PlaylistApp.ApiService.DTOs.Artists;

public record UpdateArtistRequest(
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);