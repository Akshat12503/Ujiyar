using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;

namespace UjiyarBackend.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<MoodLog> MoodLogs { get; set; }
    
    // Add the new Users table
    public DbSet<User> Users { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<MoodLog>().HasKey(m => m.Id);
        
        // Explicitly define the primary key for the User entity
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        
        // Optional: Ensure emails are unique at the database level
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique(); 
    }
}