using FluentValidation;
using PlaylistApp.ApiService.Constants;

namespace PlaylistApp.ApiService.Features.Songs;

public class UpdateSongRequestValidator : AbstractValidator<UpdateSongRequest>
{
    public UpdateSongRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.SongTitleRequired)
            .MaximumLength(Song.MaxTitleLength)
            .WithMessage(ValidationMessages.SongTitleMaxLength);
        
        RuleFor(x => x.Duration)
            .Matches(FormatConstants.DurationRegex)
            .WithMessage(ValidationMessages.InvalidDurationFormat)
            .NotEqual(FormatConstants.ZeroDuration)
            .WithMessage(ValidationMessages.DurationGreaterThanZero);

        RuleFor(x => x.ArtistIds)
            .NotNull().WithMessage(ValidationMessages.ArtistIdsRequired);
    }
}