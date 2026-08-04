namespace PlaylistApp.ApiService.DTOs.Artists;

public record ArtistResponse(
    Guid Id,
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);