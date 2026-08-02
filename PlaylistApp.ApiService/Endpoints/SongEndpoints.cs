using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Constants;
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
                                .Select(s => new SongResponse(s.Id, s.Title, s.Duration))
                                .ToListAsync();

            return TypedResults.Ok(songs);       
        });

        group.MapPost("/", async (CreateSongRequest request, AppDbContext db) =>
        {
            var song = new Song
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Duration = request.Duration
            };

            db.Songs.Add(song);
            await db.SaveChangesAsync();

            var response = new SongResponse(song.Id, song.Title, song.Duration);

            return TypedResults.Created($"/api/songs/{song.Id}", response);
        })
        .AddEndpointFilter<ValidationFilter<CreateSongRequest>>();

        group.MapGet("/{id:guid}", async Task<Results<Ok<SongResponse>, NotFound<ProblemDetails>>> (Guid id, AppDbContext db) =>
        {
            var song = await db.Songs
                               .Where(s => s.Id == id)
                               .Select(s => new SongResponse(s.Id, s.Title, s.Duration))
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
            var song = await db.Songs.FindAsync(id);

            if (song is null)
            {
                return TypedResults.NotFound(new ProblemDetails
                {
                    Title = ErrorTitles.NotFound,
                    Detail = ErrorMessages.SongNotFound
                });
            }

            song.Title = request.Title;
            song.Duration = request.Duration;

            await db.SaveChangesAsync();

            return TypedResults.NoContent();
        })
        .AddEndpointFilter<ValidationFilter<UpdateSongRequest>>();

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
        });
    }
}