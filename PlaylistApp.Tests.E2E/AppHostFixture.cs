using Aspire.Hosting;
using Aspire.Hosting.ApplicationModel;
using Aspire.Hosting.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace PlaylistApp.Tests.E2E;

public class AppHostFixture : IAsyncLifetime
{
    public string FrontendAddress { get; private set; } = string.Empty;
    public DistributedApplication App { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        // 1. Arrange the Aspire AppHost
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        appHost.Services.ConfigureHttpClientDefaults(clientBuilder =>
        {
            clientBuilder.AddStandardResilienceHandler();
        });

        // 2. Start the distributed application
        App = await appHost.BuildAsync();
        await App.StartAsync();

        // 3. Extract the dynamic URL for the frontend
        var frontendResource = App.Services.GetRequiredService<ResourceNotificationService>();
        await frontendResource.WaitForResourceAsync("react", KnownResourceStates.Running);

        using var httpClient = App.CreateHttpClient("react");
        FrontendAddress = httpClient.BaseAddress?.ToString()
            ?? throw new InvalidOperationException("Could not resolve frontend URL from Aspire.");
    }

    public async Task DisposeAsync()
    {
        if (App is not null)
        {
            await App.StopAsync();
            await App.DisposeAsync();
        }
    }
}