using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using SentimentGuard.Domain.Entities;

namespace SentimentGuard.Infrastructure.Mongo;

public class MongoDbContext
{
    private readonly IMongoDatabase _db;

    static MongoDbContext()
    {
        var pack = new ConventionPack
        {
            new CamelCaseElementNameConvention(),
            new IgnoreExtraElementsConvention(true),
            new EnumRepresentationConvention(BsonType.String)
        };
        ConventionRegistry.Register("SentimentGuardConventions", pack, _ => true);
    }

    public MongoDbContext(IOptions<MongoSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _db = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<AnalysisJob> Jobs => _db.GetCollection<AnalysisJob>("analysis_jobs");
    public IMongoCollection<AnalysisResult> Results => _db.GetCollection<AnalysisResult>("analysis_results");
}
