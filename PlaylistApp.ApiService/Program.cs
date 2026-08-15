using PlaylistApp.ApiService.Data;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using PlaylistApp.ApiService.ExceptionHandlers;
using Scalar.AspNetCore;
using PlaylistApp.ApiService.Telemetry;
using PlaylistApp.ApiService.Constants;
using System.Threading.RateLimiting;
using PlaylistApp.ApiService.Features.Songs;
using PlaylistApp.ApiService.Features.Artists;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy(PolicyConstants.CorsPolicy, policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader(); 
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy(PolicyConstants.RateLimitingPolicy, httpContext =>
    {
        var clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown_client";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = PolicyConstants.PermitLimit,  // Max 10 requests
                Window = PolicyConstants.Window,            // Per 1-minute window
                QueueLimit = PolicyConstants.QueueLimit     // Reject immediately when exceeded
            }
        );
    });
});

builder.Services.AddSingleton<PlaylistMetrics>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddOpenApi();

builder.Services.AddOpenTelemetry()
                .WithMetrics(metrics =>
                {
                    metrics.AddMeter(PlaylistMetrics.MeterName);
                });

builder.AddNpgsqlDbContext<AppDbContext>("playlistdb");

var app = builder.Build();

app.UseRateLimiter();

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
    app.MapScalarApiReference(options =>
    {
        options.Title = "Playlist API";
        options.Theme = ScalarTheme.DeepSpace;
    });
}

app.UseHttpsRedirection();
app.UseCors(PolicyConstants.CorsPolicy);
app.MapDefaultEndpoints();
app.MapSongEndpoints();
app.MapArtistEndpoints();
app.Run();

// This exists purely so WebApplicationFactory can locate this assembly without name collisions
namespace PlaylistApp.ApiService
{
    public class ApiMarker { }
}