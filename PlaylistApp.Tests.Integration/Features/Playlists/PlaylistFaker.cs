using Bogus;
using PlaylistApp.ApiService.Features.Playlists;

namespace PlaylistApp.Tests.Integration.Features.Playlists;

internal static class PlaylistFaker
{
    internal static Faker<CreatePlaylistRequest> Create(IReadOnlyList<Guid>? songIds = null)
    {
        return new Faker<CreatePlaylistRequest>()
            .CustomInstantiator(fake => new CreatePlaylistRequest(
                Name: string.Join(" ", fake.Lorem.Words(2)),
                Description: fake.Lorem.Sentence(6).OrNull(fake, 0.2f),
                SongIds: songIds ?? []
            ));
    }

    internal static Faker<UpdatePlaylistRequest> Update(IReadOnlyList<Guid>? songIds = null)
    {
        return new Faker<UpdatePlaylistRequest>()
            .CustomInstantiator(fake => new UpdatePlaylistRequest(
                Name: string.Join(" ", fake.Lorem.Words(4)),
                Description: fake.Lorem.Paragraph(2).OrNull(fake, 0.2f),
                SongIds: songIds ?? []
            ));
    }
}