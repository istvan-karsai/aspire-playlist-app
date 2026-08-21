using FluentValidation;
using PlaylistApp.ApiService.Features.Artists.Constants;

namespace PlaylistApp.ApiService.Features.Artists;

public class UpdateArtistRequestValidator : AbstractValidator<UpdateArtistRequest>
{
    public UpdateArtistRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ArtistValidationMessages.NameRequired)
            .MaximumLength(Artist.MaxNameLength)
            .WithMessage(ArtistValidationMessages.NameMaxLength);

        RuleFor(x => x.Bio)
            .MaximumLength(Artist.MaxBioLength)
            .WithMessage(ArtistValidationMessages.BioMaxLength);

        RuleFor(x => x.Country)
            .MaximumLength(Artist.MaxCountryLength)
            .WithMessage(ArtistValidationMessages.CountryMaxLength);

        RuleFor(x => x.ImageUrl)
            .MaximumLength(Artist.MaxImageUrlLength)
            .WithMessage(ArtistValidationMessages.ImageUrlMaxLength);

        RuleFor(x => x.ActiveFromYear)
            .InclusiveBetween(Artist.MinActiveFromYear, DateTime.UtcNow.Year)
            .WithMessage(ArtistValidationMessages.InvalidYear)
            .When(x => x.ActiveFromYear.HasValue);
    }
}