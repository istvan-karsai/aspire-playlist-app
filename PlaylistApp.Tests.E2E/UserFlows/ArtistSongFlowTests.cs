using Microsoft.Playwright;

namespace PlaylistApp.Tests.E2E.UserFlows;

[Trait("Category", "E2E")]
[Collection(nameof(AppHostCollection))]
public class ArtistSongFlowTests(AppHostFixture fixture) : IAsyncLifetime
{
    private IPlaywright _playwright = null!;
    private IBrowser _browser = null!;
    private IBrowserContext _context = null!;

    public async Task InitializeAsync()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true
        });

        _context = await _browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 }
        });

        await _context.Tracing.StartAsync(new TracingStartOptions
        {
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    public async Task DisposeAsync()
    {
        await _context.Tracing.StopAsync(new TracingStopOptions
        {
            Path = "playwright-trace.zip"
        });

        await _context.DisposeAsync();
        await _browser.DisposeAsync();
        _playwright.Dispose();
    }

    [Fact]
    public async Task UserCanCreateArtist_AndAssociateNewSong_AndViewDiscography()
    {
        // Arrange
        var page = await _context.NewPageAsync();
        
        var uniqueId = Guid.NewGuid().ToString("N")[..8];
        var testArtistName = $"Test Artist {uniqueId}";
        var testSongTitle = $"Test Song {uniqueId}";
        var testDuration = "03:30:00"; 
        
        await page.GotoAsync(fixture.FrontendAddress);

        // Act & Assert

        // 1. Go to Artists Page and Create Artist
        await page.GetByTestId("nav-artists-link").ClickAsync();
        await page.GetByLabel("Name").FillAsync(testArtistName);
        await page.GetByTestId("submit-button").ClickAsync();
        
        // INCREASED TIMEOUT: Give Postgres and EF Core up to 15 seconds to cold-start and migrate
        await Assertions.Expect(page.GetByText(testArtistName)).ToBeVisibleAsync(new() { Timeout = 15000 });

        // 2. Go to Songs Page and Create Song
        await page.GetByTestId("nav-songs-link").ClickAsync();
        await page.GetByLabel("Title").FillAsync(testSongTitle);
        await page.GetByLabel("Duration").FillAsync(testDuration); 
        
        await page.GetByRole(AriaRole.Checkbox, new() { Name = testArtistName, Exact = true }).ClickAsync();
        
        await page.GetByTestId("submit-button").ClickAsync();

        await Assertions.Expect(page.GetByText(testSongTitle)).ToBeVisibleAsync();

        // 3. Navigate to Artist Details via the Song List link
        await page.GetByRole(AriaRole.Link, new() { Name = testArtistName, Exact = true }).ClickAsync();

        // 4. Verify Artist Details and Discography
        await Assertions.Expect(page.GetByRole(AriaRole.Heading, new() { Name = testArtistName, Exact = true })).ToBeVisibleAsync();
        await Assertions.Expect(page.GetByText(testSongTitle, new() { Exact = true })).ToBeVisibleAsync();
    }
}