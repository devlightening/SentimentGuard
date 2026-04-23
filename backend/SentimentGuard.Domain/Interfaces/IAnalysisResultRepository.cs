using SentimentGuard.Domain.Entities;

namespace SentimentGuard.Domain.Interfaces;

public interface IAnalysisResultRepository
{
    Task<IEnumerable<AnalysisResult>> GetByJobIdAsync(string jobId);
    Task<AnalysisResult?> GetLastByJobIdAsync(string jobId);
    Task<IEnumerable<AnalysisResult>> GetTopCommentsByJobIdAsync(string jobId, int limit = 10);
    Task<AnalysisSummary> GetSummaryByJobIdAsync(string jobId);
}
