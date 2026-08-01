using FluentValidation;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.DTOs.Songs;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.ApiService.Validators.Songs;

public class UpdateSongRequestValidator : AbstractValidator<UpdateSongRequest>
{
    public UpdateSongRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.TitleRequired)
            .MaximumLength(Song.MaxTitleLength)
            .WithMessage(ValidationMessages.TitleMaxLength);

        RuleFor(x => x.Artist)
            .NotEmpty().WithMessage(ValidationMessages.ArtistRequired)
            .MaximumLength(Song.MaxArtistLength)
            .WithMessage(ValidationMessages.ArtistMaxLength);
        
        RuleFor(x => x.Duration)
            .GreaterThan(TimeSpan.Zero).WithMessage(ValidationMessages.DurationGreaterThanZero);
    }
}