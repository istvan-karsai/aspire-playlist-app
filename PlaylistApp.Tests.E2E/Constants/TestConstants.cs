namespace PlaylistApp.Tests.E2E.Constants;

internal static class TestConstants
{
    public static class FormLabels
    {
        public const string Name = "Name *";
        public const string Title = "Title *";
        public const string Duration = "Duration *";
        public const string Description = "Description";
    }

    public static class Buttons
    {
        public const string AddArtist = "Add New Artist";
        public const string AddSong = "Add New Song";
        public const string AddPlaylist = "Add New Playlist";
    }

    public static class TestIds
    {
        public const string NavArtistsLink = "nav-artists-link";
        public const string NavSongsLink = "nav-songs-link";
        public const string NavPlaylistsLink = "nav-playlists-link";
        public const string SubmitButton = "submit-button";
    }

    public static class MockData
    {
        public const string Duration = "03:30:00";
        public const string Description = "E2E Test Description";
    }
}