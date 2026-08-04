using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.DTOs.Songs;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.Tests.Integration.Endpoints;

public class SongEndpointsTests : BaseIntegrationTest
{
    [Fact]
    public async Task GetSongs_ReturnsOk_AndEmptyListInitially()
    {
        // Arrange
        var getUri = new Uri("/api/songs", UriKind.Relative);

        // Act
        var response = await HttpClient.GetAsync(getUri);
        var songs = await response.Content.ReadFromJsonAsync<List<SongResponse>>();

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(songs);
        Assert.Empty(songs);
    }

    [Fact]
    public async Task PostSong_CreatesRecord_AndReturns201Created()
    {
        // Arrange
        var newSong = new CreateSongRequest("Bohemian Rhapsody", TimeSpan.FromMinutes(5.91));
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/songs", newSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdSong = await response.Content.ReadFromJsonAsync<SongResponse>();
        Assert.NotNull(createdSong);
        Assert.Multiple(
            () => Assert.Equal(newSong.Title, createdSong.Title),
            () => Assert.Equal(newSong.Duration, createdSong.Duration),
            () => Assert.NotEqual(Guid.Empty, createdSong.Id)
        );
    }

    [Fact]
    public async Task GetById_WhenSongExists_ReturnsOkAndSong()
    {
        // Arrange
        var newSong = new CreateSongRequest("Stairway to Heaven", TimeSpan.FromMinutes(8.03));
        var postResponse = await HttpClient.PostAsJsonAsync("/api/songs", newSong);
        var createdSong = await postResponse.Content.ReadFromJsonAsync<SongResponse>();
        var getByIdUri = new Uri($"/api/songs/{createdSong!.Id}", UriKind.Relative);
    
        // Act
        var getResponse = await HttpClient.GetAsync(getByIdUri);
    
        // Assert
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetchedSong = await getResponse.Content.ReadFromJsonAsync<SongResponse>();
        Assert.Equal(createdSong.Id, fetchedSong!.Id);
    }

    [Fact]
    public async Task GetById_WhenSongDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var getByIdUri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);

        // Act
        var response = await HttpClient.GetAsync(getByIdUri);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.Multiple(
            () => Assert.NotNull(problemDetails),
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails?.Title),
            () => Assert.Equal(ErrorMessages.SongNotFound, problemDetails?.Detail)
        );
    }

    [Fact]
    public async Task PutSong_WhenSongExists_UpdatesRecordAndReturnsNoContent()
    {
        // Arrange
        var initialSong = new CreateSongRequest("Under Pressure", TimeSpan.FromMinutes(4.0));
        var postResponse = await HttpClient.PostAsJsonAsync("/api/songs", initialSong);
        var createdSong = await postResponse.Content.ReadFromJsonAsync<SongResponse>();
        
        var updateRequest = new UpdateSongRequest("Under Pressure", TimeSpan.FromMinutes(4.08));
        var uriWithId = new Uri($"/api/songs/{createdSong!.Id}", UriKind.Relative);
    
        // Act
        var putResponse = await HttpClient.PutAsJsonAsync(uriWithId, updateRequest);
    
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

        var getResponse = await HttpClient.GetAsync(uriWithId);
        var fetchedSong = await getResponse.Content.ReadFromJsonAsync<SongResponse>();

        Assert.Equal(TimeSpan.FromMinutes(4.08), fetchedSong!.Duration);
    }

    [Fact]
    public async Task PutSong_WhenSongDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var updateRequest = new UpdateSongRequest("Ghost Song", TimeSpan.FromMinutes(3));
        var putUri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.PutAsJsonAsync(putUri, updateRequest);
    
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

        Assert.Multiple(
            () => Assert.NotNull(problemDetails),
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails?.Title),
            () => Assert.Equal(ErrorMessages.SongNotFound, problemDetails?.Detail)
        );
    }

    [Fact]
    public async Task DeleteSong_WhenSongExists_RemovesRecordAndReturns204NoContent()
    {
        // Arrange
        var newSong = new CreateSongRequest("Hotel California", TimeSpan.FromMinutes(6.5));
        var postResponse = await HttpClient.PostAsJsonAsync("/api/songs", newSong);
        var createdSong = await postResponse.Content.ReadFromJsonAsync<SongResponse>();
        var uriWithId = new Uri($"/api/songs/{createdSong!.Id}", UriKind.Relative);
    
        // Act
        var deleteResponse = await HttpClient.DeleteAsync(uriWithId);
    
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var getResponse = await HttpClient.GetAsync(uriWithId);
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteSong_WhenSongDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var deleteUri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.DeleteAsync(deleteUri);
    
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

        Assert.Multiple(
            () => Assert.NotNull(problemDetails),
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails?.Title),
            () => Assert.Equal(ErrorMessages.SongNotFound, problemDetails?.Detail)
        );
    }

    [Fact]
    public async Task PostSong_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
    {
        // Arrange
        var invalidSong = new CreateSongRequest(
            Title: string.Empty,
            Duration: TimeSpan.FromMinutes(-1)
        );
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/songs", invalidSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problemDetails);

        Assert.Multiple(
            () => Assert.Contains(ValidationMessages.SongTitleRequired, problemDetails.Errors["Title"]),
            () => Assert.Contains(ValidationMessages.DurationGreaterThanZero, problemDetails.Errors["Duration"])
        );
    }

    [Fact]
    public async Task PutSong_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
    {
        // Arrange
        var invalidSong = new UpdateSongRequest(
            Title: new string('X', 201),
            Duration: TimeSpan.Zero
        );
        var uri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.PutAsJsonAsync(uri, invalidSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problemDetails);
        
        var expectedTitleError = ValidationMessages.SongTitleMaxLength
            .Replace("{MaxLength}",
                Song.MaxTitleLength.ToString(CultureInfo.InvariantCulture),
                StringComparison.Ordinal
            );

        Assert.Multiple(
            () => Assert.Contains(expectedTitleError, problemDetails.Errors["Title"]),
            () => Assert.Contains(ValidationMessages.DurationGreaterThanZero, problemDetails.Errors["Duration"])
        );
    }
}