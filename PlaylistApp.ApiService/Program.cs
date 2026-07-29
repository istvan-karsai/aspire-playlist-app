using PlaylistApp.ApiService.Data;
using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Endpoints;
using FluentValidation;
using PlaylistApp.ApiService.ExceptionHandlers;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddOpenApi();
builder.AddNpgsqlDbContext<AppDbContext>("playlistdb");

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Migrations run ONLY against a real SQL database
    // Skips this step when using an InMemory database
    if (dbContext.Database.IsRelational())
    {
        dbContext.Database.Migrate();
    }
}

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapDefaultEndpoints();
app.MapSongEndpoints();
app.Run();

// This exists purely so WebApplicationFactory can locate this assembly without name collisions
namespace PlaylistApp.ApiService
{
    public class ApiMarker { }
}