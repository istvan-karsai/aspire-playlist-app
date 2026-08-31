using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PlaylistApp.ApiService;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Data;
using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.Tests.Integration.Security;

[Trait("Category", "Security")]
public class RateLimitingTests(WebApplicationFactory<ApiMarker> factory) : IClassFixture<WebApplicationFactory<ApiMarker>>
{
    [Fact]
    public async Task MutationEndpoint_ExceedingRateLimit_Returns429TooManyRequests()
    {
        // Arrange: Prepare valid payload
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
            });
        }).CreateClient();
        
        var request = new CreateSongRequest("Rate Limit Test Song", "00:03:00", []);
        HttpResponseMessage response;
        int attempts = 0;
        int maxAttempts = PolicyConstants.PermitLimit + 1;
    
        // Act: Fire requests until the remaining shared limit is exhausted
        do
        {
            response = await client.PostAsJsonAsync("/api/songs", request);
            attempts++;

            // If we hit the limit, break out immediately
            if (response.StatusCode == HttpStatusCode.TooManyRequests)
            {
                break;
            }

        } while (response.StatusCode == HttpStatusCode.Created && attempts < maxAttempts);

        // Assert: Verify that the loop broke specifically because it hit a 429 Too Many Requests
        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
    }
}