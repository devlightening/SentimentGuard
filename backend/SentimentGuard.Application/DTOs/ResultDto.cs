namespace SentimentGuard.Application.DTOs;

public class ResultDto
{
    public string Id { get; set; } = string.Empty;
    public string JobId { get; set; } = string.Empty;
    public string MaskedUser { get; set; } = string.Empty;
    public string OriginalComment { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public string? Category { get; set; }
    public double Score { get; set; }
    public string PrevHash { get; set; } = string.Empty;
    public string CurrentHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
