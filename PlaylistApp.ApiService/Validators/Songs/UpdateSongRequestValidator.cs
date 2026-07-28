using FluentValidation;
using PlaylistApp.ApiService.DTOs.Songs;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.ApiService.Validators.Songs;

public class UpdateSongRequestValidator : AbstractValidator<UpdateSongRequest>
{
    public UpdateSongRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(Song.MaxTitleLength)
            .WithMessage($"Title cannot exceed {Song.MaxTitleLength} characters.");

        RuleFor(x => x.Artist)
            .NotEmpty().WithMessage("Artist is required.")
            .MaximumLength(Song.MaxArtistLength)
            .WithMessage($"Artist cannot exceed {Song.MaxArtistLength} characters.");
        
        RuleFor(x => x.Duration)
            .GreaterThan(TimeSpan.Zero).WithMessage("Duration must be greater than zero.");
    }
}