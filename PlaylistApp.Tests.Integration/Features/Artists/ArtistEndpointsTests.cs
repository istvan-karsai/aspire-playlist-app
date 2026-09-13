using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Features.Artists;
using PlaylistApp.ApiService.Features.Artists.Constants;

namespace PlaylistApp.Tests.Integration.Features.Artists;

public static class ArtistEndpointsTests
{
    public class GetTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
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
        public async Task GetById_WhenArtistExists_ReturnsOkAndArtist()
        {
            // Arrange
            var newArtist = ArtistFaker.Create().Generate();
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
                () => Assert.Equal(ArtistErrorMessages.ArtistNotFound, problemDetails.Detail)
            );
        }
    }

    public class PostTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task PostArtist_CreatesRecord_AndReturns201Created()
        {
            // Arrange
            var newArtist = ArtistFaker.Create().Generate();
        
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

            var expectedYearError = ArtistValidationMessages.InvalidYear
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
                () => Assert.Contains(ArtistValidationMessages.NameRequired, problemDetails.Errors["Name"]),
                () => Assert.Contains(expectedYearError, problemDetails.Errors["ActiveFromYear"])
            );
        }

        [Fact]
        public async Task PostArtist_WithPaddedStrings_TrimsStrings()
        {
            // Arrange
            var expectedName = "The Sanitize Band";
            var expectedBio = "Example bio text";
            var expectedCountry = "Hungary";
            var expectedImageUrl = "https://example.com/image.jpg";

            var request = new CreateArtistRequest(
                Name: "   The Sanitize Band   ",
                Bio: "   Example bio text   ",
                ActiveFromYear: 2010,
                Country: "   Hungary   ",
                ImageUrl: "   https://example.com/image.jpg   "
            );

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/artists", request);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var createdArtist = await response.Content.ReadFromJsonAsync<ArtistResponse>();
            
            Assert.NotNull(createdArtist);
            Assert.Multiple(
                () => Assert.Equal(expectedName, createdArtist.Name),
                () => Assert.Equal(expectedBio, createdArtist.Bio),
                () => Assert.Equal(expectedCountry, createdArtist.Country),
                () => Assert.Equal(expectedImageUrl, createdArtist.ImageUrl)
            );
        }
    }

    public class PutTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task PutArtist_WhenArtistExists_UpdatesRecordAndReturnsNoContent()
        {
            // Arrange
            var initialArtist = ArtistFaker.Create().Generate();
            var postResponse = await HttpClient.PostAsJsonAsync("/api/artists", initialArtist);
            var createdArtist = await postResponse.Content.ReadFromJsonAsync<ArtistResponse>();

            var updateRequest = ArtistFaker.Update().Generate();
            var uriWithId = new Uri($"/api/artists/{createdArtist!.Id}", UriKind.Relative);
        
            // Act
            var putResponse = await HttpClient.PutAsJsonAsync(uriWithId, updateRequest);
        
            // Assert
            Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

            var getResponse = await HttpClient.GetAsync(uriWithId);
            var fetchedArtist = await getResponse.Content.ReadFromJsonAsync<ArtistResponse>();

            Assert.NotNull(fetchedArtist);
            Assert.Multiple(
                () => Assert.Equal(updateRequest.Bio, fetchedArtist.Bio),
                () => Assert.Equal(updateRequest.ActiveFromYear, fetchedArtist.ActiveFromYear)
            );
        }

        [Fact]
        public async Task PutArtist_WhenArtistDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var updateRequest = ArtistFaker.Update().Generate();
            var putUri = new Uri($"/api/artists/{Guid.NewGuid()}", UriKind.Relative);
        
            // Act
            var response = await HttpClient.PutAsJsonAsync(putUri, updateRequest);
        
            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(problemDetails);
            Assert.Multiple(
                () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
                () => Assert.Equal(ArtistErrorMessages.ArtistNotFound, problemDetails.Detail)
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

            var expectedNameError = ArtistValidationMessages.NameMaxLength
                .Replace(
                    "{MaxLength}",
                    Artist.MaxNameLength.ToString(CultureInfo.InvariantCulture),
                    StringComparison.Ordinal    
                );

            Assert.Contains(expectedNameError, problemDetails.Errors["Name"]);
        }

        [Fact]
        public async Task PutArtist_WithPaddedStrings_TrimsStrings()
        {
            // Arrange
            var createArtistRequest = ArtistFaker.Create().Generate();
            var postResponse = await HttpClient.PostAsJsonAsync("/api/artists", createArtistRequest);
            var createdArtist = await postResponse.Content.ReadFromJsonAsync<ArtistResponse>();

            var expectedUpdatedName = "Updated Sanitize Band";
            var expectedUpdatedBio = "Trimmed Updated Bio";
            var expectedUpdatedCountry = "UK";
            var expectedUpdatedImageUrl = "https://example.com/new.jpg";

            var request = new UpdateArtistRequest(
                Name: "   Updated Sanitize Band   ",
                Bio: "   Trimmed Updated Bio   ",
                ActiveFromYear: 2012,
                Country: "   UK   ",
                ImageUrl: "   https://example.com/new.jpg   "
            );

            var uriWithId = new Uri($"/api/artists/{createdArtist!.Id}", UriKind.Relative);

            // Act
            var putResponse = await HttpClient.PutAsJsonAsync(uriWithId, request);
            var getResponse = await HttpClient.GetAsync(uriWithId);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);
            
            var updatedArtist = await getResponse.Content.ReadFromJsonAsync<ArtistResponse>();
            Assert.NotNull(updatedArtist);
            Assert.Multiple(
                () => Assert.Equal(expectedUpdatedName, updatedArtist.Name),
                () => Assert.Equal(expectedUpdatedBio, updatedArtist.Bio),
                () => Assert.Equal(expectedUpdatedCountry, updatedArtist.Country),
                () => Assert.Equal(expectedUpdatedImageUrl, updatedArtist.ImageUrl)
            );
        }
    }

    public class DeleteTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task DeleteArtist_WhenArtistExists_RemovesRecordAndReturns204NoContent()
        {
            // Arrange
            var newArtist = ArtistFaker.Create().Generate();
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
                () => Assert.Equal(ArtistErrorMessages.ArtistNotFound, problemDetails.Detail)
            );
        }
    }
}