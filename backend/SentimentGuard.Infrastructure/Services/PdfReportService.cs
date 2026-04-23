using MongoDB.Driver;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SentimentGuard.Domain.Enums;
using SentimentGuard.Domain.Interfaces;
using SentimentGuard.Infrastructure.Mongo;

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

        int total = results.Count;
        int positive = results.Count(r => r.Sentiment == SentimentLabel.Positive);
        int negative = results.Count(r => r.Sentiment == SentimentLabel.Negative);
        int neutral = results.Count(r => r.Sentiment == SentimentLabel.Neutral);

        int complaint = results.Count(r => r.Category == CategoryLabel.Complaint);
        int praise = results.Count(r => r.Category == CategoryLabel.Praise);
        int question = results.Count(r => r.Category == CategoryLabel.Question);
        int disappointment = results.Count(r => r.Category == CategoryLabel.Disappointment);
        int other = results.Count(r => r.Category == CategoryLabel.Other || r.Category == null);

        var topComments = results
            .GroupBy(r => (r.OriginalComment ?? string.Empty).Trim().ToLowerInvariant())
            .OrderByDescending(g => g.Count())
            .Take(12)
            .Select(g => (Comment: g.First().OriginalComment, Count: g.Count(), Sample: g.First()))
            .ToList();

        string NowUtc() => DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm") + " UTC";
        string FmtUtc(DateTime dt) => dt.ToString("yyyy-MM-dd HH:mm:ss") + " UTC";

        string ShortHash(string h, int take = 56)
        {
            if (string.IsNullOrWhiteSpace(h)) return "N/A";
            return h.Length > take ? h[..take] + "..." : h;
        }

        string ShortText(string text, int max)
        {
            if (string.IsNullOrWhiteSpace(text)) return "";
            text = text.Replace("\r", " ").Replace("\n", " ").Trim();
            return text.Length > max ? text[..max] + "..." : text;
        }

        void Divider(IContainer c) =>
            c.Height(1).Background(Colors.Grey.Lighten2);

        void MetricBox(IContainer c, string label, string value, string note, string color)
        {
            c.Border(1).BorderColor(Colors.Grey.Lighten2).Background(Colors.White)
                .Padding(12)
                .Column(col =>
                {
                    col.Item().Text(label).FontSize(9).FontColor(Colors.Grey.Darken1);
                    col.Item().PaddingTop(2).Text(value).FontSize(18).Bold().FontColor(color);
                    if (!string.IsNullOrWhiteSpace(note))
                        col.Item().PaddingTop(4).Text(note).FontSize(9).FontColor(Colors.Grey.Medium);
                });
        }

        void BarRow(IContainer c, string label, int count, int totalCount, string barColor)
        {
            var pct = totalCount <= 0 ? 0 : (double)count / totalCount;
            var fill = pct <= 0 ? 0f : (float)Math.Clamp(pct, 0.01, 1.0);
            var rest = 1f - fill;

            c.Row(row =>
            {
                row.ConstantItem(88).AlignLeft()
                    .Text(label).FontSize(10).FontColor(Colors.Grey.Darken2);

                row.RelativeItem().Height(10).AlignMiddle().Row(r =>
                {
                    // Two-segment bar without Layer/CornerRadius to match older QuestPDF APIs.
                    if (fill <= 0)
                    {
                        r.RelativeItem().Background(Colors.Grey.Lighten3);
                        return;
                    }

                    r.RelativeItem(fill).Background(barColor);
                    if (rest > 0)
                        r.RelativeItem(rest).Background(Colors.Grey.Lighten3);
                });

                row.ConstantItem(72).AlignRight()
                    .Text($"{count:n0} ({pct:P0})").FontSize(10).FontColor(Colors.Grey.Darken2);
            });
        }

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11).FontColor(Colors.Grey.Darken4));

                page.Header().Column(col =>
                {
                    col.Item().Text("SentimentGuard - Analysis Report").FontSize(20).Bold();
                    col.Item().Text($"Generated: {NowUtc()}").FontSize(9).FontColor(Colors.Grey.Medium);
                });

                page.Content().Column(col =>
                {
                    col.Spacing(10);

                    col.Item().PaddingTop(8).Text("Overview").FontSize(14).Bold();
                    col.Item().Text(
                            "This report summarizes a batch sentiment run over the uploaded dataset. " +
                            "Identity fields are masked before storage, and a hash chain allows integrity verification.")
                        .FontSize(10).FontColor(Colors.Grey.Darken1);

                    col.Item().PaddingTop(6).Element(Divider);

                    col.Item().Text("Job Details").FontSize(14).Bold();
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(110);
                            c.RelativeColumn();
                        });

                        void Row(string k, string v)
                        {
                            table.Cell().PaddingVertical(3)
                                .Text(k).FontSize(10).FontColor(Colors.Grey.Darken2).SemiBold();
                            table.Cell().PaddingVertical(3)
                                .Text(v).FontSize(10).FontColor(Colors.Grey.Darken4);
                        }

                        Row("Job ID", job.Id);
                        Row("File name", job.FileName);
                        Row("Status", job.Status.ToString());
                        Row("Created", FmtUtc(job.CreatedAt));
                        Row("Completed", job.CompletedAt.HasValue ? FmtUtc(job.CompletedAt.Value) : "-");
                        Row("Records processed", total.ToString("n0"));
                    });

                    col.Item().PaddingTop(6).Row(row =>
                    {
                        row.Spacing(10);
                        row.RelativeItem().Element(c =>
                            MetricBox(c, "Records", total.ToString("n0"), "Total analyzed rows", Colors.Blue.Darken2));
                        row.RelativeItem().Element(c =>
                            MetricBox(c, "Positive", positive.ToString("n0"), "Share of all records", Colors.Green.Darken2));
                        row.RelativeItem().Element(c =>
                            MetricBox(c, "Negative", negative.ToString("n0"), "Share of all records", Colors.Red.Darken2));
                    });

                    col.Item().Row(row =>
                    {
                        row.Spacing(10);
                        row.RelativeItem().Element(c =>
                            MetricBox(c, "Neutral", neutral.ToString("n0"), "Share of all records", Colors.Grey.Darken2));
                        row.RelativeItem().Element(c =>
                            MetricBox(c, "Integrity", chainValid ? "VALID" : "BROKEN",
                                chainValid ? "No tampering detected" : $"Broken at index {brokenAt}",
                                chainValid ? Colors.Green.Darken2 : Colors.Red.Darken2));
                        row.RelativeItem().Element(c =>
                            MetricBox(c, "Final hash", ShortHash(finalHash, 22), "Chain tail (summary)", Colors.Grey.Darken2));
                    });

                    col.Item().PaddingTop(10).Text("Sentiment Distribution").FontSize(14).Bold();
                    col.Item().Column(bars =>
                    {
                        bars.Spacing(6);
                        bars.Item().Element(c => BarRow(c, "Positive", positive, total, "#22c55e"));
                        bars.Item().Element(c => BarRow(c, "Negative", negative, total, "#ef4444"));
                        bars.Item().Element(c => BarRow(c, "Neutral", neutral, total, "#64748b"));
                    });

                    col.Item().PaddingTop(10).Text("Category Breakdown (MVP rules)").FontSize(14).Bold();
                    col.Item().Column(bars =>
                    {
                        bars.Spacing(6);
                        bars.Item().Element(c => BarRow(c, "Complaint", complaint, total, "#f97316"));
                        bars.Item().Element(c => BarRow(c, "Question", question, total, "#22d3ee"));
                        bars.Item().Element(c => BarRow(c, "Praise", praise, total, "#a78bfa"));
                        bars.Item().Element(c => BarRow(c, "Disappoint", disappointment, total, "#fb7185"));
                        if (other > 0)
                            bars.Item().Element(c => BarRow(c, "Other", other, total, "#94a3b8"));
                    });

                    if (topComments.Any())
                    {
                        col.Item().PaddingTop(14).Text("Top Repeated Comments").FontSize(14).Bold();
                        col.Item().Text("Helps identify recurring issues and repeated feedback patterns.")
                            .FontSize(10).FontColor(Colors.Grey.Darken1);

                        col.Item().PaddingTop(4).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(5);
                                c.ConstantColumn(56);
                                c.ConstantColumn(72);
                                c.ConstantColumn(88);
                            });

                            table.Header(h =>
                            {
                                h.Cell().PaddingVertical(6).Text("Comment").SemiBold().FontSize(10);
                                h.Cell().PaddingVertical(6).AlignRight().Text("Count").SemiBold().FontSize(10);
                                h.Cell().PaddingVertical(6).Text("Sentiment").SemiBold().FontSize(10);
                                h.Cell().PaddingVertical(6).Text("Category").SemiBold().FontSize(10);
                                h.Cell().ColumnSpan(4).Element(Divider);
                            });

                            foreach (var (comment, count, sample) in topComments)
                            {
                                table.Cell().PaddingVertical(6).Text(ShortText(comment, 150)).FontSize(10);
                                table.Cell().PaddingVertical(6).AlignRight().Text(count.ToString("n0")).FontSize(10);
                                table.Cell().PaddingVertical(6).Text(sample.Sentiment.ToString()).FontSize(10);
                                table.Cell().PaddingVertical(6).Text(sample.Category?.ToString() ?? "Other").FontSize(10);
                            }
                        });
                    }

                    col.Item().PaddingTop(14).Text("Security & Integrity Notes").FontSize(14).Bold();
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.ConstantColumn(130); c.RelativeColumn(); });

                        void Row(string k, string v)
                        {
                            table.Cell().PaddingVertical(3).Text(k).FontSize(10).SemiBold();
                            table.Cell().PaddingVertical(3).Text(v).FontSize(10).FontColor(Colors.Grey.Darken1);
                        }

                        Row("Pseudo-anonymization", "Identity fields are masked using deterministic keyed hashing (HMAC-SHA256).");
                        Row("Hash chain", "Each record stores prevHash/currentHash. Any DB change breaks the chain from that point.");
                        Row("Chain status", chainValid ? "VALID - No tampering detected" : $"BROKEN at index {brokenAt}");
                        Row("Final hash", ShortHash(finalHash, 64));
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("SentimentGuard MVP - Academic Project").FontSize(8).FontColor(Colors.Grey.Medium);
                });
            });
        }).GeneratePdf();
    }
}
