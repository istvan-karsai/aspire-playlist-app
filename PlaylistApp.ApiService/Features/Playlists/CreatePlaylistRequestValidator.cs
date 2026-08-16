using FluentValidation;
using PlaylistApp.ApiService.Constants;

namespace PlaylistApp.ApiService.Features.Playlists;

public class CreatePlaylistRequestValidator : AbstractValidator<CreatePlaylistRequest>
{
    public CreatePlaylistRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessages.PlaylistNameRequired)
            .MaximumLength(Playlist.MaxNameLength)
            .WithMessage(ValidationMessages.PlaylistNameMaxLength);

        RuleFor(x => x.Description)
            .MaximumLength(Playlist.MaxDescriptionLength)
            .WithMessage(ValidationMessages.PlaylistDescriptionMaxLength);

        RuleFor(x => x.SongIds)
            .NotNull().WithMessage(ValidationMessages.SongIdsRequired);
    }
}