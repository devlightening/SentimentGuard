using SentimentGuard.Domain.Entities;

namespace SentimentGuard.Domain.Interfaces;

public interface IHashChainService
{
    Task<(bool IsValid, int? BrokenAtIndex)> VerifyChainAsync(string jobId);
}
