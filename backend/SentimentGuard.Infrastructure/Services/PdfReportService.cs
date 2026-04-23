using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SentimentGuard.Domain.Interfaces;
using SentimentGuard.Infrastructure.Mongo;
using MongoDB.Driver;

namespace SentimentGuard.Infrastructure.Services;

public class PdfReportService : IReportService
{
    private readonly MongoDbContext _context;
    private readonly IHashChainService _hashChain;

    public PdfReportService(MongoDbContext context, IHashChainService hashChain)
    {
        _context = context;
        _hashChain = hashChain;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]> GeneratePdfReportAsync(string jobId)
    {
        var job = await _context.Jobs.Find(j => j.Id == jobId).FirstOrDefaultAsync()
            ?? throw new InvalidOperationException($"Job {jobId} not found.");

        var results = await _context.Results
            .Find(r => r.JobId == jobId)
            .SortBy(r => r.CreatedAt)
            .ToListAsync();

        var (chainValid, brokenAt) = await _hashChain.VerifyChainAsync(jobId);
        var finalHash = results.LastOrDefault()?.CurrentHash ?? "N/A";

        var topComments = results
            .GroupBy(r => r.OriginalComment.Trim().ToLower())
            .OrderByDescending(g => g.Count())
            .Take(10)
            .Select(g => (Comment: g.First().OriginalComment, Count: g.Count()))
            .ToList();

        int positive = results.Count(r => r.Sentiment == Domain.Enums.SentimentLabel.Positive);
        int negative = results.Count(r => r.Sentiment == Domain.Enums.SentimentLabel.Negative);
        int neutral = results.Count(r => r.Sentiment == Domain.Enums.SentimentLabel.Neutral);

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Column(col =>
                {
                    col.Item().Text("SentimentGuard — Analysis Report").FontSize(20).Bold();
                    col.Item().Text($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC").FontSize(9).FontColor(Colors.Grey.Medium);
                });

                page.Content().Column(col =>
                {
                    col.Item().PaddingTop(16).Text("Job Overview").FontSize(14).Bold();
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(2); });
                        void Row(string k, string v)
                        {
                            table.Cell().Text(k).Bold();
                            table.Cell().Text(v);
                        }
                        Row("Job ID", job.Id);
                        Row("File Name", job.FileName);
                        Row("Status", job.Status.ToString());
                        Row("Created At", job.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss") + " UTC");
                        Row("Total Records", results.Count.ToString());
                    });

                    col.Item().PaddingTop(16).Text("Sentiment Distribution").FontSize(14).Bold();
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); });
                        table.Cell().Text("Sentiment").Bold();
                        table.Cell().Text("Count").Bold();
                        table.Cell().Text("Positive"); table.Cell().Text(positive.ToString());
                        table.Cell().Text("Negative"); table.Cell().Text(negative.ToString());
                        table.Cell().Text("Neutral"); table.Cell().Text(neutral.ToString());
                    });

                    if (topComments.Any())
                    {
                        col.Item().PaddingTop(16).Text("Top Repeated Comments").FontSize(14).Bold();
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c => { c.RelativeColumn(3); c.RelativeColumn(); });
                            table.Cell().Text("Comment").Bold();
                            table.Cell().Text("Count").Bold();
                            foreach (var (comment, count) in topComments)
                            {
                                table.Cell().Text(comment.Length > 80 ? comment[..80] + "…" : comment);
                                table.Cell().Text(count.ToString());
                            }
                        });
                    }

                    col.Item().PaddingTop(16).Text("Security & Integrity").FontSize(14).Bold();
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(3); });
                        void Row(string k, string v)
                        {
                            table.Cell().Text(k).Bold();
                            table.Cell().Text(v);
                        }
                        Row("Chain Status", chainValid ? "VALID — No tampering detected" : $"BROKEN at index {brokenAt}");
                        Row("Final Hash", finalHash.Length > 40 ? finalHash[..40] + "…" : finalHash);
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("SentimentGuard MVP — Academic Project").FontSize(8).FontColor(Colors.Grey.Medium);
                });
            });
        }).GeneratePdf();
    }
}
