using System.Net;
using System.Net.Http.Json;
using Aspire.Hosting.Testing;
using PlaylistApp.ApiService.DTOs.Songs;

namespace PlaylistApp.Tests.Integration;

public class SongEndpointsTests
{
    [Fact]
    public async Task GetSongs_ReturnsOk_AndEmptyListInitially()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();
        
        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        using var httpClient = app.CreateHttpClient("apiservice");
        var getUri = new Uri("/api/songs", UriKind.Relative);

        // When
        var response = await httpClient.GetAsync(getUri);

        var songs = await response.Content.ReadFromJsonAsync<List<SongResponse>>();

        // Then
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(songs);
        Assert.Empty(songs);
    }

    [Fact]
    public async Task PostSong_CreatesRecord_AndReturns201Created()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        using var httpClient = app.CreateHttpClient("apiservice");

        var newSong = new CreateSongRequest("Bohemian Rhapsody", "Queen", TimeSpan.FromMinutes(5.91));
    
        // When
        var response = await httpClient.PostAsJsonAsync("/api/songs", newSong);
    
        // Then
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdSong = await response.Content.ReadFromJsonAsync<SongResponse>();
        Assert.NotNull(createdSong);
        Assert.Equal(newSong.Title, createdSong.Title);
        Assert.Equal(newSong.Artist, createdSong.Artist);
        Assert.Equal(newSong.Duration, createdSong.Duration);
        Assert.NotEqual(Guid.Empty, createdSong.Id);
    }
}