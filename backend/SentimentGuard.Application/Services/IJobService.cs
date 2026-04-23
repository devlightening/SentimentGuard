using SentimentGuard.Application.DTOs;

namespace SentimentGuard.Application.Services;

public interface IJobService
{
    Task<IEnumerable<JobDto>> GetAllJobsAsync();
    Task<JobDto?> GetJobByIdAsync(string id);
    Task<SummaryDto?> GetSummaryAsync(string jobId);
    Task<IEnumerable<ResultDto>> GetResultsAsync(string jobId);
    Task<IEnumerable<ResultDto>> GetTopCommentsAsync(string jobId);
    Task<ChainVerificationDto> VerifyChainAsync(string jobId);
    Task<byte[]> GetReportAsync(string jobId);
}
