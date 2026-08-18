namespace PlaylistApp.Tests.Integration;

[CollectionDefinition(nameof(AppHostCollection))]
public class AppHostCollection : ICollectionFixture<AppHostFixture>
{
    // This class has no code. Its only purpose is to apply the [CollectionDefinition]
    // attribute so xUnit knows to share the AppHostFixture across multiple test classes.
}