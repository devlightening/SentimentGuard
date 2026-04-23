namespace SentimentGuard.Application.DTOs;

public class ChainVerificationDto
{
    public string JobId { get; set; } = string.Empty;
    public bool IsValid { get; set; }
    public int? BrokenAtIndex { get; set; }
    public string Message { get; set; } = string.Empty;
}
