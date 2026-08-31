using System.Globalization;
using Bogus;
using PlaylistApp.ApiService.Features.Songs;
using PlaylistApp.ApiService.Features.Songs.Constants;

namespace PlaylistApp.Tests.Integration.Features.Songs;

internal static class SongFaker
{
    internal static Faker<CreateSongRequest> Create(IReadOnlyList<Guid>? artistIds = null)
    {
        return new Faker<CreateSongRequest>()
            .CustomInstantiator(fake => new CreateSongRequest(
                Title: string.Join(" ", fake.Lorem.Words(3)),
                Duration: TimeSpan.FromSeconds(fake.Random.Int(60, 600))
                    .ToString(FormatConstants.TimeSpanFormat, CultureInfo.InvariantCulture),
                ArtistIds: artistIds ?? []
            ));
    }

    internal static Faker<UpdateSongRequest> Update(IReadOnlyList<Guid>? artistIds = null)
    {
        return new Faker<UpdateSongRequest>()
            .CustomInstantiator(fake => new UpdateSongRequest(
                Title: string.Join(" ", fake.Lorem.Words(2)),
                Duration: TimeSpan.FromSeconds(fake.Random.Int(700, 1600))
                    .ToString(FormatConstants.TimeSpanFormat, CultureInfo.InvariantCulture),
                ArtistIds: artistIds ?? []
            ));
    }
}