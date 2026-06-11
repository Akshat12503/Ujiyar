using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Domain.Repositories;

namespace UjiyarBackend.Application.MoodLogs.Queries;

// 1. Define the input query metric options request payload contract
public record GetRecentMoodLogsQuery(string UserId, int DaysCount) : IRequest<IEnumerable<MoodLog>>;

// 2. Implement the clean read-only retrieval use case execution query handler
public class GetRecentMoodLogsQueryHandler : IRequestHandler<GetRecentMoodLogsQuery, IEnumerable<MoodLog>>
{
    private readonly IMoodLogRepository _repository;

    public GetRecentMoodLogsQueryHandler(IMoodLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MoodLog>> Handle(GetRecentMoodLogsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetRecentLogsAsync(request.UserId, request.DaysCount);
    }
}