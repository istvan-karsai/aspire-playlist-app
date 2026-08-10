using System.Net;
using System.Net.Http.Json;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.DTOs.Songs;

namespace PlaylistApp.Tests.Integration.Endpoints;

public class RateLimitingTests : BaseIntegrationTest
{
    [Fact]
    public async Task MutationEndpoint_ExceedingRateLimit_Returns429TooManyRequests()
    {
        // Arrange: Prepare valid payload
        var request = new CreateSongRequest("Rate Limit Test Song", "00:03:00", []);
    
        // Act: Exhaust the allowed permit limit and send the violating request
        for (int i = 0; i < PolicyConstants.PermitLimit; i++)
        {
            var response = await HttpClient.PostAsJsonAsync("/api/songs", request);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        var blockedResponse = await HttpClient.PostAsJsonAsync("/api/songs", request);
    
        // Assert: Rate limiter intercepts the extra request and returns 429
        Assert.Equal(HttpStatusCode.TooManyRequests, blockedResponse.StatusCode);
    }
}