using Bogus;
using PlaylistApp.ApiService.Features.Artists;

namespace PlaylistApp.Tests.Integration.Features.Artists;

internal static class ArtistFaker
{
    internal static Faker<CreateArtistRequest> Create()
    {
        return new Faker<CreateArtistRequest>()
            .CustomInstantiator(fake => new CreateArtistRequest(
                Name: fake.Company.CompanyName(), // Band/group name
                Bio: fake.Lorem.Sentence().OrNull(fake, 0.2f),
                ActiveFromYear: fake.Random.Int(1950, 1999).OrNull(fake, 0.2f),
                Country: fake.Address.Country().OrNull(fake, 0.2f),
                ImageUrl: fake.Image.PlaceImgUrl().OrNull(fake, 0.2f)
            ));
    }
    
    internal static Faker<UpdateArtistRequest> Update()
    {
        return new Faker<UpdateArtistRequest>()
            .CustomInstantiator(fake => new UpdateArtistRequest(
                Name: fake.Name.FullName(), // Shifts to a solo artist name to guarantee mutation
                Bio: fake.Lorem.Sentence(10).OrNull(fake, 0.2f),
                ActiveFromYear: fake.Random.Int(2000, DateTime.UtcNow.Year).OrNull(fake, 0.2f),
                Country: fake.Address.Country().OrNull(fake, 0.2f),
                ImageUrl: fake.Image.PicsumUrl().OrNull(fake, 0.2f)
            ));
    }
}