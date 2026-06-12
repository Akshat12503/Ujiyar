using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Domain.Repositories;
using UjiyarBackend.Infrastructure.Data;

namespace UjiyarBackend.Infrastructure.Repositories;

public class MoodLogRepository : IMoodLogRepository
{
    private readonly ApplicationDbContext _context;

    public MoodLogRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MoodLog?> GetByIdAsync(Guid id) => 
        await _context.MoodLogs.FindAsync(id);

    public async Task<IEnumerable<MoodLog>> GetByUserIdAsync(string userId) => 
        await _context.MoodLogs.Where(m => m.UserId == userId).ToListAsync();

    public async Task<IEnumerable<MoodLog>> GetRecentLogsAsync(string userId, int daysCount)
    {
        var threshold = DateTime.UtcNow.AddDays(-daysCount);
        return await _context.MoodLogs
            .Where(m => m.UserId == userId && m.CreatedAt >= threshold)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(MoodLog moodLog)
    {
        await _context.MoodLogs.AddAsync(moodLog);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(MoodLog moodLog)
    {
        _context.MoodLogs.Remove(moodLog);
        await _context.SaveChangesAsync();
    }
}