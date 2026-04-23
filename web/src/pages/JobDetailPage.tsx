import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AnalysisResult, ChainVerification, Job, JobSummary } from "../types";
import {
  getJob,
  getJobSummary,
  getTopComments,
  getReportUrl,
  verifyChain,
} from "../services/api";
import { useI18n } from "../i18n/I18nProvider";
import StatusBadge from "../components/StatusBadge";
import SentimentChart from "../components/SentimentChart";
import CategoryChart from "../components/CategoryChart";
import InfoCard from "../components/InfoCard";
import {
  ArrowRightIcon,
  ChainIcon,
  DatabaseIcon,
  DownloadIcon,
  FileIcon,
  LockIcon,
  SearchIcon,
  SparkIcon,
} from "../components/Icons";

function sentimentLabel(
  t: ReturnType<typeof useI18n>["t"],
  s: AnalysisResult["sentiment"]
) {
  if (s === "Positive") return t("sentiment.positive");
  if (s === "Negative") return t("sentiment.negative");
  return t("sentiment.neutral");
}

function categoryLabel(t: ReturnType<typeof useI18n>["t"], c?: string) {
  if (!c) return "";
  if (c === "Complaint") return t("category.complaint");
  if (c === "Question") return t("category.question");
  if (c === "Praise") return t("category.praise");
  if (c === "Disappointment") return t("category.disappointment");
  if (c === "Other") return t("category.other");
  return c;
}

