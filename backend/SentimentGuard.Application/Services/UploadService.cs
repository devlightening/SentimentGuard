using SentimentGuard.Application.DTOs;
using SentimentGuard.Domain.Entities;
using SentimentGuard.Domain.Interfaces;

namespace SentimentGuard.Application.Services;

public class UploadService : IUploadService
{
    private readonly IAnalysisJobRepository _jobRepo;
    private readonly IWorkerTrigger _workerTrigger;
    private readonly string _uploadPath;

    public UploadService(IAnalysisJobRepository jobRepo, IWorkerTrigger workerTrigger, IFileStorageOptions options)
    {
        _jobRepo = jobRepo;
        _workerTrigger = workerTrigger;
        _uploadPath = options.UploadPath;
    }

    public async Task<JobDto> HandleUploadAsync(UploadRequest request)
    {
        var ext = Path.GetExtension(request.FileName).ToLowerInvariant();
        if (ext is not ".csv" and not ".json")
            throw new InvalidOperationException($"Unsupported file type '{ext}'. Upload .csv or .json.");

        Directory.CreateDirectory(_uploadPath);
        var storedFileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(_uploadPath, storedFileName);

        await using var dest = File.Create(fullPath);
        await request.FileStream.CopyToAsync(dest);

        var job = new AnalysisJob
        {
            Id = Guid.NewGuid().ToString(),
            FileName = request.FileName,
            FilePath = fullPath,
            CreatedAt = DateTime.UtcNow
        };

        await _jobRepo.CreateAsync(job);
        _ = _workerTrigger.TriggerAsync(job.Id, fullPath);

        return new JobDto
        {
            Id = job.Id,
            FileName = job.FileName,
            Status = job.Status.ToString(),
            CreatedAt = job.CreatedAt
        };
    }
}
