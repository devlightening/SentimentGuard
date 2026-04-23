using SentimentGuard.Application.DTOs;
using SentimentGuard.Domain.Interfaces;

namespace SentimentGuard.Application.Services;

public class JobService : IJobService
{
    private readonly IAnalysisJobRepository _jobRepo;
    private readonly IAnalysisResultRepository _resultRepo;
    private readonly IHashChainService _hashChain;
    private readonly IReportService _reportService;
    private readonly IUserContext _userContext;

    public JobService(
        IAnalysisJobRepository jobRepo,
        IAnalysisResultRepository resultRepo,
        IHashChainService hashChain,
        IReportService reportService,
        IUserContext userContext)
    {
        _jobRepo = jobRepo;
        _resultRepo = resultRepo;
        _hashChain = hashChain;
        _reportService = reportService;
        _userContext = userContext;
    }

    public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
    {
        var jobs = await _jobRepo.GetAllAsync();
        var userId = _userContext.UserId;
        jobs = jobs.Where(j => string.IsNullOrWhiteSpace(j.UserId) ? userId == "demo" : j.UserId == userId);
        return jobs.Select(MapToDto);
    }

    public async Task<JobDto?> GetJobByIdAsync(string id)
    {
        var job = await _jobRepo.GetByIdAsync(id);
        if (job is null) return null;
        var userId = _userContext.UserId;
        var owner = string.IsNullOrWhiteSpace(job.UserId) ? "demo" : job.UserId;
        if (!string.Equals(owner, userId, StringComparison.OrdinalIgnoreCase))
            return null;
        return MapToDto(job);
    }

    public async Task<SummaryDto?> GetSummaryAsync(string jobId)
    {
        var job = await RequireOwnedJob(jobId);

        var summary = await _resultRepo.GetSummaryByJobIdAsync(jobId);
        return new SummaryDto
        {
            JobId = summary.JobId,
            TotalRecords = summary.TotalRecords,
            PositiveCount = summary.PositiveCount,
            NegativeCount = summary.NegativeCount,
            NeutralCount = summary.NeutralCount,
            ComplaintCount = summary.ComplaintCount,
            PraiseCount = summary.PraiseCount,
            QuestionCount = summary.QuestionCount,
            DisappointmentCount = summary.DisappointmentCount,
            FinalHash = summary.FinalHash,
            ChainValid = summary.ChainValid
        };
    }

    public async Task<IEnumerable<ResultDto>> GetResultsAsync(string jobId)
    {
        _ = await RequireOwnedJob(jobId);
        var results = await _resultRepo.GetByJobIdAsync(jobId);
        return results.Select(MapResultToDto);
    }

    public async Task<IEnumerable<ResultDto>> GetTopCommentsAsync(string jobId)
    {
        _ = await RequireOwnedJob(jobId);
        var results = await _resultRepo.GetTopCommentsByJobIdAsync(jobId);
        return results.Select(MapResultToDto);
    }

    public async Task<ChainVerificationDto> VerifyChainAsync(string jobId)
    {
        _ = await RequireOwnedJob(jobId);
        var (isValid, brokenAt) = await _hashChain.VerifyChainAsync(jobId);
        return new ChainVerificationDto
        {
            JobId = jobId,
            IsValid = isValid,
            BrokenAtIndex = brokenAt,
            Message = isValid ? "Chain is intact." : $"Chain broken at record index {brokenAt}."
        };
    }

    public async Task<byte[]> GetReportAsync(string jobId) =>
        await _reportService.GeneratePdfReportAsync((await RequireOwnedJob(jobId)).Id);

    private async Task<Domain.Entities.AnalysisJob> RequireOwnedJob(string jobId)
    {
        var job = await _jobRepo.GetByIdAsync(jobId);
        if (job is null)
            throw new InvalidOperationException("Job not found.");

        var userId = _userContext.UserId;
        var owner = string.IsNullOrWhiteSpace(job.UserId) ? "demo" : job.UserId;
        if (!string.Equals(owner, userId, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Job not found.");

        return job;
    }

    private static JobDto MapToDto(Domain.Entities.AnalysisJob job) => new()
    {
        Id = job.Id,
        FileName = job.FileName,
        Status = job.Status.ToString(),
        CreatedAt = job.CreatedAt,
        StartedAt = job.StartedAt,
        CompletedAt = job.CompletedAt,
        TotalRecords = job.TotalRecords,
        ProcessedRecords = job.ProcessedRecords,
        ErrorMessage = job.ErrorMessage
    };

    private static ResultDto MapResultToDto(Domain.Entities.AnalysisResult r) => new()
    {
        Id = r.Id,
        JobId = r.JobId,
        MaskedUser = r.MaskedUser,
        OriginalComment = r.OriginalComment,
        Sentiment = r.Sentiment.ToString(),
        Category = r.Category?.ToString(),
        Score = r.Score,
        PrevHash = r.PrevHash,
        CurrentHash = r.CurrentHash,
        CreatedAt = r.CreatedAt
    };
}
