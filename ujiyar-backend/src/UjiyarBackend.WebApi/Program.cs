using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Application.MoodLogs.Commands;
using UjiyarBackend.Domain.Repositories;
using UjiyarBackend.Infrastructure.Data;
using UjiyarBackend.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Add PostgreSQL Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Register Repositories (Infrastructure Layer)
builder.Services.AddScoped<IMoodLogRepository, MoodLogRepository>();

// 3. Register MediatR (Application Layer)
// We just need to point it to one of our Handlers so it scans the whole Application assembly
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssemblyContaining<CreateMoodLogCommandHandler>());

// 4. Standard API services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();