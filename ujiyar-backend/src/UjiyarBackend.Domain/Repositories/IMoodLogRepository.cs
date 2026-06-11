using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UjiyarBackend.Domain.Entities;

namespace UjiyarBackend.Domain.Repositories;

public interface IMoodLogRepository
{
    // Fetches an explicit log record matching a unique Guid node signature asynchronously
    Task<MoodLog?> GetByIdAsync(Guid id);

    // Retrieves the complete set of historical logs mapped to a specific user account node
    Task<IEnumerable<MoodLog>> GetByUserIdAsync(string userId);

    // Grabs logs within a specific timeframe (perfect for our 3-day, 7-day, 1-month charts!)
    Task<IEnumerable<MoodLog>> GetRecentLogsAsync(string userId, int daysCount);

    // Persists a newly composed reflection log payload into our system context asynchronously
    Task AddAsync(MoodLog moodLog);

    // Removes a specific historical entry from the data store safely
    Task DeleteAsync(MoodLog moodLog);
}