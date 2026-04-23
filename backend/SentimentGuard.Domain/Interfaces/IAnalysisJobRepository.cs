using SentimentGuard.Domain.Entities;

namespace SentimentGuard.Domain.Interfaces;

public interface IAnalysisJobRepository
{
    Task<AnalysisJob> CreateAsync(AnalysisJob job);
    Task<AnalysisJob?> GetByIdAsync(string id);
    Task<IEnumerable<AnalysisJob>> GetAllAsync();
    Task UpdateAsync(AnalysisJob job);
}
