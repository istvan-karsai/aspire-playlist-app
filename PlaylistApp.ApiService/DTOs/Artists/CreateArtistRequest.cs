using System.Diagnostics.CodeAnalysis;

namespace PlaylistApp.ApiService.DTOs.Artists;

[SuppressMessage("Design", "CA1054:URI parameters should not be strings", Justification = "DTOs use strings to avoid deserialization exceptions")]
[SuppressMessage("Design", "CA1056:URI properties should not be strings", Justification = "DTOs use strings to avoid deserialization exceptions")]
public record CreateArtistRequest(
    string Name,
    string? Bio,
    int? ActiveFromYear,
    string? Country,
    string? ImageUrl
);