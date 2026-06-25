using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Infrastructure.Data;
using UjiyarBackend.Application.Services; // Ensure this points to where your IGeminiCoachService lives

namespace UjiyarBackend.WebApi.Hubs;

public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;
    private readonly IGeminiCoachService _geminiService;

    // We inject both the Database and the Gemini Service
    public ChatHub(ApplicationDbContext context, IGeminiCoachService geminiService)
    {
        _context = context;
        _geminiService = geminiService;
    }

    public async Task JoinRoom(string roomId)
    {
        // 1. Add the user to the live broadcast group
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

        var roomGuid = Guid.Parse(roomId);

        // 2. Reach into PostgreSQL and grab the historical messages for this room
        var history = await _context.ChatMessages
            .Include(m => m.User) // Bring in the user data so we know who sent it
            .Where(m => m.RoomId == roomGuid)
            .OrderBy(m => m.CreatedAt) // Sort oldest to newest
            .Select(m => new 
            {
                id = m.Id,
                roomId = m.RoomId,
                userId = m.UserId,
                sender = m.IsAnonymous ? "Anonymous Member" : m.User.DisplayName,
                content = m.Content,
                isAnonymous = m.IsAnonymous,
                createdAt = m.CreatedAt
            })
            .ToListAsync();

        // 3. Send the history ONLY to the specific user who just joined the room
        await Clients.Caller.SendAsync("LoadHistory", history);
    }

    public async Task SendMessage(string roomId, string userId, string content, bool isAnonymous)
    {
        var roomGuid = Guid.Parse(roomId);
        var userGuid = Guid.Parse(userId);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);
        string displayName = user?.DisplayName ?? "Unknown User";

        // --- FEATURE 3 & 4: AI MODERATION PIPELINE ---
        bool isFlagged = false;
        string flagReason = string.Empty;

        // 1. Craft a strict prompt for the AI to act as a bouncer
        string aiPrompt = $@"
            You are an automated safety moderator for a mental wellness application. 
            Analyze this message: '{content}'. 
            If the message contains explicit self-harm threats, severe bullying, or illegal activity, respond EXACTLY with 'FLAGGED: [Brief Reason]'. 
            If the message is safe, positive, or just venting about daily struggles, respond EXACTLY with 'SAFE'.";

        try 
        {
            // NOTE: Check your IGeminiCoachService! 
            
            string aiEvaluation = await _geminiService.GenerateModerationResponseAsync(aiPrompt); 

            if (aiEvaluation.Trim().StartsWith("FLAGGED:"))
            {
                isFlagged = true;
                flagReason = aiEvaluation.Replace("FLAGGED:", "").Trim();
            }
        }
        catch (Exception ex)
        {
            // If the AI fails (e.g., rate limits), we log it. 
            // For now, we will let the message through so the chat doesn't break, 
            // but in production, you might want to default to 'true' to be perfectly safe.
            Console.WriteLine($"AI Moderation Error: {ex.Message}");
        }
        // ---------------------------------------------

        // 2. Create the message object
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

        // 3. Save it to PostgreSQL
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();

        // 4. THE BOUNCER DECISION
        if (isFlagged)
        {
            // If flagged, DO NOT broadcast. Instead, send a private SOS/Warning to the sender only.
            await Clients.Caller.SendAsync("ReceiveSystemMessage", 
                $"Your message was blocked for safety guidelines ({flagReason}). If you are in crisis, please reach out to our Therapist Finder or a national hotline.");
            return; 
        }

        // 5. Broadcast to everyone in the room!
        string senderName = isAnonymous ? "Anonymous Member" : displayName;

        await Clients.Group(roomId).SendAsync("ReceiveMessage", new
        {
            id = message.Id,
            roomId = message.RoomId,
            userId = message.UserId,
            sender = senderName,
            content = message.Content,
            isAnonymous = message.IsAnonymous,
            createdAt = message.CreatedAt
        });
    }
}