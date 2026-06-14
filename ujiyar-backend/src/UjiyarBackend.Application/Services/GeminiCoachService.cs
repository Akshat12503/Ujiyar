using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using UjiyarBackend.Domain.Enums;

namespace UjiyarBackend.Application.Services;

public class GeminiCoachService : IGeminiCoachService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiCoachService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        // Use ?? string.Empty to satisfy the C# compiler and prevent null reference warnings
        _apiKey = configuration["GeminiApiKey"] ?? string.Empty;
    }

    public async Task<string> GenerateCoachingResponseAsync(int moodValue, string journalNote)
    {
        // 1. Safety check: If no API key is present, log it immediately
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            Console.WriteLine("Gemini API Error: GeminiApiKey is missing in appsettings.json");
            return "Configuration error: AI coach is not configured.";
        }

        try
        {
            var moodLabel = Enum.IsDefined(typeof(MoodScale), moodValue) 
                ? ((MoodScale)moodValue).ToString() 
                : "Neutral";

            var systemPrompt = $@"You are an empathetic, highly intelligent wellness coach. 
            The user is currently feeling '{moodLabel}'. 
            They wrote this in their private journal: '{journalNote}'. 
            Write a short, comforting, and insightful 2-3 sentence response validating their feelings and offering a gentle perspective. 
            Do not use robotic language. Be warm and human.";

            var payload = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = systemPrompt } } }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
            
            var response = await _httpClient.PostAsync(endpoint, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                // 2. This log will appear in your VS Code terminal when the API call fails
                Console.WriteLine($"Gemini API Error: {response.StatusCode} - {errorContent}");
                return "I'm having a little trouble connecting to my thought streams right now.";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var jsonDoc = JsonDocument.Parse(responseString);
            
            return jsonDoc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text").GetString() ?? "I hear you.";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Gemini Service Exception: {ex.Message}");
            return "An internal error occurred while consulting the coach.";
        }
    }
}