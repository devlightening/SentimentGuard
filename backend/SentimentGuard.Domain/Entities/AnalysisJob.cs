using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SentimentGuard.Domain.Enums;

namespace SentimentGuard.Domain.Entities;

public class AnalysisJob
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public string Id { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    [BsonRepresentation(BsonType.String)]
    public JobStatus Status { get; set; } = JobStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TotalRecords { get; set; }
    public int ProcessedRecords { get; set; }
    public string? ErrorMessage { get; set; }
}
