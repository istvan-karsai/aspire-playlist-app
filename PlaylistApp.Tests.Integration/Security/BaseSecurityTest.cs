using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PlaylistApp.ApiService;
using PlaylistApp.ApiService.Data;

namespace PlaylistApp.Tests.Integration.Security;

public abstract class BaseSecurityTest : IClassFixture<WebApplicationFactory<ApiMarker>>
{
    protected HttpClient HttpClient { get; }

    protected BaseSecurityTest(WebApplicationFactory<ApiMarker> factory)
    {
        HttpClient = factory.WithWebHostBuilder(builder =>
        {
            builder.UseSetting("ConnectionStrings:playlistdb", "Host=localhost;Database=dummy;Username=test;Password=test");

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<AppDbContext>>();

                services.AddSingleton(sp => 
                    new DbContextOptionsBuilder<AppDbContext>()
                        .UseInMemoryDatabase("SecurityTestingDb")
                        .Options
                );
            });
        }).CreateClient();
    }
}