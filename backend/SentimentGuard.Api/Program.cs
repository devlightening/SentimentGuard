using SentimentGuard.Application.Services;
using SentimentGuard.Domain.Interfaces;
using SentimentGuard.Infrastructure.Mongo;
using SentimentGuard.Infrastructure.Repositories;
using SentimentGuard.Infrastructure.Services;
using SentimentGuard.Api.Security;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("Mongo"));
builder.Services.Configure<FileStorageOptions>(builder.Configuration.GetSection("FileStorage"));
builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddScoped<IAnalysisJobRepository, AnalysisJobRepository>();
builder.Services.AddScoped<IAnalysisResultRepository, AnalysisResultRepository>();
builder.Services.AddScoped<IHashChainService, HashChainService>();
builder.Services.AddScoped<IReportService, PdfReportService>();
builder.Services.AddScoped<IUserContext, HeaderUserContext>();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddTransient<IWorkerTrigger, WorkerTrigger>();
builder.Services.AddTransient<IFileStorageOptions>(sp =>
    sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<FileStorageOptions>>().Value);

var workerUrl = builder.Configuration["WorkerUrl"] ?? "http://worker:8000";
builder.Services.AddHttpClient("worker", c => c.BaseAddress = new Uri(workerUrl));

builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "SentimentGuard API", Version = "v1" }));

builder.Services.AddCors(opts =>
    opts.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.MapControllers();
app.Run();
