namespace PlaylistApp.ApiService.Features.Artists;

public record UpdateArtistRequest(
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);