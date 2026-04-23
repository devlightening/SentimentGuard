namespace SentimentGuard.Application.DTOs;

public class UploadRequest
{
    public Stream FileStream { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
}
