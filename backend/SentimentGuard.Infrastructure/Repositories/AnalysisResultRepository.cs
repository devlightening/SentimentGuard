using MongoDB.Driver;
using SentimentGuard.Domain.Entities;
using SentimentGuard.Domain.Enums;
using SentimentGuard.Domain.Interfaces;
using SentimentGuard.Infrastructure.Mongo;

namespace SentimentGuard.Infrastructure.Repositories;

public class AnalysisResultRepository : IAnalysisResultRepository
{
    private readonly IMongoCollection<AnalysisResult> _collection;

    public AnalysisResultRepository(MongoDbContext context) =>
        _collection = context.Results;

    public async Task<IEnumerable<AnalysisResult>> GetByJobIdAsync(string jobId) =>
        await _collection.Find(r => r.JobId == jobId).SortBy(r => r.CreatedAt).ToListAsync();

    public async Task<AnalysisResult?> GetLastByJobIdAsync(string jobId) =>
        await _collection.Find(r => r.JobId == jobId).SortByDescending(r => r.CreatedAt).FirstOrDefaultAsync();

    public async Task<IEnumerable<AnalysisResult>> GetTopCommentsByJobIdAsync(string jobId, int limit = 10)
    {
        var results = await _collection.Find(r => r.JobId == jobId).ToListAsync();
        return results
            .GroupBy(r => r.OriginalComment.Trim().ToLower())
            .OrderByDescending(g => g.Count())
            .Take(limit)
            .Select(g => g.First());
    }

    public async Task<AnalysisSummary> GetSummaryByJobIdAsync(string jobId)
    {
        var results = await _collection.Find(r => r.JobId == jobId).ToListAsync();
        var last = results.LastOrDefault();

        return new AnalysisSummary
        {
            JobId = jobId,
            TotalRecords = results.Count,
            PositiveCount = results.Count(r => r.Sentiment == SentimentLabel.Positive),
            NegativeCount = results.Count(r => r.Sentiment == SentimentLabel.Negative),
            NeutralCount = results.Count(r => r.Sentiment == SentimentLabel.Neutral),
            ComplaintCount = results.Count(r => r.Category == CategoryLabel.Complaint),
            PraiseCount = results.Count(r => r.Category == CategoryLabel.Praise),
            QuestionCount = results.Count(r => r.Category == CategoryLabel.Question),
            DisappointmentCount = results.Count(r => r.Category == CategoryLabel.Disappointment),
            FinalHash = last?.CurrentHash ?? string.Empty,
            ChainValid = false
        };
    }
}
