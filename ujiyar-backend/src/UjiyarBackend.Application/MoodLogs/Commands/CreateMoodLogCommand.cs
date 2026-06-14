using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Domain.Enums;
using UjiyarBackend.Domain.Repositories;
using UjiyarBackend.Application.Services; // <-- Importing the AI Service

namespace UjiyarBackend.Application.MoodLogs.Commands;

// 1. The new payload we send BACK to Angular
public record CreateMoodLogResponse(Guid Id, string AiMessage);

// 2. Update the Command to expect our new Response object
public record CreateMoodLogCommand(int MoodValue, string JournalNote, string UserId) : IRequest<CreateMoodLogResponse>;

public class CreateMoodLogCommandHandler : IRequestHandler<CreateMoodLogCommand, CreateMoodLogResponse>
{
    private readonly IMoodLogRepository _repository;
    private readonly IGeminiCoachService _aiService; // <-- The Brain

    public CreateMoodLogCommandHandler(IMoodLogRepository repository, IGeminiCoachService aiService)
    {
        _repository = repository;
        _aiService = aiService;
    }

    public async Task<CreateMoodLogResponse> Handle(CreateMoodLogCommand request, CancellationToken cancellationToken)
    {
        // 1. Save to PostgreSQL
        var scaleValue = (MoodScale)request.MoodValue;
        var moodLog = new MoodLog(scaleValue, request.JournalNote, request.UserId);
        await _repository.AddAsync(moodLog);

        // 2. Fetch the dynamic empathy response from Gemini API!
        var aiMessage = await _aiService.GenerateCoachingResponseAsync(request.MoodValue, request.JournalNote);

        // 3. Package both the DB Id and the AI's words together
        return new CreateMoodLogResponse(moodLog.Id, aiMessage);
    }
}