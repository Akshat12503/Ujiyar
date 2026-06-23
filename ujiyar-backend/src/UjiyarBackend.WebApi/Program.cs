using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Application.MoodLogs.Commands;
using UjiyarBackend.Domain.Repositories;
using UjiyarBackend.Infrastructure.Data;
using UjiyarBackend.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- ADDED THIS LINE ---
// Forces the backend to listen on Port 5000 to match Angular
builder.WebHost.UseUrls("http://localhost:5000");
// -----------------------

// --- CORS CONFIGURATION ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient",
        b => b.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader());
});
// ------------------------------

// 1. Add PostgreSQL Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Register Repositories (Infrastructure Layer)
builder.Services.AddScoped<IMoodLogRepository, MoodLogRepository>();

// 3. Register MediatR (Application Layer)
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssemblyContaining<CreateMoodLogCommandHandler>());

// 4. Standard API services
builder.Services.AddHttpClient<UjiyarBackend.Application.Services.IGeminiCoachService, UjiyarBackend.Application.Services.GeminiCoachService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- CORS MIDDLEWARE ---
app.UseCors("AllowAngularDevClient");
// ---------------------------

app.UseAuthorization();
app.MapControllers();
app.MapHub<UjiyarBackend.WebApi.Hubs.ChatHub>("/chatHub");

app.Run();