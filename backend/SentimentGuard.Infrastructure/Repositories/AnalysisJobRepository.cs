using MongoDB.Driver;
using SentimentGuard.Domain.Entities;
using SentimentGuard.Domain.Interfaces;
using SentimentGuard.Infrastructure.Mongo;

namespace SentimentGuard.Infrastructure.Repositories;

public class AnalysisJobRepository : IAnalysisJobRepository
{
    private readonly IMongoCollection<AnalysisJob> _collection;

    public AnalysisJobRepository(MongoDbContext context) =>
        _collection = context.Jobs;

    public async Task<AnalysisJob> CreateAsync(AnalysisJob job)
    {
        await _collection.InsertOneAsync(job);
        return job;
    }

    public async Task<AnalysisJob?> GetByIdAsync(string id) =>
        await _collection.Find(j => j.Id == id).FirstOrDefaultAsync();

    public async Task<IEnumerable<AnalysisJob>> GetAllAsync() =>
        await _collection.Find(_ => true).SortByDescending(j => j.CreatedAt).ToListAsync();

    public async Task UpdateAsync(AnalysisJob job)
    {
        var filter = Builders<AnalysisJob>.Filter.Eq(j => j.Id, job.Id);
        await _collection.ReplaceOneAsync(filter, job);
    }
}
