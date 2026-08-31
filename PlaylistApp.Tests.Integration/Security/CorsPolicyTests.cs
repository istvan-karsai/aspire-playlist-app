using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PlaylistApp.ApiService;
using PlaylistApp.ApiService.Data;

namespace PlaylistApp.Tests.Integration.Security;

[Trait("Category", "Security")]
public class CorsPolicyTests(WebApplicationFactory<ApiMarker> factory) : IClassFixture<WebApplicationFactory<ApiMarker>>
{
    private readonly HttpClient _httpClient = factory.WithWebHostBuilder(builder =>
        {
            builder.UseSetting("ConnectionStrings:playlistdb", "Host=localhost;Database=dummy;Username=test;Password=test");

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<AppDbContext>>();

                services.AddSingleton(sp => 
                    new DbContextOptionsBuilder<AppDbContext>()
                        .UseInMemoryDatabase("ExceptionTestingDb")
                        .Options
                );
            });
        }).CreateClient();

    [Fact]
    public async Task CorsPolicy_WithAllowedOrigin_ReturnsAccessControlHeaders()
    {
        // Arrange
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/songs");
        request.Headers.Add("Origin", "http://localhost:5173");

        // Act
        var response = await _httpClient.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        Assert.Multiple(
            () => Assert.True(response.Headers.Contains("Access-Control-Allow-Origin")),
            () => Assert.Equal("http://localhost:5173", response.Headers.GetValues("Access-Control-Allow-Origin").First())
        );
    }

    [Fact]
    public async Task CorsPolicy_WithMaliciousOrigin_OmitsAccessControlHeaders()
    {
        // Arrange
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/songs");
        request.Headers.Add("Origin", "https://malicious-hacker.com");
    
        // Act
        var response = await _httpClient.SendAsync(request);
    
        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False(response.Headers.Contains("Access-Control-Allow-Origin"));
    }
}