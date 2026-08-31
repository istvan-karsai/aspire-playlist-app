using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Features.Artists;
using PlaylistApp.ApiService.Features.Playlists;
using PlaylistApp.ApiService.Features.Playlists.Constants;
using PlaylistApp.ApiService.Features.Songs;

namespace PlaylistApp.Tests.Integration.Features.Playlists;

public static class PlaylistEndpointsTests
{
    private static async Task<Guid> CreateTestSongAsync(HttpClient httpClient)
    {
        var artistRequest = new CreateArtistRequest("Test Artist", null, null, null, null);
        var artistResponse = await httpClient.PostAsJsonAsync("/api/artists", artistRequest);
        var artist = await artistResponse.Content.ReadFromJsonAsync<ArtistResponse>();

        var songRequest = new CreateSongRequest("Test Song", "00:03:00", [artist!.Id]);
        var songResponse = await httpClient.PostAsJsonAsync("/api/songs", songRequest);
        var song = await songResponse.Content.ReadFromJsonAsync<SongResponse>();

        return song!.Id;
    }

    public class GetTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task GetPlaylists_ReturnsOk_AndEmptyListInitially()
        {
            // Arrange
            var getUri = new Uri("/api/playlists", UriKind.Relative);
        
            // Act
            var response = await HttpClient.GetAsync(getUri);
            var playlists = await response.Content.ReadFromJsonAsync<List<PlaylistResponse>>();
        
            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.NotNull(playlists);
            Assert.Empty(playlists);
        }

        [Fact]
        public async Task GetById_WhenPlaylistExists_ReturnsOkAndPlaylist()
        {
            // Arrange
            var songId = await CreateTestSongAsync(HttpClient);
            var newPlaylist = new CreatePlaylistRequest("Workout Mix", null, [songId]);
            var postResponse = await HttpClient.PostAsJsonAsync("/api/playlists", newPlaylist);
            var createdPlaylist = await postResponse.Content.ReadFromJsonAsync<PlaylistResponse>();
            var uriWithId = new Uri($"/api/playlists/{createdPlaylist!.Id}", UriKind.Relative);
        
            // Act
            var getResponse = await HttpClient.GetAsync(uriWithId);
        
            // Assert
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

            var fetchedPlaylist = await getResponse.Content.ReadFromJsonAsync<PlaylistResponse>();
            Assert.NotNull(fetchedPlaylist);
            Assert.Multiple(
                () => Assert.Equal("Workout Mix", fetchedPlaylist.Name),
                () => Assert.Single(fetchedPlaylist.Songs)
            );
        }

        [Fact]
        public async Task GetById_WhenPlaylistDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var getByIdUri = new Uri($"/api/playlists/{Guid.NewGuid()}", UriKind.Relative);
        
            // Act
            var response = await HttpClient.GetAsync(getByIdUri);
        
            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

