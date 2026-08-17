using System.Net;
using System.Net.Http.Json;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.Tests.Integration.Security;

[Trait("Category", "Security")]
public class RateLimitingTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
{
    [Fact]
    public async Task MutationEndpoint_ExceedingRateLimit_Returns429TooManyRequests()
    {
        // Arrange: Prepare valid payload
        var request = new CreateSongRequest("Rate Limit Test Song", "00:03:00", []);
        HttpResponseMessage response;
        int attempts = 0;
        int maxAttempts = PolicyConstants.PermitLimit + 1;
    
        // Act: Fire requests until the remaining shared limit is exhausted
        do
        {
            response = await HttpClient.PostAsJsonAsync("/api/songs", request);
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