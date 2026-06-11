using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Domain.Enums;
using UjiyarBackend.Domain.Repositories;

namespace UjiyarBackend.Application.MoodLogs.Commands;

// 1. Define the input parameter request signature payload data contract
public record CreateMoodLogCommand(int MoodValue, string JournalNote, string UserId) : IRequest<Guid>;

// 2. Implement the independent use case processor logic execution handler
public class CreateMoodLogCommandHandler : IRequestHandler<CreateMoodLogCommand, Guid>
{
    private readonly IMoodLogRepository _repository;

    public CreateMoodLogCommandHandler(IMoodLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateMoodLogCommand request, CancellationToken cancellationToken)
    {
        // Explicit data transformation validation safety rule casting
        var scaleValue = (MoodScale)request.MoodValue;

        // Instantiate our domain entity object using the secure parameter constructor
        var moodLog = new MoodLog(scaleValue, request.JournalNote, request.UserId);

        // Execute persistence save calls abstracted behind our domain contract
        await _repository.AddAsync(moodLog);

        return moodLog.Id;
    }
}