using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Features.Artists;
using PlaylistApp.ApiService.Features.Songs;
using PlaylistApp.ApiService.Features.Songs.Constants;

namespace PlaylistApp.Tests.Integration.Features.Songs;

public class SongEndpointsTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
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
        var newSong = new CreateSongRequest("Bohemian Rhapsody", "00:05:54", []);
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/songs", newSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdSong = await response.Content.ReadFromJsonAsync<SongResponse>();
        Assert.NotNull(createdSong);

        var expectedDuration = TimeSpan.ParseExact(
            newSong.Duration,
            FormatConstants.TimeSpanFormat,
            CultureInfo.InvariantCulture
        );

        Assert.Multiple(
            () => Assert.Equal(newSong.Title, createdSong.Title),
            () => Assert.Equal(expectedDuration, createdSong.Duration),
            () => Assert.NotEqual(Guid.Empty, createdSong.Id),
            () => Assert.Empty(createdSong.Artists)
        );
    }

    [Fact]
    public async Task PostSong_WithArtistIds_CreatesRecordAndLinksArtists()
    {
        // Arrange
        var createArtistRequest = new CreateArtistRequest(
            Name: "Queen", 
            Bio: null, 
            ActiveFromYear: null, 
            Country: null, 
            ImageUrl: null
        );
        var artistPostResponse = await HttpClient.PostAsJsonAsync("/api/artists", createArtistRequest);
        var createdArtist = await artistPostResponse.Content.ReadFromJsonAsync<ArtistResponse>();

        var newSong = new CreateSongRequest("Under Pressure", "00:04:04", [createdArtist!.Id]);
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/songs", newSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdSong = await response.Content.ReadFromJsonAsync<SongResponse>();
        Assert.NotNull(createdSong);

        Assert.Multiple(
            () => Assert.Single(createdSong.Artists),
            () => Assert.Equal(createdArtist.Id, createdSong.Artists[0].Id),
            () => Assert.Equal(createdArtist.Name, createdSong.Artists[0].Name)
        );
    }

    [Fact]
    public async Task GetById_WhenSongExists_ReturnsOkAndSong()
    {
        // Arrange
        var newSong = new CreateSongRequest("Stairway to Heaven", "00:08:01", []);
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
            () => Assert.Equal(SongErrorMessages.SongNotFound, problemDetails?.Detail)
        );
    }

    [Fact]
    public async Task PutSong_WhenSongExists_UpdatesRecordAndReturnsNoContent()
    {
        // Arrange
        var initialSong = new CreateSongRequest("Under Pressure", "00:04:00", []);
        var postResponse = await HttpClient.PostAsJsonAsync("/api/songs", initialSong);
        var createdSong = await postResponse.Content.ReadFromJsonAsync<SongResponse>();
        
        var updateRequest = new UpdateSongRequest("Under Pressure", "00:04:04", []);
        var uriWithId = new Uri($"/api/songs/{createdSong!.Id}", UriKind.Relative);
    
        // Act
        var putResponse = await HttpClient.PutAsJsonAsync(uriWithId, updateRequest);
    
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

        var getResponse = await HttpClient.GetAsync(uriWithId);
        var fetchedSong = await getResponse.Content.ReadFromJsonAsync<SongResponse>();

        var expectedDuration = TimeSpan.ParseExact(
            updateRequest.Duration,
            FormatConstants.TimeSpanFormat,
            CultureInfo.InvariantCulture
        );

        Assert.Equal(expectedDuration, fetchedSong!.Duration);
    }

    [Fact]
    public async Task PutSong_WhenSongDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var updateRequest = new UpdateSongRequest("Ghost Song", "00:03:00", []);
        var putUri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.PutAsJsonAsync(putUri, updateRequest);
    
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

        Assert.Multiple(
            () => Assert.NotNull(problemDetails),
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails?.Title),
            () => Assert.Equal(SongErrorMessages.SongNotFound, problemDetails?.Detail)
        );
    }

    [Fact]
    public async Task DeleteSong_WhenSongExists_RemovesRecordAndReturns204NoContent()
    {
        // Arrange
        var newSong = new CreateSongRequest("Hotel California", "00:06:30", []);
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
            () => Assert.Equal(SongErrorMessages.SongNotFound, problemDetails?.Detail)
        );
    }

    [Fact]
    public async Task PostSong_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
    {
        // Arrange
        var invalidSong = new CreateSongRequest(
            Title: string.Empty,
            Duration: FormatConstants.ZeroDuration,
            ArtistIds: null! // Simulates missing property in JSON payload
        );
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/songs", invalidSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problemDetails);

        Assert.Multiple(
            () => Assert.Contains(SongValidationMessages.SongTitleRequired, problemDetails.Errors["Title"]),
            () => Assert.Contains(SongValidationMessages.DurationGreaterThanZero, problemDetails.Errors["Duration"]),
            () => Assert.Contains(SongValidationMessages.ArtistIdsRequired, problemDetails.Errors["ArtistIds"])
        );
    }

    [Fact]
    public async Task PutSong_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
    {
        // Arrange
        var invalidSong = new UpdateSongRequest(
            Title: new string('X', 201),
            Duration: "24:00:00", // Triggers InvalidDurationFormat error
            ArtistIds: null! // Simulates missing property in JSON payload
        );
        var uri = new Uri($"/api/songs/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.PutAsJsonAsync(uri, invalidSong);
    
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problemDetails);
        
        var expectedTitleError = SongValidationMessages.SongTitleMaxLength
            .Replace("{MaxLength}",
                Song.MaxTitleLength.ToString(CultureInfo.InvariantCulture),
                StringComparison.Ordinal
            );

        Assert.Multiple(
            () => Assert.Contains(expectedTitleError, problemDetails.Errors["Title"]),
            () => Assert.Contains(SongValidationMessages.InvalidDurationFormat, problemDetails.Errors["Duration"]),
            () => Assert.Contains(SongValidationMessages.ArtistIdsRequired, problemDetails.Errors["ArtistIds"])
        );
    }
}