namespace SentimentGuard.Domain.Entities;

public class AnalysisSummary
{
    public string JobId { get; set; } = string.Empty;
    public int TotalRecords { get; set; }
    public int PositiveCount { get; set; }
    public int NegativeCount { get; set; }
    public int NeutralCount { get; set; }
    public int ComplaintCount { get; set; }
    public int PraiseCount { get; set; }
    public int QuestionCount { get; set; }
    public int DisappointmentCount { get; set; }
    public string FinalHash { get; set; } = string.Empty;
    public bool ChainValid { get; set; }
}
