using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.DTOs.Artists;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.Tests.Integration.Endpoints;

public class ArtistEndpointsTests : BaseIntegrationTest
{
    [Fact]
    public async Task GetArtists_ReturnsOk_AndEmptyListInitially()
    {
        // Arrange
        var getUri = new Uri("/api/artists", UriKind.Relative);
    
        // Act
        var response = await HttpClient.GetAsync(getUri);
        var artists = await response.Content.ReadFromJsonAsync<List<ArtistResponse>>();
    
        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(artists);
        Assert.Empty(artists);
    }
    
    [Fact]
    public async Task PostArtist_CreatesRecord_AndReturns201Created()
    {
        // Arrange
        var newArtist = new CreateArtistRequest(
            Name: "Queen", 
            Bio: "British Rock Band", 
            ActiveFromYear: 1970, 
            Country: "UK", 
            ImageUrl: null
        );
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/artists", newArtist);
    
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var createdArtist = await response.Content.ReadFromJsonAsync<ArtistResponse>();
        Assert.NotNull(createdArtist);
        Assert.Multiple(
            () => Assert.Equal(newArtist.Name, createdArtist.Name),
            () => Assert.Equal(newArtist.Bio, createdArtist.Bio),
            () => Assert.Equal(newArtist.ActiveFromYear, createdArtist.ActiveFromYear),
            () => Assert.Equal(newArtist.Country, createdArtist.Country),
            () => Assert.NotEqual(Guid.Empty, createdArtist.Id)
        );
    }
    
    [Fact]
    public async Task GetById_WhenArtistExists_ReturnsOkAndArtist()
    {
        // Arrange
        var newArtist = new CreateArtistRequest(
            Name: "Led Zeppelin",
            Bio: null,
            ActiveFromYear: 1968,
            Country: "UK",
            ImageUrl: null
        );
        var postResponse = await HttpClient.PostAsJsonAsync("/api/artists", newArtist);
        var createdArtist = await postResponse.Content.ReadFromJsonAsync<ArtistResponse>();
        var getByIdUri = new Uri($"/api/artists/{createdArtist!.Id}", UriKind.Relative);
    
        // Act
        var getResponse = await HttpClient.GetAsync(getByIdUri);
    
        // Assert
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var fetchedArtist = await getResponse.Content.ReadFromJsonAsync<ArtistResponse>();
        Assert.Equal(createdArtist.Id, fetchedArtist!.Id);
    }
    
    [Fact]
    public async Task GetById_WhenArtistDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var getByIdUri = new Uri($"/api/artists/{Guid.NewGuid()}", UriKind.Relative);

