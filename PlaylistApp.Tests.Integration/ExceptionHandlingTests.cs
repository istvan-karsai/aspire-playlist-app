using System.Net;
using System.Net.Http.Json;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PlaylistApp.ApiService;
using PlaylistApp.ApiService.DTOs.Songs;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.Constants;

namespace PlaylistApp.Tests.Integration;

[Trait("Category", "Integration")]
public class ExceptionHandlingTests(WebApplicationFactory<ApiMarker> factory) : IClassFixture<WebApplicationFactory<ApiMarker>>
{
    private sealed class CrashingSongValidator : AbstractValidator<CreateSongRequest>
    {
        public CrashingSongValidator()
        {
            RuleFor(x => x.Title)
                .Must(x => throw new InvalidOperationException("Simulated systemic failure."));
        }
    }

    [Fact]
    public async Task UnhandledException_IsCaught_AndReturns500ProblemDetails()
    {
        // Arrange
        var client = factory.WithWebHostBuilder(builder =>
        {
            builder.UseSetting("ConnectionStrings:playlistdb", "Host=localhost;Database=dummy;Username=test;Password=test");

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<AppDbContext>>();

                services.AddSingleton(sp => 
                    new DbContextOptionsBuilder<AppDbContext>()
                        .UseInMemoryDatabase("ExceptionTestingDb")
                        .Options
                );

                services.RemoveAll<IValidator<CreateSongRequest>>();
                services.AddScoped<IValidator<CreateSongRequest>, CrashingSongValidator>();
            });
        }).CreateClient();

        var request = new CreateSongRequest("Valid Title", TimeSpan.FromMinutes(3));

        // Act
        var response = await client.PostAsJsonAsync("/api/songs", request);
    
        // Assert
        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

        Assert.Multiple(
            () => Assert.NotNull(problemDetails),
            () => Assert.Equal(ErrorTitles.InternalServerError, problemDetails?.Title),
            () => Assert.Equal(ErrorMessages.InternalServerError, problemDetails?.Detail),
            () => Assert.Equal(StatusCodes.Status500InternalServerError, problemDetails?.Status),
            () => Assert.Equal(ErrorTypes.InternalServerError, problemDetails?.Type)
        );
    }
}