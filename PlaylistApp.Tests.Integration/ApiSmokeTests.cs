using System.Net;

namespace PlaylistApp.Tests.Integration;

public class ApiSmokeTests : BaseIntegrationTest
{
    [Fact]
    public async Task AppHost_StartsSuccessfully_AndApiIsHealthy()
    {
        // Arrange
        var healthUri = new Uri("/health", UriKind.Relative);

        // Act
        var response = await HttpClient.GetAsync(healthUri);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}