function KeyValue({
  k,
  v,
}: {
  k: string;
  v: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{k}</p>
      <div className="mt-1 text-slate-900 text-sm">{v}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="sg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-600 text-sm">{label}</p>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-950">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function IntegrityResult({ result }: { result: ChainVerification }) {
  const { t } = useI18n();
  const ok = result.isValid;
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
      style={{
        backgroundColor: ok ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
        border: ok
          ? "1px solid rgba(34,197,94,0.28)"
          : "1px solid rgba(239,68,68,0.28)",
        color: ok ? "#166534" : "#991b1b",
      }}
    >
      <span>{ok ? "OK" : "X"}</span>
      <span>
        {ok ? t("security.chain.valid") : t("security.chain.invalid", { message: result.message })}
      </span>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  const [job, setJob] = useState<Job | null>(null);
  const [summary, setSummary] = useState<JobSummary | null>(null);
  const [topComments, setTopComments] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [chainResult, setChainResult] = useState<ChainVerification | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const j = await getJob(id);
      setJob(j);
      if (j.status === "Completed") {
        const [s, tc] = await Promise.all([getJobSummary(id), getTopComments(id)]);
        setSummary(s);
        setTopComments(tc);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      if (job?.status === "Running" || job?.status === "Pending") loadData();
    }, 3000);
    return () => clearInterval(interval);
  }, [loadData, job?.status]);

  const durationSeconds = useMemo(() => {
    if (!job?.completedAt || !job?.createdAt) return null;
    return Math.round(
      (new Date(job.completedAt).getTime() - new Date(job.createdAt).getTime()) / 1000
    );
  }, [job?.completedAt, job?.createdAt]);

  const isCompleted = job?.status === "Completed";
  const sample = topComments[0] ?? null;

  const handleVerify = async () => {
    if (!id) return;
    setVerifying(true);
    try {
      setChainResult(await verifyChain(id));
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-slate-600">
        {t("common.loading")}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-red-700">
        {t("job_detail.not_found")}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="sg-rise flex items-center gap-2 text-sm text-slate-600">
        <Link to="/jobs" className="hover:underline">
          {t("job_detail.breadcrumb")}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-[50ch]">
          {job.fileName}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Main */}
        <div className="lg:col-span-8">
          <div className="sg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(15,23,42,0.03)",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    <FileIcon width={18} height={18} />
                  </span>
                  <div className="min-w-0">
                    <h1 className="text-slate-950 font-semibold text-lg truncate">
                      {job.fileName}
                    </h1>
                    <p className="text-slate-500 text-xs font-mono truncate">
                      {job.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={job.status} />
                {isCompleted ? (
                  <a
                    href={getReportUrl(id!)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(14,165,233,0.90), rgba(20,184,166,0.86))",
                      color: "white",
                      boxShadow: "0 12px 28px rgba(14,165,233,0.20)",
                    }}
                  >
                    <DownloadIcon width={16} height={16} />
                    {t("job_detail.pdf")}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <KeyValue
                k={t("job_detail.created")}
                v={new Date(job.createdAt).toLocaleString(locale)}
              />
              {job.completedAt ? (
                <KeyValue
                  k={t("job_detail.completed")}
                  v={new Date(job.completedAt).toLocaleString(locale)}
                />
              ) : (
                <KeyValue k={t("job_detail.completed")} v="-" />
              )}
              <KeyValue
                k={t("common.records")}
                v={
                  <span className="font-medium">
                    {job.processedRecords.toLocaleString()}
                    {job.totalRecords > 0 ? (
                      <span className="text-slate-500">
                        {" "}
                        / {job.totalRecords.toLocaleString()}
                      </span>
                    ) : null}
                  </span>
                }
              />
              <KeyValue
                k={t("job_detail.duration")}
                v={durationSeconds !== null ? `${durationSeconds}s` : "-"}
              />
            </div>

            {job.errorMessage ? (
              <div
                className="mt-4 p-3 rounded-xl text-sm"
                style={{
                  backgroundColor: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#7f1d1d",
                }}
              >
                {job.errorMessage}
              </div>
            ) : null}
          </div>

          {!isCompleted ? (
            <div className="mt-6 sg-card p-10 text-center">
              <div
                className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(14,165,233,0.10)",
                  border: "1px solid var(--border)",
                  color: "var(--accent)",
                }}
              >
                <SparkIcon width={20} height={20} />
              </div>
              <p className="mt-4 text-slate-950 font-semibold">
                {job.status === "Running"
                  ? t("job_detail.inprogress.running.title")
                  : job.status === "Pending"
                  ? t("job_detail.inprogress.pending")
                  : t("job_detail.inprogress.failed")}
              </p>
              {job.status === "Running" ? (
                <p className="mt-1 text-slate-600">
                  {t("job_detail.inprogress.running.subtitle")}
                </p>
              ) : null}
            </div>
          ) : null}

          {isCompleted && summary ? (
            <>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Metric label={t("job_detail.stats.total")} value={summary.totalRecords} color="#0ea5e9" />
                <Metric label={t("job_detail.stats.positive")} value={summary.positiveCount} color="#22c55e" />
                <Metric label={t("job_detail.stats.negative")} value={summary.negativeCount} color="#ef4444" />
                <Metric label={t("job_detail.stats.neutral")} value={summary.neutralCount} color="#64748b" />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="sg-card p-6">
                  <p className="text-slate-900 font-semibold">{t("job_detail.chart.sentiment")}</p>
                  <div className="mt-4">
                    <SentimentChart summary={summary} />
                  </div>
                </div>
                <div className="sg-card p-6">
                  <p className="text-slate-900 font-semibold">{t("job_detail.chart.category")}</p>
                  <div className="mt-4">
                    <CategoryChart summary={summary} />
                  </div>
                </div>
              </div>

              {topComments.length > 0 ? (
                <div className="mt-6 sg-card p-6">
                  <p className="text-slate-900 font-semibold">{t("job_detail.top_comments")}</p>
                  <div className="mt-4 space-y-2">
                    {topComments.map((r, i) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl flex items-start gap-3"
                        style={{
                          backgroundColor: "rgba(15,23,42,0.02)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div className="w-7 text-right text-xs font-mono text-slate-500 pt-0.5">
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-slate-900 text-sm leading-relaxed">
                            {r.originalComment}
                          </p>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-1 rounded-lg text-xs font-semibold"
                              style={{
                                backgroundColor:
                                  r.sentiment === "Positive"
                                    ? "rgba(34,197,94,0.12)"
                                    : r.sentiment === "Negative"
                                    ? "rgba(239,68,68,0.12)"
                                    : "rgba(100,116,139,0.12)",
                                border: "1px solid var(--border)",
                                color:
                                  r.sentiment === "Positive"
                                    ? "#166534"
                                    : r.sentiment === "Negative"
                                    ? "#991b1b"
                                    : "#334155",
                              }}
                            >
                              {sentimentLabel(t, r.sentiment)}
                            </span>
                            {r.category && r.category !== "Other" ? (
                              <span
                                className="px-2 py-1 rounded-lg text-xs"
                                style={{
                                  backgroundColor: "rgba(14,165,233,0.08)",
                                  border: "1px solid var(--border)",
                                  color: "#075985",
                                }}
                              >
                                {categoryLabel(t, r.category)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        {/* Right: trust & integrity */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
          {isCompleted && summary ? (
            <InfoCard title={t("job_detail.pipeline.title")} icon={<ArrowRightIcon width={18} height={18} />}>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FileIcon width={16} height={16} /> <span>CSV / JSON</span>
                </div>
                <div className="flex items-center gap-2">
                  <SparkIcon width={16} height={16} /> <span>PySpark batch</span>
                </div>
                <div className="flex items-center gap-2">
                  <LockIcon width={16} height={16} /> <span>HMAC masking</span>
                </div>
                <div className="flex items-center gap-2">
                  <DatabaseIcon width={16} height={16} /> <span>MongoDB write</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChainIcon width={16} height={16} /> <span>Hash chain</span>
                </div>
              </div>
            </InfoCard>
          ) : null}

          <InfoCard title={t("security.hmac.title")} icon={<LockIcon width={18} height={18} />}>
            <p className="text-slate-600 text-sm">{t("security.hmac.desc")}</p>
            {sample ? (
              <div
                className="mt-3 rounded-xl p-3"
                style={{
                  backgroundColor: "rgba(15,23,42,0.02)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-xs text-slate-500">{t("security.hmac.example", { id: sample.id.slice(0, 8) })}</p>
                <div className="mt-2 text-xs font-mono break-all text-slate-700">
                  {sample.maskedUser}
                </div>
              </div>
            ) : null}
          </InfoCard>

          <InfoCard title={t("security.chain.title")} icon={<ChainIcon width={18} height={18} />}>
            <p className="text-slate-600 text-sm">{t("security.chain.desc")}</p>
            {summary?.finalHash ? (
              <div
                className="mt-3 rounded-xl p-3"
                style={{
                  backgroundColor: "rgba(15,23,42,0.02)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-xs text-slate-500">{t("security.chain.final_hash")}</p>
                <p className="mt-1 text-xs font-mono text-slate-700 break-all">
                  {summary.finalHash}
                </p>
              </div>
            ) : null}

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: "rgba(14,165,233,0.10)",
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                  opacity: verifying ? 0.6 : 1,
                }}
              >
                <SearchIcon width={16} height={16} />
                {verifying ? t("security.chain.verifying") : t("security.chain.verify")}
              </button>
              {chainResult ? <IntegrityResult result={chainResult} /> : null}
            </div>
          </InfoCard>

          <div className="text-sm text-slate-600">
            <Link to="/jobs" className="inline-flex items-center gap-2 hover:underline">
              {t("nav.jobs")} <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

