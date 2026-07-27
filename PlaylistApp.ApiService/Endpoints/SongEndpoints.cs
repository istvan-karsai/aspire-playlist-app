using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.DTOs.Songs;

namespace PlaylistApp.ApiService.Endpoints;

public static class SongEndpoints
{
    public static void MapSongEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/songs").WithTags("Songs");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var songs = await db.Songs
                                .Select(s => new SongResponse(s.Id, s.Title, s.Artist, s.Duration))
                                .ToListAsync()
                                .ConfigureAwait(false);

            return Results.Ok(songs);       
        });
    }
}