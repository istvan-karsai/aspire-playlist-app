using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PlaylistApp.ApiService.Features.Playlists;

internal sealed class PlaylistSongConfiguration : IEntityTypeConfiguration<PlaylistSong>
{
    public void Configure(EntityTypeBuilder<PlaylistSong> builder)
    {
        builder.ToTable("PlaylistSongs");

        // Composite Primary Key
        builder.HasKey(ps => new { ps.PlaylistId, ps.SongId });
    }
}