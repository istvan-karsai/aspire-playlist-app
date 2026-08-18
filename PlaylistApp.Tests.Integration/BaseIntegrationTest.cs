using Npgsql;

namespace PlaylistApp.Tests.Integration;

[Trait("Category", "Integration")]
[Collection(nameof(AppHostCollection))]
public abstract class BaseIntegrationTest(AppHostFixture fixture) : IAsyncLifetime
{
    protected HttpClient HttpClient { get; } = fixture.HttpClient;
    private readonly string _connectionString = fixture.ConnectionString;

    public async Task InitializeAsync()
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await fixture.Respawner.ResetAsync(connection);
    }

    public Task DisposeAsync() => Task.CompletedTask;
}