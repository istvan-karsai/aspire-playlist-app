namespace PlaylistApp.ApiService.Features.Artists;

public record CreateArtistRequest(
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);