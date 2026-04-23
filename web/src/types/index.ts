export interface Job {
  id: string;
  fileName: string;
  status: "Pending" | "Running" | "Completed" | "Failed";
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  totalRecords: number;
  processedRecords: number;
  errorMessage?: string;
}

export interface JobSummary {
  jobId: string;
  totalRecords: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  complaintCount: number;
  praiseCount: number;
  questionCount: number;
  disappointmentCount: number;
  finalHash: string;
  chainValid: boolean;
}

export interface AnalysisResult {
  id: string;
  jobId: string;
  maskedUser: string;
  originalComment: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  category?: string;
  score: number;
  prevHash: string;
  currentHash: string;
  createdAt: string;
}

export interface ChainVerification {
  jobId: string;
  isValid: boolean;
  brokenAtIndex?: number;
  message: string;
}
