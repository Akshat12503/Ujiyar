using System;
using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;

namespace UjiyarBackend.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<MoodLog> MoodLogs { get; set; }
    public DbSet<User> Users { get; set; } 
    
    // Add our new Chat tables
    public DbSet<ChatRoom> ChatRooms { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<MoodLog>().HasKey(m => m.Id);
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique(); 

        // Define primary keys for Chat tables
        modelBuilder.Entity<ChatRoom>().HasKey(r => r.Id);
        modelBuilder.Entity<ChatMessage>().HasKey(m => m.Id);

        // --- FEATURE 2: Seed the "Safe Rooms" ---
        // We use hardcoded GUIDs and a static Date so EF Core doesn't think the model is changing!
        var staticDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<ChatRoom>().HasData(
            new ChatRoom 
            { 
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), 
                Name = "venting-space", 
                Description = "No advice allowed, just listening.",
                CreatedAt = staticDate // <-- Hardcoded!
            },
            new ChatRoom 
            { 
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), 
                Name = "wins-of-the-day", 
                Description = "Positivity and celebration.",
                CreatedAt = staticDate // <-- Hardcoded!
            },
            new ChatRoom 
            { 
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), 
                Name = "anxiety-support", 
                Description = "Coping mechanisms and grounding.",
                CreatedAt = staticDate // <-- Hardcoded!
            }
        );
    }
}