import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/api";
import type { Job } from "../types";
import StatusBadge from "../components/StatusBadge";
import { ArrowRightIcon, FileIcon, UploadIcon } from "../components/Icons";
import { useI18n } from "../i18n/I18nProvider";

function RelativeTime({ date }: { date: string }) {
  const { t, lang } = useI18n();
  const diff = Date.now() - new Date(date).getTime();

  if (diff < 60_000) return <span>{t("time.just_now")}</span>;
  if (diff < 3_600_000)
    return <span>{t("time.minutes_ago", { n: Math.floor(diff / 60_000) })}</span>;
  if (diff < 86_400_000)
    return <span>{t("time.hours_ago", { n: Math.floor(diff / 3_600_000) })}</span>;

  const locale = lang === "tr" ? "tr-TR" : "en-US";
  return <span>{new Date(date).toLocaleDateString(locale)}</span>;
}

function JobRow({ job }: { job: Job }) {
  const { t } = useI18n();
  const recordsText =
    job.totalRecords > 0 ? `${job.processedRecords.toLocaleString()} ${t("common.records")}` : "";

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="sg-card p-4 flex items-center justify-between gap-4 transition-transform"
      style={{ cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "rgba(15,23,42,0.03)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
          }}
        >
          <FileIcon width={18} height={18} />
        </div>
        <div className="min-w-0">
          <p className="text-slate-900 font-semibold truncate">{job.fileName}</p>
          <p className="text-slate-500 text-xs font-mono mt-0.5 truncate">
            {job.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {recordsText ? (
          <div className="hidden sm:block text-right">
            <p className="text-slate-900 text-sm font-semibold">{recordsText}</p>
            <p className="text-slate-500 text-xs">
              <RelativeTime date={job.createdAt} />
            </p>
          </div>
        ) : (
          <div className="hidden sm:block text-right">
            <p className="text-slate-500 text-xs">
              <RelativeTime date={job.createdAt} />
            </p>
          </div>
        )}
        <StatusBadge status={job.status} />
        <span style={{ color: "var(--muted)" }}>
          <ArrowRightIcon width={16} height={16} />
        </span>
      </div>
    </Link>
  );
}

export default function JobListPage() {
  const { t } = useI18n();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setError(t("error.api_unreachable")))
      .finally(() => setLoading(false));
  }, [t]);

  const subtitle = useMemo(() => {
    if (jobs.length === 0) return t("jobs.subtitle.none");
    return t("jobs.subtitle.count", {
      n: jobs.length,
      plural: jobs.length !== 1 ? "s" : "",
    });
  }, [jobs.length, t]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="sg-rise flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl tracking-tight text-slate-950"
            style={{ fontFamily: 'ui-serif, "Iowan Old Style", Georgia, serif' }}
          >
            {t("jobs.title")}
          </h1>
          <p className="mt-1 text-slate-600">{subtitle}</p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.90), rgba(20,184,166,0.86))",
            color: "white",
            boxShadow: "0 12px 28px rgba(14,165,233,0.20)",
          }}
        >
          <UploadIcon width={16} height={16} />
          {t("jobs.cta.new")}
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 text-slate-600">{t("common.loading")}</div>
      ) : error ? (
        <div
          className="mt-8 p-4 rounded-2xl text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.35)",
            color: "#7f1d1d",
          }}
        >
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-10 sg-card p-10 text-center">
          <div
            className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: "rgba(15,23,42,0.03)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            <FileIcon width={20} height={20} />
          </div>
          <p className="mt-4 text-slate-900 font-semibold">{t("jobs.empty.title")}</p>
          <p className="mt-1 text-slate-600">
            <Link to="/" style={{ color: "var(--accent)" }} className="font-medium hover:underline">
              {t("jobs.empty.link")}
            </Link>{" "}
            {t("jobs.empty.subtitle")}
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {jobs.map((j) => (
            <JobRow key={j.id} job={j} />
          ))}
        </div>
      )}
    </div>
  );
}

