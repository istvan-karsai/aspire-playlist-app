using System.Globalization;
using Bogus;
using Microsoft.Playwright;
using PlaylistApp.Tests.E2E.Constants;

namespace PlaylistApp.Tests.E2E.UserFlows;

[Trait("Category", "E2E")]
[Collection(nameof(AppHostCollection))]
public class CoreMvpFlowTests(AppHostFixture fixture) : IAsyncLifetime
{
    private IPlaywright _playwright = null!;
    private IBrowser _browser = null!;
    private IBrowserContext _context = null!;

    private readonly Faker _faker = new();

    // Assume failure until the test completes successfully
    private bool _testFailed = true;

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
        if (_testFailed)
        {
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss", CultureInfo.InvariantCulture);
            var shortGuid = Guid.NewGuid().ToString("N")[..8];
            var tracePath = $"playwright-traces/trace-mvp_{timestamp}_{shortGuid}.zip";
            await _context.Tracing.StopAsync(new TracingStopOptions { Path = tracePath });
        }
        else
        {
            await _context.Tracing.StopAsync();
        }

        await _context.DisposeAsync();
        await _browser.DisposeAsync();
        _playwright.Dispose();
    }

    [Fact]
    public async Task UserCanCompleteFullMVPFlow_CreateArtist_Song_AndPlaylist()
    {
        // Arrange
        var page = await _context.NewPageAsync();

        var testArtistName = _faker.Name.FullName();
        var testSongTitle = string.Join(" ", _faker.Lorem.Words(2));
        var testPlaylistName = $"{_faker.Commerce.ProductAdjective()} Mix";

        await page.GotoAsync(fixture.FrontendAddress);
    
        // Act & Assert

        // 1. Create Artist
        await page.GetByTestId(TestConstants.TestIds.NavArtistsLink).ClickAsync();
        await page.GetByRole(AriaRole.Button, new() { Name = TestConstants.Buttons.AddArtist }).ClickAsync();
        await page.GetByLabel(TestConstants.FormLabels.Name).FillAsync(testArtistName);
        await page.GetByTestId(TestConstants.TestIds.SubmitButton).ClickAsync();

        // Give Postgres and EF Core up to 15 seconds to cold-start and migrate
        await Assertions.Expect(page.GetByText(testArtistName)).ToBeVisibleAsync(new() { Timeout = 15_000 });

        // 2. Create Song
        await page.GetByTestId(TestConstants.TestIds.NavSongsLink).ClickAsync();
        await page.GetByRole(AriaRole.Button, new() { Name = TestConstants.Buttons.AddSong }).ClickAsync();
        await page.GetByLabel(TestConstants.FormLabels.Title).FillAsync(testSongTitle);
        await page.GetByLabel(TestConstants.FormLabels.Duration).FillAsync(TestConstants.MockData.Duration);

        await page.GetByRole(AriaRole.Checkbox, new() { Name = testArtistName, Exact = true }).ClickAsync();
        await page.GetByTestId(TestConstants.TestIds.SubmitButton).ClickAsync();

        await Assertions.Expect(page.GetByText(testSongTitle)).ToBeVisibleAsync();

        // 3. Create Playlist
        await page.GetByTestId(TestConstants.TestIds.NavPlaylistsLink).ClickAsync();

        await page.GetByRole(AriaRole.Button, new() { Name = TestConstants.Buttons.AddPlaylist }).ClickAsync();

        await page.GetByLabel(TestConstants.FormLabels.Name).FillAsync(testPlaylistName);
        await page.GetByLabel(TestConstants.FormLabels.Description).FillAsync(TestConstants.MockData.Description);

        var songCheckbox = page.Locator("label")
                               .Filter(new() { HasText = testSongTitle })
                               .Locator("input[type='checkbox']");
        await songCheckbox.ClickAsync();

        await page.GetByTestId(TestConstants.TestIds.SubmitButton).ClickAsync();

        // 4. Verify Playlist appears in the table and navigate to its details
        var playlistLink = page.GetByRole(AriaRole.Link, new() { Name = testPlaylistName, Exact = true });
        await Assertions.Expect(playlistLink).ToBeVisibleAsync();
        await playlistLink.ClickAsync();

        // 5. Verify Playlist Details and Tracks
        await Assertions.Expect(page.GetByRole(AriaRole.Heading, new() { Name = testPlaylistName, Exact = true })).ToBeVisibleAsync();

        var trackLink = page.GetByRole(AriaRole.Link, new() { Name = testSongTitle, Exact = true });
        await Assertions.Expect(trackLink).ToBeVisibleAsync();

        // If execution reaches this line without throwing an assertion exception, the test passed
        _testFailed = false;
    }
}