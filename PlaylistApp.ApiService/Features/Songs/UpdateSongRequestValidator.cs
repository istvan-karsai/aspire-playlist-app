using FluentValidation;
using PlaylistApp.ApiService.Features.Songs.Constants;

namespace PlaylistApp.ApiService.Features.Songs;

public class UpdateSongRequestValidator : AbstractValidator<UpdateSongRequest>
{
    public UpdateSongRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(SongValidationMessages.SongTitleRequired)
            .MaximumLength(Song.MaxTitleLength)
            .WithMessage(SongValidationMessages.SongTitleMaxLength);
        
        RuleFor(x => x.Duration)
            .Matches(FormatConstants.DurationRegex)
            .WithMessage(SongValidationMessages.InvalidDurationFormat)
            .NotEqual(FormatConstants.ZeroDuration)
            .WithMessage(SongValidationMessages.DurationGreaterThanZero);

        RuleFor(x => x.ArtistIds)
            .NotNull().WithMessage(SongValidationMessages.ArtistIdsRequired);
    }
}