            Assert.NotNull(problemDetails);
            Assert.Multiple(
                () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
                () => Assert.Equal(PlaylistErrorMessages.PlaylistNotFound, problemDetails.Detail)
            );
        }
    }

    public class PostTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task PostPlaylist_WithSongIds_CreatesRecordAndLinksSongs()
        {
            // Arrange
            var songId = await CreateTestSongAsync(HttpClient);
            var newPlaylist = new CreatePlaylistRequest("My Favorites", "Best tracks", [songId]);
        
            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/playlists", newPlaylist);
        
            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var createdPlaylist = await response.Content.ReadFromJsonAsync<PlaylistResponse>();
            Assert.NotNull(createdPlaylist);
            Assert.Multiple(
                () => Assert.Equal(newPlaylist.Name, createdPlaylist.Name),
                () => Assert.Equal(newPlaylist.Description, createdPlaylist.Description),
                () => Assert.NotEqual(Guid.Empty, createdPlaylist.Id),
                () => Assert.Single(createdPlaylist.Songs),
                () => Assert.Equal(songId, createdPlaylist.Songs[0].Id)
            );
        }

        [Fact]
        public async Task PostPlaylist_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
        {
            // Arrange
            var invalidPlaylist = new CreatePlaylistRequest("", null, null!);
        
            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/playlists", invalidPlaylist);
        
            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

            Assert.NotNull(problemDetails);

            Assert.Multiple(
                () => Assert.Contains(PlaylistValidationMessages.PlaylistNameRequired, problemDetails.Errors["Name"]),
                () => Assert.Contains(PlaylistValidationMessages.SongIdsRequired, problemDetails.Errors["SongIds"])
            );
        }
    }

    public class PutTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task PutPlaylist_WhenPlaylistExists_UpdatesRecordAndReturnsNoContent()
        {
            // Arrange
            var songId1 = await CreateTestSongAsync(HttpClient);
            var songId2 = await CreateTestSongAsync(HttpClient);

            var initialPlaylist = new CreatePlaylistRequest("Relaxed", null, [songId1]);
            var postResponse = await HttpClient.PostAsJsonAsync("/api/playlists", initialPlaylist);
            var createdPlaylist = await postResponse.Content.ReadFromJsonAsync<PlaylistResponse>();

            var updateRequest = new UpdatePlaylistRequest("Super Relaxed", "Updated description", [songId2]);
            var uriWithId = new Uri($"/api/playlists/{createdPlaylist!.Id}", UriKind.Relative);
        
            // Act
            var putResponse = await HttpClient.PutAsJsonAsync(uriWithId, updateRequest);
        
            // Assert
            Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

            var getResponse = await HttpClient.GetAsync(uriWithId);
            var fetchedPlaylist = await getResponse.Content.ReadFromJsonAsync<PlaylistResponse>();
            Assert.NotNull(fetchedPlaylist);
            Assert.Multiple(
                () => Assert.Equal("Super Relaxed", fetchedPlaylist.Name),
                () => Assert.Equal("Updated description", fetchedPlaylist.Description),
                () => Assert.Single(fetchedPlaylist.Songs),
                () => Assert.Equal(songId2, fetchedPlaylist.Songs[0].Id)
            );
        }

        [Fact]
        public async Task PutPlaylist_WhenPlaylistDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var updateRequest = new UpdatePlaylistRequest("Ghost Playlist", null, []);
            var putUri = new Uri($"/api/playlists/{Guid.NewGuid()}", UriKind.Relative);
        
            // Act
            var response = await HttpClient.PutAsJsonAsync(putUri, updateRequest);
        
            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

            Assert.NotNull(problemDetails);
            Assert.Multiple(
                () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
                () => Assert.Equal(PlaylistErrorMessages.PlaylistNotFound, problemDetails.Detail)
            );
        }

        [Fact]
        public async Task PutPlaylist_WhenDataIsInvalid_ReturnsBadRequestAndValidationErrors()
        {
            // Arrange
            var invalidPlaylist = new CreatePlaylistRequest(
                Name: new string('X', Playlist.MaxNameLength + 1),
                Description: new string('A', Playlist.MaxDescriptionLength + 1),
                SongIds: []
            );
            var uri = new Uri($"/api/playlists/{Guid.NewGuid()}", UriKind.Relative);
        
            // Act
            var response = await HttpClient.PutAsJsonAsync(uri, invalidPlaylist);
        
            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

            Assert.NotNull(problemDetails);

            var expectedNameError = PlaylistValidationMessages.PlaylistNameMaxLength
                .Replace(
                    "{MaxLength}",
                    Playlist.MaxNameLength.ToString(CultureInfo.InvariantCulture),
                    StringComparison.Ordinal
                );
            
            var expectedDescriptionError = PlaylistValidationMessages.PlaylistDescriptionMaxLength
                .Replace(
                    "{MaxLength}",
                    Playlist.MaxDescriptionLength.ToString(CultureInfo.InvariantCulture),
                    StringComparison.Ordinal
                );

            Assert.Multiple(
                () => Assert.Contains(expectedNameError, problemDetails.Errors["Name"]),
                () => Assert.Contains(expectedDescriptionError, problemDetails.Errors["Description"])
            );       
        }
    }

    public class DeleteTests(AppHostFixture fixture) : BaseIntegrationTest(fixture)
    {
        [Fact]
        public async Task DeletePlaylist_WhenPlaylistExists_RemovesRecordAndReturnsNoContent()
        {
            // Arrange
            var newPlaylist = new CreatePlaylistRequest("To Be Deleted", null, []);
            var postResponse = await HttpClient.PostAsJsonAsync("/api/playlists", newPlaylist);
            var createdPlaylist = await postResponse.Content.ReadFromJsonAsync<PlaylistResponse>();
            var uriWithId = new Uri($"/api/playlists/{createdPlaylist!.Id}", UriKind.Relative);

            // Act
            var deleteResponse = await HttpClient.DeleteAsync(uriWithId);
        
            // Assert
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            var getResponse = await HttpClient.GetAsync(uriWithId);
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }

        [Fact]
        public async Task DeletePlaylist_WhenPlaylistDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var deleteUri = new Uri($"/api/playlists/{Guid.NewGuid()}", UriKind.Relative);
        
            // Act
            var response = await HttpClient.DeleteAsync(deleteUri);
        
            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();

            Assert.NotNull(problemDetails);
            Assert.Multiple(
                () => Assert.Equal(ErrorTitles.NotFound, problemDetails.Title),
                () => Assert.Equal(PlaylistErrorMessages.PlaylistNotFound, problemDetails.Detail)
            );
        }
    }
}