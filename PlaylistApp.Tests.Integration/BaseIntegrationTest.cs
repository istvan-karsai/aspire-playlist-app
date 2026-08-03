using Aspire.Hosting;
using Aspire.Hosting.Testing;

namespace PlaylistApp.Tests.Integration;

[Trait("Category", "Integration")]
public abstract class BaseIntegrationTest : IAsyncLifetime
{
    private DistributedApplication _app = null!;
    protected HttpClient HttpClient { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();
        
        _app = await appHost.BuildAsync();
        await _app.StartAsync();

        HttpClient = _app.CreateHttpClient("apiservice");
    }

    public async Task DisposeAsync()
    {
        HttpClient.Dispose();
        if (_app is not null)
        {
            await _app.DisposeAsync();
        }
    }
}