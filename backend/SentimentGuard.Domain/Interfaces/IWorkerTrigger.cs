namespace SentimentGuard.Domain.Interfaces;

public interface IWorkerTrigger
{
    Task TriggerAsync(string jobId, string filePath);
}
