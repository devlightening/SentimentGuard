using Microsoft.AspNetCore.Mvc;
using SentimentGuard.Application.Services;

namespace SentimentGuard.Api.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService) => _jobService = jobService;

    [HttpGet]
    public async Task<IActionResult> GetJobs() =>
        Ok(await _jobService.GetAllJobsAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(string id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        return job is null ? NotFound() : Ok(job);
    }

    [HttpGet("{id}/summary")]
    public async Task<IActionResult> GetSummary(string id)
    {
        var summary = await _jobService.GetSummaryAsync(id);
        return summary is null ? NotFound() : Ok(summary);
    }

    [HttpGet("{id}/results")]
    public async Task<IActionResult> GetResults(string id) =>
        Ok(await _jobService.GetResultsAsync(id));

    [HttpGet("{id}/top-comments")]
    public async Task<IActionResult> GetTopComments(string id) =>
        Ok(await _jobService.GetTopCommentsAsync(id));

    [HttpGet("{id}/verify-chain")]
    public async Task<IActionResult> VerifyChain(string id) =>
        Ok(await _jobService.VerifyChainAsync(id));

    [HttpGet("{id}/report")]
    public async Task<IActionResult> GetReport(string id)
    {
        try
        {
            var pdf = await _jobService.GetReportAsync(id);
            return File(pdf, "application/pdf", $"report-{id}.pdf");
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}
