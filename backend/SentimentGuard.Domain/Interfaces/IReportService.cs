namespace SentimentGuard.Domain.Interfaces;

public interface IReportService
{
    Task<byte[]> GeneratePdfReportAsync(string jobId);
}
