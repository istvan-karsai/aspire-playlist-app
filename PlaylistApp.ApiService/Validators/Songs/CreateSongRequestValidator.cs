using FluentValidation;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.DTOs.Songs;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.ApiService.Validators.Songs;

public class CreateSongRequestValidator : AbstractValidator<CreateSongRequest>
{
    public CreateSongRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.SongTitleRequired)
            .MaximumLength(Song.MaxTitleLength)
            .WithMessage(ValidationMessages.SongTitleMaxLength);
        
        RuleFor(x => x.Duration)
            .GreaterThan(TimeSpan.Zero).WithMessage(ValidationMessages.DurationGreaterThanZero);
        
        RuleFor(x => x.ArtistIds)
            .NotNull().WithMessage(ValidationMessages.ArtistIdsRequired);
    }
}