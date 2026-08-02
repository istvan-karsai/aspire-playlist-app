using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PlaylistApp.ApiService.Entities;

namespace PlaylistApp.ApiService.Data.Configurations;

internal sealed class SongArtistConfiguration : IEntityTypeConfiguration<SongArtist>
{
    public void Configure(EntityTypeBuilder<SongArtist> builder)
    {
        builder.ToTable("SongArtists");

        // Composite Primary Key
        builder.HasKey(sa => new { sa.SongId, sa.ArtistId });
    }
}