using Microsoft.EntityFrameworkCore;
using UjiyarBackend.Application.MoodLogs.Commands;
using UjiyarBackend.Domain.Repositories;
using UjiyarBackend.Infrastructure.Data;
using UjiyarBackend.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- NEW CORS CONFIGURATION ---
// This tells the backend to trust requests coming from your Angular app
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

// --- NEW CORS MIDDLEWARE ---
// MUST be placed before UseAuthorization and MapControllers!
app.UseCors("AllowAngularDevClient");
// ---------------------------

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();