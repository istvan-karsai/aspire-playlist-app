using ApiService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ApiService.Data.Configurations;

internal class SongConfiguration : IEntityTypeConfiguration<Song>
{
    public void Configure(EntityTypeBuilder<Song> builder)
    {
        builder.ToTable("Songs");

        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Id)
               .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(s => s.Title)
               .HasMaxLength(200)
               .IsRequired();

        builder.Property(s => s.Artist)
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(s => s.Duration)
               .IsRequired();
    }
}