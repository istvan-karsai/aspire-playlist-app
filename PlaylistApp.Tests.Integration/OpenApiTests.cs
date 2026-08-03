using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PlaylistApp.ApiService;
using PlaylistApp.ApiService.Data;

namespace PlaylistApp.Tests.Integration;

[Trait("Category", "Integration")]
public class OpenApiTests(WebApplicationFactory<ApiMarker> factory) : IClassFixture<WebApplicationFactory<ApiMarker>>
{
    [Fact]
    public async Task OpenApiDocument_IsGeneratedSuccessfully_AndReturns200OK()
    {
        // Arrange
        var client = factory.WithWebHostBuilder(builder =>
        {
            builder.UseSetting("ConnectionStrings:playlistdb", "Host=localhost;Database=dummy;Username=test;Password=test");

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.AddSingleton(sp => 
                    new DbContextOptionsBuilder<AppDbContext>()
                        .UseInMemoryDatabase("OpenApiTestingDb")
                        .Options
                );
            });
        }).CreateClient();
        var openApiUri = new Uri("/openapi/v1.json", UriKind.Relative);

        // Act
        var response = await client.GetAsync(openApiUri);
    
        // Assert
        Assert.Multiple(
            () => Assert.Equal(HttpStatusCode.OK, response.StatusCode),
            () => Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType)
        );
    }
}