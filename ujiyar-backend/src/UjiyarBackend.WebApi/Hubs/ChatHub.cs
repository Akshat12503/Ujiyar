using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Infrastructure.Data;

namespace UjiyarBackend.WebApi.Hubs;

public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;

    public ChatHub(ApplicationDbContext context)
    {
        _context = context;
    }

    // This allows a user to join a specific safe-room channel
    public async Task JoinRoom(string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }

    // This handles receiving a message, saving it, and broadcasting it live
    public async Task SendMessage(string roomId, string userId, string content, bool isAnonymous)
    {
        var roomGuid = Guid.Parse(roomId);
        var userGuid = Guid.Parse(userId);

        // Fetch the user's real name from the database
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);
        string displayName = user?.DisplayName ?? "Unknown User";

        // --- PREPARATION FOR AI MODERATION (Phase 3) ---
        // Right now, we let messages pass through automatically. 
        // We will wire our Gemini AI here next to flag illegal/harmful content!
        bool isFlagged = false;
        string flagReason = string.Empty;
        // -----------------------------------------------

        // Create the message object
        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            RoomId = roomGuid,
            UserId = userGuid,
            Content = content,
            IsAnonymous = isAnonymous,
            IsFlagged = isFlagged,
            FlagReason = flagReason,
            CreatedAt = DateTime.UtcNow
        };

        // Save it to PostgreSQL so it's permanent
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();

        // If the AI flags it, we don't broadcast it to the room!
        if (isFlagged)
        {
            // Privately notify the sender that their message violated safety guidelines
            await Clients.Caller.SendAsync("ReceiveSystemMessage", "Your message was blocked by AI moderation for safety guidelines.");
            return;
        }

        // --- FEATURE 1: Ghost Mode (Anonymity) ---
        // If the user checked "Ghost Mode", hide their real identity from the room
        string senderName = isAnonymous ? "Anonymous Member" : displayName;

        // Broadcast the live message to everyone currently in this room
        await Clients.Group(roomId).SendAsync("ReceiveMessage", new
        {
            id = message.Id,
            roomId = message.RoomId,
            sender = senderName,
            content = message.Content,
            isAnonymous = message.IsAnonymous,
            createdAt = message.CreatedAt
        });
    }
}