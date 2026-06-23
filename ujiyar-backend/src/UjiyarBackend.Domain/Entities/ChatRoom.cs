using System;
using System.Collections.Generic;

namespace UjiyarBackend.Domain.Entities;

public class ChatRoom
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty; // e.g., "venting-space"
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property - A room has many messages
    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
}