using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;

namespace UjiyarBackend.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<MoodLog> MoodLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<MoodLog>().HasKey(m => m.Id);
    }
}