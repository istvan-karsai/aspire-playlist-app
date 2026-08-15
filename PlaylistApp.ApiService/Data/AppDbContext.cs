using Microsoft.EntityFrameworkCore;
using PlaylistApp.ApiService.Features.Songs;
using PlaylistApp.ApiService.Features.Artists;

namespace PlaylistApp.ApiService.Data;

internal sealed class AppDbContext : DbContext
{
    public DbSet<Song> Songs => Set<Song>();
    public DbSet<Artist> Artists => Set<Artist>();
    public DbSet<SongArtist> SongArtists => Set<SongArtist>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}