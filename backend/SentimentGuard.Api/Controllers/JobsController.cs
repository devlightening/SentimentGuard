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
        try
        {
            var summary = await _jobService.GetSummaryAsync(id);
            return summary is null ? NotFound() : Ok(summary);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("{id}/results")]
    public async Task<IActionResult> GetResults(string id)
    {
        try
        {
            return Ok(await _jobService.GetResultsAsync(id));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("{id}/top-comments")]
    public async Task<IActionResult> GetTopComments(string id)
    {
        try
        {
            return Ok(await _jobService.GetTopCommentsAsync(id));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("{id}/verify-chain")]
    public async Task<IActionResult> VerifyChain(string id)
    {
        try
        {
            return Ok(await _jobService.VerifyChainAsync(id));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

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
