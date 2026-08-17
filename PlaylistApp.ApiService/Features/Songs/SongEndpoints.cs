using System.Globalization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.Features.Artists;
using PlaylistApp.ApiService.Filters;

namespace PlaylistApp.ApiService.Features.Songs;

public static class SongEndpoints
{
    public static void MapSongEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/songs").WithTags("Songs");

        group.MapGet("/", async ([FromQuery] Guid? artistId, AppDbContext db) =>
        {
            var query = db.Songs
                          .AsNoTracking()
                          .AsQueryable();

            if (artistId.HasValue)
            {
                query = query.Where(s => s.Artists.Any(a => a.Id == artistId));
            }
            
            var songs = await query
                                .Select(s => new SongResponse(
                                    s.Id, 
                                    s.Title, 
                                    s.Duration,
                                    s.Artists.Select(a => new ArtistSummaryResponse(a.Id, a.Name)).ToList()
                                ))
                                .ToListAsync();

            return TypedResults.Ok(songs);       
        });

        group.MapPost("/", async (CreateSongRequest request, AppDbContext db) =>
        {
            var artists = await db.Artists
                                  .Where(a => request.ArtistIds.Contains(a.Id))
                                  .ToListAsync();
            
            var song = new Song
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Duration = TimeSpan.ParseExact(
                    request.Duration, 
                    FormatConstants.TimeSpanFormat, 
                    CultureInfo.InvariantCulture
                ),
                Artists = artists
            };

            db.Songs.Add(song);
            await db.SaveChangesAsync();

            var response = new SongResponse(
                song.Id, 
                song.Title, 
                song.Duration,
                song.Artists.Select(a => new ArtistSummaryResponse(a.Id, a.Name)).ToList()
            );

            return TypedResults.Created($"/api/songs/{song.Id}", response);
        })
        .AddEndpointFilter<ValidationFilter<CreateSongRequest>>()
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);

        group.MapGet("/{id:guid}", async Task<Results<Ok<SongResponse>, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var song = await db.Songs
                               .AsNoTracking()
                               .Where(s => s.Id == id)
                               .Select(s => new SongResponse(
                                    s.Id, 
                                    s.Title, 
                                    s.Duration,
                                    s.Artists.Select(a => new ArtistSummaryResponse(a.Id, a.Name)).ToList()
                                ))
                               .FirstOrDefaultAsync();
            
            if (song is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ErrorMessages.SongNotFound
                });
            }

            return TypedResults.Ok(song);
        })
        .WithName("GetSongById");

        group.MapPut("/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (Guid id, UpdateSongRequest request, AppDbContext db) =>
        {
            var song = await db.Songs
                               .Include(s => s.Artists)
                               .FirstOrDefaultAsync(s => s.Id == id);

            if (song is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ErrorMessages.SongNotFound
                });
            }

            var requestedArtists = await db.Artists
                                           .Where(a => request.ArtistIds.Contains(a.Id))
                                           .ToListAsync();

            song.Title = request.Title;
            song.Duration = TimeSpan.ParseExact(
                request.Duration, 
                FormatConstants.TimeSpanFormat, 
                CultureInfo.InvariantCulture
            );

            song.Artists.Clear();
            foreach(var artist in requestedArtists)
            {
                song.Artists.Add(artist);
            }

            await db.SaveChangesAsync();

            return TypedResults.NoContent();
        })
        .AddEndpointFilter<ValidationFilter<UpdateSongRequest>>()
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);

        group.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var deletedCount = await db.Songs
                                       .Where(s => s.Id == id)
                                       .ExecuteDeleteAsync();
            
            if (deletedCount == 0)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ErrorMessages.SongNotFound
                });
            }

            return TypedResults.NoContent();
        })
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);
    }
}