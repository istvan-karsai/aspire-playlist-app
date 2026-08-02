using PlaylistApp.ApiService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PlaylistApp.ApiService.Data.Configurations;

internal sealed class SongConfiguration : IEntityTypeConfiguration<Song>
{
    public void Configure(EntityTypeBuilder<Song> builder)
    {
        builder.ToTable("Songs");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
               .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(s => s.Title)
               .HasMaxLength(Song.MaxTitleLength)
               .IsRequired();

        builder.Property(s => s.Duration)
               .IsRequired();

        // Skip Navigation Mapping
        builder.HasMany(s => s.Artists)
               .WithMany(a => a.Songs)
               .UsingEntity<SongArtist>();
    }
}