namespace PlaylistApp.ApiService.DTOs.Artists;

public record CreateArtistRequest(
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);