using MediatR;
using Microsoft.AspNetCore.Mvc;
using UjiyarBackend.Application.MoodLogs.Commands;
using UjiyarBackend.Application.MoodLogs.Queries;

namespace UjiyarBackend.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")] // This makes the URL route: api/moodlogs
public class MoodLogsController : ControllerBase
{
    private readonly ISender _sender;

    public MoodLogsController(ISender sender)
    {
        _sender = sender;
    }

    // POST: api/moodlogs
    // Called when the Angular app wants to save a new reflection
    // POST: api/moodlogs
    [HttpPost]
    public async Task<IActionResult> CreateLog([FromBody] CreateMoodLogCommand command)
    {
        // result now contains both { Id, AiMessage }
        var result = await _sender.Send(command); 
        
        return Ok(result); // Send the entire package back to Angular
    }

    // GET: api/moodlogs/user123?days=7
    // Called when the Angular app wants to load recent history
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetRecentLogs(string userId, [FromQuery] int days = 7)
    {
        var query = new GetRecentMoodLogsQuery(userId, days);
        var logs = await _sender.Send(query);
        return Ok(logs);
    }
}