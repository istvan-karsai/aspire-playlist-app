namespace PlaylistApp.ApiService.Features.Artists;

public record ArtistResponse(
    Guid Id,
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);