using System;
using UjiyarBackend.Domain.Enums;

namespace UjiyarBackend.Domain.Entities;

public class MoodLog
{
    // Unique identifier tracking entry node entities
    public Guid Id { get; set; }

    // Strongly-typed representation scaling current user state rules
    public MoodScale Value { get; set; }

    // User-submitted reflective textual note string parameter
    public string JournalNote { get; set; } = string.Empty;

    // Temporal tracking marker detailing record log submissions
    public DateTime CreatedAt { get; set; }

    // Optional workspace flag parameter if we decide to assign logs to users later
    public string UserId { get; set; } = "Default_User";

    // Clean Parameterless Constructor matching modern ORM serialization patterns
    public MoodLog()
    {
    }

    // Explicit domain initialization helper routine constructor
    public MoodLog(MoodScale value, string journalNote, string userId = "Default_User")
    {
        Id = Guid.NewGuid();
        Value = value;
        JournalNote = journalNote;
        CreatedAt = DateTime.UtcNow; // Enforcing UTC best-practices for relational backends
        UserId = userId;
    }
}