using System;

namespace UjiyarBackend.Domain.Entities;

public class ChatMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Which room is this in?
    public Guid RoomId { get; set; }
    
    // Who sent it?
    public Guid UserId { get; set; }
    
    public string Content { get; set; } = string.Empty;

    // --- FEATURE 1: Ghost Mode ---
    public bool IsAnonymous { get; set; } = false;

    // --- FEATURE 3 & 4: AI Moderation ---
    public bool IsFlagged { get; set; } = false; 
    public string FlagReason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties to connect the tables
    public ChatRoom Room { get; set; } = null!;
    public User User { get; set; } = null!;
}