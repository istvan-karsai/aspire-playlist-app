using ApiService.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiService.Data;

internal class AppDbContext : DbContext
{
    public DbSet<Song> Songs => Set<Song>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}