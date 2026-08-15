using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PlaylistApp.ApiService.Features.Playlists;

internal sealed class PlaylistConfiguration : IEntityTypeConfiguration<Playlist>
{
    public void Configure(EntityTypeBuilder<Playlist> builder)
    {
        builder.ToTable("Playlists");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
               .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(p => p.Name)
               .HasMaxLength(Playlist.MaxNameLength)
               .IsRequired();

        builder.Property(p => p.Description)
               .HasMaxLength(Playlist.MaxDescriptionLength);

        builder.Property(p => p.CreatedAt)
               .IsRequired();

        // Skip Navigation Mapping
        builder.HasMany(p => p.Songs)
               .WithMany(s => s.Playlists)
               .UsingEntity<PlaylistSong>();
    }
}