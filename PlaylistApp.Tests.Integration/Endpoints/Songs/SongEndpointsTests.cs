using System.Net;
using System.Net.Http.Json;
using Aspire.Hosting.Testing;
using PlaylistApp.ApiService.DTOs.Songs;

namespace PlaylistApp.Tests.Integration.Endpoints.Songs;

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

    [Fact]
    public async Task GetById_WhenSongExists_ReturnsOkAndSong()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        using var httpClient = app.CreateHttpClient("apiservice");

        var newSong = new CreateSongRequest("Stairway to Heaven", "Led Zeppelin", TimeSpan.FromMinutes(8.03));
        var postResponse = await httpClient.PostAsJsonAsync("/api/songs", newSong);
        var createdSong = await postResponse.Content.ReadFromJsonAsync<SongResponse>();
    
        // When
        var getByIdUri = new Uri($"/api/songs/{createdSong!.Id}", UriKind.Relative);
        var getResponse = await httpClient.GetAsync(getByIdUri);
    
        // Then
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetchedSong = await getResponse.Content.ReadFromJsonAsync<SongResponse>();
        Assert.Equal(createdSong.Id, fetchedSong!.Id);
    }

    [Fact]
    public async Task GetById_WhenSongDoesNotExist_ReturnsNotFound()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        using var httpClient = app.CreateHttpClient("apiservice");

        // When
        var getByIdUri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
        var response = await httpClient.GetAsync(getByIdUri);

        // Then
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PutSong_WhenSongExists_UpdatesRecordAndReturnsNoContent()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        using var httpClient = app.CreateHttpClient("apiservice");

        var initialSong = new CreateSongRequest("Under Pressure", "Queen", TimeSpan.FromMinutes(4.0));
        var postResponse = await httpClient.PostAsJsonAsync("/api/songs", initialSong);
        var createdSong = await postResponse.Content.ReadFromJsonAsync<SongResponse>();
        
        var updateRequest = new UpdateSongRequest("Under Pressure", "Queen & David Bowie", TimeSpan.FromMinutes(4.08));
    
        // When
        var uriWithId = new Uri($"/api/songs/{createdSong!.Id}", UriKind.Relative);
        var putResponse = await httpClient.PutAsJsonAsync(uriWithId, updateRequest);
    
        // Then
        Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

        var getResponse = await httpClient.GetAsync(uriWithId);
        var fetchedSong = await getResponse.Content.ReadFromJsonAsync<SongResponse>();

        Assert.Equal("Queen & David Bowie", fetchedSong!.Artist);
        Assert.Equal(TimeSpan.FromMinutes(4.08), fetchedSong.Duration);
    }

    [Fact]
    public async Task PutSong_WhenSongDoesNotExist_ReturnsNotFound()
    {
        // Given
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.PlaylistApp_AppHost>();

        await using var app = await appHost.BuildAsync();
        await app.StartAsync();

        using var httpClient = app.CreateHttpClient("apiservice");

        var updateRequest = new UpdateSongRequest("Ghost Song", "Nobody", TimeSpan.FromMinutes(3));
    
        // When
        var putUri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
        var response = await httpClient.PutAsJsonAsync(putUri, updateRequest);
    
        // Then
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}