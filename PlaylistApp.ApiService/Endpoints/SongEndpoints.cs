using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.DTOs.Songs;
using PlaylistApp.ApiService.Entities;
using PlaylistApp.ApiService.Filters;

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
                                .ToListAsync();

            return Results.Ok(songs);       
        });

        group.MapPost("/", async (CreateSongRequest request, AppDbContext db) =>
        {
            var song = new Song
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Artist = request.Artist,
                Duration = request.Duration
            };

            db.Songs.Add(song);
            await db.SaveChangesAsync();

            var response = new SongResponse(song.Id, song.Title, song.Artist, song.Duration);

            return Results.Created($"/api/songs/{song.Id}", response);
        })
        .AddEndpointFilter<ValidationFilter<CreateSongRequest>>();

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var song = await db.Songs
                               .Where(s => s.Id == id)
                               .Select(s => new SongResponse(s.Id, s.Title, s.Artist, s.Duration))
                               .FirstOrDefaultAsync();
            
            return song is not null ?
                Results.Ok(song) :
                Results.NotFound();
        })
        .WithName("GetSongById");

        group.MapPut("/{id:guid}", async (Guid id, UpdateSongRequest request, AppDbContext db) =>
        {
            var song = await db.Songs.FindAsync(id);

            if (song is null)
            {
                return Results.NotFound();
            }

            song.Title = request.Title;
            song.Artist = request.Artist;
            song.Duration = request.Duration;

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter<ValidationFilter<UpdateSongRequest>>();

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var deletedCount = await db.Songs
                                       .Where(s => s.Id == id)
                                       .ExecuteDeleteAsync();
            
            return deletedCount > 0 ? Results.NoContent() : Results.NotFound();
        });
    }
}