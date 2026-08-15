using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PlaylistApp.ApiService.Features.Artists;

internal sealed class ArtistConfiguration : IEntityTypeConfiguration<Artist>
{
    public void Configure(EntityTypeBuilder<Artist> builder)
    {
        builder.ToTable("Artists");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
               .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(a => a.Name)
               .HasMaxLength(Artist.MaxNameLength)
               .IsRequired();
        
        builder.Property(a => a.Bio)
               .HasMaxLength(Artist.MaxBioLength);

        builder.Property(a => a.Country)
               .HasMaxLength(Artist.MaxCountryLength);

        builder.Property(a => a.ImageUrl)
               .HasMaxLength(Artist.MaxImageUrlLength);
    }
}