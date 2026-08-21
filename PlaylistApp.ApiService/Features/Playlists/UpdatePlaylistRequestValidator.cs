using FluentValidation;
using PlaylistApp.ApiService.Constants;
using PlaylistApp.ApiService.Features.Playlists.Constants;

namespace PlaylistApp.ApiService.Features.Playlists;

public class UpdatePlaylistRequestValidator : AbstractValidator<UpdatePlaylistRequest>
{
    public UpdatePlaylistRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(PlaylistValidationMessages.PlaylistNameRequired)
            .MaximumLength(Playlist.MaxNameLength)
            .WithMessage(PlaylistValidationMessages.PlaylistNameMaxLength);

        RuleFor(x => x.Description)
            .MaximumLength(Playlist.MaxDescriptionLength)
            .WithMessage(PlaylistValidationMessages.PlaylistDescriptionMaxLength);

        RuleFor(x => x.SongIds)
            .NotNull().WithMessage(PlaylistValidationMessages.SongIdsRequired);
    }
}