        // Act
        var response = await HttpClient.GetAsync(getByIdUri);
    
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Multiple(
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
            () => Assert.Equal(ErrorMessages.ArtistNotFound, problemDetails.Detail)
        );
    }
    
    [Fact]
    public async Task PutArtist_WhenArtistExists_UpdatesRecordAndReturnsNoContent()
    {
        // Arrange
        var initialArtist = new CreateArtistRequest(
            Name: "David Bowie",
            Bio: null,
            ActiveFromYear: null,
            Country: null,
            ImageUrl: null
        );
        var postResponse = await HttpClient.PostAsJsonAsync("/api/artists", initialArtist);
        var createdArtist = await postResponse.Content.ReadFromJsonAsync<ArtistResponse>();

        var updateRequest = new UpdateArtistRequest(
            Name: "David Bowie",
            Bio: "Legendary artist",
            ActiveFromYear: 1962,
            Country: "UK",
            ImageUrl: "https://example.com/bowie.jpg"
        );
        var uriWithId = new Uri($"/api/artists/{createdArtist!.Id}", UriKind.Relative);
    
        // Act
        var putResponse = await HttpClient.PutAsJsonAsync(uriWithId, updateRequest);
    
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

        var getResponse = await HttpClient.GetAsync(uriWithId);
        var fetchedArtist = await getResponse.Content.ReadFromJsonAsync<ArtistResponse>();

        Assert.Multiple(
            () => Assert.Equal("Legendary artist", fetchedArtist!.Bio),
            () => Assert.Equal(1962, fetchedArtist!.ActiveFromYear)
        );
    }
    
    [Fact]
    public async Task PutArtist_WhenArtistDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var updateRequest = new UpdateArtistRequest(
            Name: "Ghost Artist",
            Bio: null,
            ActiveFromYear: null,
            Country: null,
            ImageUrl: null
        );
        var putUri = new Uri($"/api/artists/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.PutAsJsonAsync(putUri, updateRequest);
    
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Multiple(
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
            () => Assert.Equal(ErrorMessages.ArtistNotFound, problemDetails.Detail)
        );
    }
    
    [Fact]
    public async Task DeleteArtist_WhenArtistExists_RemovesRecordAndReturns204NoContent()
    {
        // Arrange
        var newArtist = new CreateArtistRequest(
            Name: "The Eagles",
            Bio: null,
            ActiveFromYear: 1971,
            Country: "USA",
            ImageUrl: null
        );
        var postResponse = await HttpClient.PostAsJsonAsync("/api/artists", newArtist);
        var createdArtist = await postResponse.Content.ReadFromJsonAsync<ArtistResponse>();
        var uriWithId = new Uri($"/api/artists/{createdArtist!.Id}", UriKind.Relative);
    
        // Act
        var deleteResponse = await HttpClient.DeleteAsync(uriWithId);
    
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var getResponse = await HttpClient.GetAsync(uriWithId);
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
    
    [Fact]
    public async Task DeleteArtist_WhenArtistDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var deleteUri = new Uri($"/api/artists/{Guid.NewGuid()}", UriKind.Relative);
    
        // Act
        var response = await HttpClient.DeleteAsync(deleteUri);
    
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Multiple(
            () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
            () => Assert.Equal(ErrorMessages.ArtistNotFound, problemDetails.Detail)
        );
    }
    
    [Fact]
    public async Task PostArtist_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
    {
        // Arrange
        var invalidArtist = new CreateArtistRequest(
            Name: string.Empty,
            Bio: null,
            ActiveFromYear: 1700, // Invalid year (must be >= 1800)
            Country: null,
            ImageUrl: null
        );
    
        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/artists", invalidArtist);
    
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problemDetails);

        var expectedYearError = ValidationMessages.InvalidYear
            .Replace(
                "{From}", 
                Artist.MinActiveFromYear.ToString(CultureInfo.InvariantCulture), 
                StringComparison.Ordinal
            )
            .Replace(
                "{To}", 
                DateTime.UtcNow.Year.ToString(CultureInfo.InvariantCulture), 
                StringComparison.Ordinal
            );

        Assert.Multiple(
            () => Assert.Contains(ValidationMessages.NameRequired, problemDetails.Errors["Name"]),
            () => Assert.Contains(expectedYearError, problemDetails.Errors["ActiveFromYear"])
        );
    }

    [Fact]
    public async Task PutArtist_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
    {
        // Arrange
        var invalidArtist = new UpdateArtistRequest(
            Name: new string('X', Artist.MaxNameLength + 1),
            Bio: null,
            ActiveFromYear: null,
            Country: null,
            ImageUrl: null
        );
        var putUri = new Uri($"/api/artists/{Guid.NewGuid()}", UriKind.Relative); 
    
        // Act
        var response = await HttpClient.PutAsJsonAsync(putUri, invalidArtist);
    
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problemDetails);

        var expectedNameError = ValidationMessages.NameMaxLength
            .Replace(
                "{MaxLength}",
                Artist.MaxNameLength.ToString(CultureInfo.InvariantCulture),
                StringComparison.Ordinal    
            );

        Assert.Contains(expectedNameError, problemDetails.Errors["Name"]);
    }
}