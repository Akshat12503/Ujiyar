using System.Threading.Tasks;

namespace UjiyarBackend.Application.Services;

public interface IGeminiCoachService
{
    Task<string> GenerateCoachingResponseAsync(int moodValue, string journalNote);
}