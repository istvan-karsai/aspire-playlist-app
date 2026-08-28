using System.Net;
using Aspire.Hosting;
using Aspire.Hosting.Testing;
using Npgsql;
using Respawn;

namespace PlaylistApp.Tests.Integration;

public class AppHostFixture : IAsyncLifetime
{
    private DistributedApplication _app = null!;
    public HttpClient HttpClient { get; private set; } = null!;
    public string ConnectionString { get; private set; } = null!;
    public Respawner Respawner { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        _app = await appHost.BuildAsync();
        await _app.StartAsync();

        HttpClient = _app.CreateHttpClient("apiservice");

        ConnectionString = await _app.GetConnectionStringAsync("playlistdb")
            ?? throw new InvalidOperationException("Connection string 'playlistdb' not found.");

        var healthUri = new Uri("/health", UriKind.Relative);
        int healthCheckAttempts = 0;
        const int maxHealthCheckAttempts = 1_000;

        // Wait for the API and EF Core Migrations to be 100% healthy
        while (healthCheckAttempts < maxHealthCheckAttempts)
        {
            try
            {
                var response = await HttpClient.GetAsync(healthUri);
                if (response.IsSuccessStatusCode) break;
            }
            catch (HttpRequestException)
            {
                // Ignore connection refusals while the AppHost is still booting the server
            }
            healthCheckAttempts++;
            await Task.Delay(100);
        }

        if (healthCheckAttempts >= maxHealthCheckAttempts)
        {
            throw new TimeoutException("The API failed te report healthy within 100 seconds. Database or AppHost failed to boot.");
        }

        // Create the Respawner ONCE after tables are guaranteed to exist
        await using var connection = new NpgsqlConnection(ConnectionString);
        await connection.OpenAsync();

        Respawner = await Respawner.CreateAsync(connection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = ["public"]
        });
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