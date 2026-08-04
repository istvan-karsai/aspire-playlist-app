using Microsoft.Playwright;

namespace PlaylistApp.Tests.E2E;

[CollectionDefinition(nameof(AppHostCollection))]
public class AppHostCollection : ICollectionFixture<AppHostFixture>
{
    // This class has no code. It is used by xUnit to bind the fixture across multiple test classes.
}

[Collection(nameof(AppHostCollection))]
public class SmokeTests(AppHostFixture fixture) : IAsyncLifetime
{
    private IPlaywright _playwright = null!;
    private IBrowser _browser = null!;

    public async Task InitializeAsync()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true
        });
    }

    public async Task DisposeAsync()
    {
        await _browser.DisposeAsync();
        _playwright.Dispose();
    }

    [Fact]
    public async Task AppLoads_AndDisplaysHomePageTitle()
    {
        // Arrange
        var page = await _browser.NewPageAsync();
    
        // Act
        await page.GotoAsync(fixture.FrontendAddress);
    
        // Assert
        var pageTitle = await page.TitleAsync();
        Assert.Contains("István's Playlist Manager", pageTitle, StringComparison.Ordinal);
    }
}