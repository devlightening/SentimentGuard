using SentimentGuard.Domain.Interfaces;

namespace SentimentGuard.Infrastructure.Services;

public class FileStorageOptions : IFileStorageOptions
{
    public string UploadPath { get; set; } = "/app/uploads";
}
