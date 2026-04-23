using Microsoft.AspNetCore.Mvc;
using SentimentGuard.Application.DTOs;
using SentimentGuard.Application.Services;

namespace SentimentGuard.Api.Controllers;

[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private readonly IUploadService _uploadService;

    public UploadsController(IUploadService uploadService) => _uploadService = uploadService;

    [HttpPost]
    [RequestSizeLimit(100_000_000)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file provided." });

        try
        {
            var request = new UploadRequest
            {
                FileName = file.FileName,
                FileStream = file.OpenReadStream()
            };
            var job = await _uploadService.HandleUploadAsync(request);
            return CreatedAtAction(nameof(JobsController.GetJob), "Jobs", new { id = job.Id }, job);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
