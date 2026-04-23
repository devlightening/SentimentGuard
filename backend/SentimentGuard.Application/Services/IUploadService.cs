using SentimentGuard.Application.DTOs;

namespace SentimentGuard.Application.Services;

public interface IUploadService
{
    Task<JobDto> HandleUploadAsync(UploadRequest request);
}
