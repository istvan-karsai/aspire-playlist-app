using System.Net;
using Aspire.Hosting.Testing;

namespace PlaylistApp.Tests.Integration;

public class ApiSmokeTests
{
    [Fact]
    public async Task AppHost_StartsSuccessfully_AndApiIsHealthy()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();
        var healthUri = new Uri("/health", UriKind.Relative);

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        // When
        using var httpClient = app.CreateHttpClient("apiservice");
        var response = await httpClient.GetAsync(healthUri);

        // Then
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}