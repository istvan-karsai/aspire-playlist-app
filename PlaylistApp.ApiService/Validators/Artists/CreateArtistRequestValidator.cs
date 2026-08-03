using FluentValidation;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.DTOs.Artists;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.ApiService.Validators.Artists;

public class CreateArtistRequestValidator : AbstractValidator<CreateArtistRequest>
{
    public CreateArtistRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessages.NameRequired)
            .MaximumLength(Artist.MaxNameLength)
            .WithMessage(ValidationMessages.NameMaxLength);

        RuleFor(x => x.Bio)
            .MaximumLength(Artist.MaxBioLength)
            .WithMessage(ValidationMessages.BioMaxLength);

        RuleFor(x => x.Country)
            .MaximumLength(Artist.MaxCountryLength)
            .WithMessage(ValidationMessages.CountryMaxLength);

        RuleFor(x => x.ImageUrl)
            .MaximumLength(Artist.MaxImageUrlLength)
            .WithMessage(ValidationMessages.ImageUrlMaxLength);

        RuleFor(x => x.ActiveFromYear)
            .InclusiveBetween(Artist.MinActiveFromYear, DateTime.UtcNow.Year)
            .WithMessage(ValidationMessages.InvalidYear)
            .When(x => x.ActiveFromYear.HasValue);
    }
}