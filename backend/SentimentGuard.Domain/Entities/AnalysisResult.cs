using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SentimentGuard.Domain.Enums;

namespace SentimentGuard.Domain.Entities;

public class AnalysisResult
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public string Id { get; set; } = string.Empty;
    public string JobId { get; set; } = string.Empty;
    public string MaskedUser { get; set; } = string.Empty;
    public string OriginalComment { get; set; } = string.Empty;
    [BsonRepresentation(BsonType.String)]
    public SentimentLabel Sentiment { get; set; }
    [BsonRepresentation(BsonType.String)]
    public CategoryLabel? Category { get; set; }
    public double Score { get; set; }
    public string PrevHash { get; set; } = string.Empty;
    public string CurrentHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
