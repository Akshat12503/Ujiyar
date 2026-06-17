using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Domain.Entities;
using UjiyarBackend.Infrastructure.Data;

namespace UjiyarBackend.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")] // This automatically becomes "api/auth"
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // 1. Check if the email is already in use
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Email is already registered." });
        }

        // 2. Create the new user
        var newUser = new User
        {
            DisplayName = request.DisplayName,
            Email = request.Email,
            // NOTE: For MVP testing, we are storing this as plain text. 
            // In a production app, we would hash this using BCrypt!
            PasswordHash = request.Password 
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // 3. Return the user (without the password!) to Angular
        return Ok(new { 
            id = newUser.Id, 
            displayName = newUser.DisplayName, 
            email = newUser.Email 
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // 1. Find the user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        // 2. Check if user exists and password matches
        if (user == null || user.PasswordHash != request.Password)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        // 3. Success! Return the user data to Angular
        return Ok(new { 
            id = user.Id, 
            displayName = user.DisplayName, 
            email = user.Email 
        });
    }
}

// --- Data Transfer Objects (DTOs) to catch the incoming JSON ---
public class RegisterRequest
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}