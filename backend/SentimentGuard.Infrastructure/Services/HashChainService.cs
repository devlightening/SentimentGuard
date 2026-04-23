using System.Security.Cryptography;
using System.Text;
using MongoDB.Driver;
using SentimentGuard.Domain.Interfaces;
using SentimentGuard.Infrastructure.Mongo;

namespace SentimentGuard.Infrastructure.Services;

public class HashChainService : IHashChainService
{
    private readonly MongoDbContext _context;

    public HashChainService(MongoDbContext context) => _context = context;

    public async Task<(bool IsValid, int? BrokenAtIndex)> VerifyChainAsync(string jobId)
    {
        var results = await _context.Results
            .Find(r => r.JobId == jobId)
            .SortBy(r => r.CreatedAt)
            .ToListAsync();

        if (results.Count == 0) return (true, null);

        string prevHash = "GENESIS";

        for (int i = 0; i < results.Count; i++)
        {
            var r = results[i];
            var canonical = BuildCanonical(r.JobId, r.MaskedUser, r.OriginalComment,
                r.Sentiment.ToString(), r.Category?.ToString() ?? "", r.Score);

            var expected = ComputeHash(canonical + "|" + prevHash);

            if (!string.Equals(expected, r.CurrentHash, StringComparison.OrdinalIgnoreCase))
                return (false, i);

            prevHash = r.CurrentHash;
        }

        return (true, null);
    }

    private static string BuildCanonical(string jobId, string maskedUser, string comment,
        string sentiment, string category, double score) =>
        $"jobId={jobId}|maskedUser={maskedUser}|comment={comment}|sentiment={sentiment}|category={category}|score={score:F4}";

    private static string ComputeHash(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
