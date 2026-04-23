using System.Net.Http.Json;
using SentimentGuard.Domain.Interfaces;

namespace SentimentGuard.Infrastructure.Services;

public class WorkerTrigger : IWorkerTrigger
{
    private readonly HttpClient _http;

    public WorkerTrigger(IHttpClientFactory factory) =>
        _http = factory.CreateClient("worker");

    public async Task TriggerAsync(string jobId, string filePath)
    {
        try
        {
            await _http.PostAsJsonAsync("/analyze", new { job_id = jobId, file_path = filePath });
        }
        catch
        {
            // Worker trigger is fire-and-forget; worker polls independently
        }
    }
}
