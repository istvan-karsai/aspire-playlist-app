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

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();
        
        using var httpClient = app.CreateHttpClient("apiservice");
        var healthUri = new Uri("/health", UriKind.Relative);

        // When
        var response = await httpClient.GetAsync(healthUri);

        // Then
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}