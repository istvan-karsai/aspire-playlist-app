using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.Features.Artists;
using PlaylistApp.ApiService.Features.Playlists.Constants;
using PlaylistApp.ApiService.Features.Songs;
using PlaylistApp.ApiService.Filters;

namespace PlaylistApp.ApiService.Features.Playlists;

public static class PlaylistEndpoints
{
    public static void MapPlaylistEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/playlists").WithTags("Playlists");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var playlists = await db.Playlists
                                    .AsNoTracking()
                                    .AsSplitQuery()
                                    .Select(p => new PlaylistResponse(
                                        p.Id,
                                        p.Name,
                                        p.Description,
                                        p.CreatedAt,
                                        p.PlaylistSongs
                                            .OrderBy(ps => ps.Position)
                                            .Select(ps => new SongResponse(
                                                ps.Song.Id,
                                                ps.Song.Title,
                                                ps.Song.Duration,
                                                ps.Song.Artists.Select(a => new ArtistSummaryResponse(a.Id, a.Name)).ToList()
                                            )).ToList()
                                    ))
                                    .ToListAsync();
            
            return TypedResults.Ok(playlists);
        });

        group.MapPost("/", async (CreatePlaylistRequest request, AppDbContext db) =>
        {
            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description  
            };

            for (int i = 0; i < request.SongIds.Count; i++)
            {
                playlist.PlaylistSongs.Add(new PlaylistSong
                {
                    PlaylistId = playlist.Id,
                    SongId = request.SongIds[i],
                    Position = i
                });
            }

            db.Playlists.Add(playlist);
            await db.SaveChangesAsync();

            // To return a complete 201 Created response, we need to fetch the newly linked songs' full data
            var linkedSongsDict = await db.Songs
                .Include(s => s.Artists)
                .Where(s => request.SongIds.Contains(s.Id))
                .ToDictionaryAsync(s => s.Id);

            var orderedSongs = request.SongIds
                .Where(linkedSongsDict.ContainsKey)
                .Select(id =>
                {
                    var song = linkedSongsDict[id];
                    return new SongResponse(
                        song.Id,
                        song.Title,
                        song.Duration,
                        song.Artists.Select(a => new ArtistSummaryResponse(a.Id, a.Name)).ToList()
                    );
                })
                .ToList();

            var response = new PlaylistResponse(
                playlist.Id,
                playlist.Name,
                playlist.Description,
                playlist.CreatedAt,
                orderedSongs
            );

            return TypedResults.Created($"/api/results/{playlist.Id}", response);
        })
        .AddEndpointFilter<ValidationFilter<CreatePlaylistRequest>>()
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);

        group.MapGet("/{id:guid}", async Task<Results<Ok<PlaylistResponse>, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var playlist = await db.Playlists
                                   .AsNoTracking()
                                   .AsSplitQuery()
                                   .Where(p => p.Id == id)
                                   .Select(p => new PlaylistResponse(
                                        p.Id,
                                        p.Name,
                                        p.Description,
                                        p.CreatedAt,
                                        p.PlaylistSongs
                                            .Select(ps => new SongResponse(
                                                ps.Song.Id,
                                                ps.Song.Title,
                                                ps.Song.Duration,
                                                ps.Song.Artists.Select(a => new ArtistSummaryResponse(a.Id, a.Name)).ToList()
                                            )).ToList()
                                   ))
                                   .FirstOrDefaultAsync();
            
            if (playlist is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = PlaylistErrorMessages.PlaylistNotFound
                });
            }

            return TypedResults.Ok(playlist);
        })
        .WithName("GetPlaylistById");

        group.MapPut("/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (Guid id, UpdatePlaylistRequest request, AppDbContext db) =>
        {
            var playlist = await db.Playlists
                                   .Include(p => p.PlaylistSongs)
                                   .FirstOrDefaultAsync(p => p.Id == id);

            if (playlist is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = PlaylistErrorMessages.PlaylistNotFound
                });
            }

            playlist.Name = request.Name;
            playlist.Description = request.Description;

            playlist.PlaylistSongs.Clear();
            for (int i = 0; i < request.SongIds.Count; i++)
            {
                playlist.PlaylistSongs.Add(new PlaylistSong
                {
                    PlaylistId = playlist.Id,
                    SongId = request.SongIds[i],
                    Position = i
                });
            }

            await db.SaveChangesAsync();

            return TypedResults.NoContent();
        })
        .AddEndpointFilter<ValidationFilter<UpdatePlaylistRequest>>()
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);

        group.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var deletedCount = await db.Playlists
                                       .Where(p => p.Id == id)
                                       .ExecuteDeleteAsync();

            if (deletedCount == 0)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = PlaylistErrorMessages.PlaylistNotFound
                });
            }

            return TypedResults.NoContent();
        })
        .RequireRateLimiting(PolicyConstants.RateLimitingPolicy);
    }
}