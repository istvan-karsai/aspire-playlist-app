using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.Features.Artists.Constants;
using PlaylistApp.ApiService.Filters;

namespace PlaylistApp.ApiService.Features.Artists;

public static class ArtistEndpoints
{
    public static void MapArtistEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/artists").WithTags("Artists");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var artists = await db.Artists
                                  .AsNoTracking()
                                  .OrderBy(a => a.Name)
                                  .Select(a => new ArtistResponse(
                                    a.Id,
                                    a.Name,
                                    a.Bio,
                                    a.ActiveFromYear,
                                    a.Country,
                                    a.ImageUrl))
                                  .ToListAsync();
            
            return TypedResults.Ok(artists);
        });

        group.MapPost("/", async (CreateArtistRequest request, AppDbContext db) =>
        {
            var artist = new Artist
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Bio = request.Bio?.Trim(),
                ActiveFromYear = request.ActiveFromYear,
                Country = request.Country?.Trim(),
                ImageUrl = request.ImageUrl?.Trim()
            };

            db.Artists.Add(artist);
            await db.SaveChangesAsync();

            var response = new ArtistResponse(
                artist.Id,
                artist.Name,
                artist.Bio,
                artist.ActiveFromYear,
                artist.Country,
                artist.ImageUrl
            );

            return TypedResults.Created($"/api/artists/{artist.Id}", response);
        })
        .AddEndpointFilter<ValidationFilter<CreateArtistRequest>>()
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);

        group.MapGet("/{id:guid}", async Task<Results<Ok<ArtistResponse>, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var artist = await db.Artists
                                 .AsNoTracking()
                                 .Where(a => a.Id == id)
                                 .Select(a => new ArtistResponse(
                                    a.Id,
                                    a.Name,
                                    a.Bio,
                                    a.ActiveFromYear,
                                    a.Country,
                                    a.ImageUrl))
                                 .FirstOrDefaultAsync();

            if (artist is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ArtistErrorMessages.ArtistNotFound
                });
            }

            return TypedResults.Ok(artist);
        })
        .WithName("GetArtistById");

        group.MapPut("/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (Guid id, UpdateArtistRequest request, AppDbContext db) =>
        {
            var artist = await db.Artists.FindAsync(id);

            if (artist is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ArtistErrorMessages.ArtistNotFound
                });
            }

            artist.Name = request.Name.Trim();
            artist.Bio = request.Bio?.Trim();
            artist.ActiveFromYear = request.ActiveFromYear;
            artist.Country = request.Country?.Trim();
            artist.ImageUrl = request.ImageUrl?.Trim();

            await db.SaveChangesAsync();

            return TypedResults.NoContent();
        })
        .AddEndpointFilter<ValidationFilter<UpdateArtistRequest>>()
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);

        group.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var deletedCount = await db.Artists
                                       .Where(a => a.Id == id)
                                       .ExecuteDeleteAsync();

            if (deletedCount == 0)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ArtistErrorMessages.ArtistNotFound
                });
            }

            return TypedResults.NoContent();
        })
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);
    }
}