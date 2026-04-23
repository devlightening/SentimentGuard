import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/api";
import { useI18n } from "../i18n/I18nProvider";
import InfoCard from "../components/InfoCard";
import {
  ArrowRightIcon,
  ChainIcon,
  DatabaseIcon,
  LockIcon,
  SearchIcon,
  SparkIcon,
  UploadIcon,
} from "../components/Icons";

const TECH = [
  "ASP.NET Core 8",
  "Apache PySpark",
  "MongoDB",
  "React + Vite",
  "Docker Compose",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-slate-900 font-semibold text-base">{children}</h2>
    </div>
  );
}

export default function UploadPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setError("");
      setLoading(true);
      try {
        const job = await uploadFile(file);
        navigate(`/jobs/${job.id}`);
      } catch (e: any) {
        setError(e?.response?.data?.error ?? t("upload.error.default"));
      } finally {
        setLoading(false);
      }
    },
    [navigate, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/json": [".json"] },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="sg-rise grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left: narrative */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 sg-chip text-xs text-slate-600">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span>{t("upload.badge")}</span>
          </div>

          <h1
            className="mt-5 text-4xl sm:text-5xl leading-[1.05] tracking-tight text-slate-950"
            style={{ fontFamily: 'ui-serif, "Iowan Old Style", Georgia, serif' }}
          >
            {t("upload.title.line1")}
            <span className="block" style={{ color: "var(--accent)" }}>
              {t("upload.title.line2")}
            </span>
          </h1>

          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
            {t("upload.subtitle")}
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-9 h-9 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(14,165,233,0.10)",
                    border: "1px solid var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  <SparkIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">
                    {t("upload.feature.bigdata.title")}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {t("upload.feature.bigdata.course")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {t("upload.feature.bigdata.desc")}
              </p>
            </div>

            <div className="sg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-9 h-9 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(20,184,166,0.10)",
                    border: "1px solid var(--border)",
                    color: "var(--accent3)",
                  }}
                >
                  <LockIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">
                    {t("upload.feature.privacy.title")}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {t("upload.feature.privacy.course")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {t("upload.feature.privacy.desc")}
              </p>
            </div>

            <div className="sg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-9 h-9 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(249,115,22,0.10)",
                    border: "1px solid var(--border)",
                    color: "var(--accent2)",
                  }}
                >
                  <ChainIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">
                    {t("upload.feature.integrity.title")}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {t("upload.feature.integrity.course")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {t("upload.feature.integrity.desc")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoCard title={t("upload.how.title")} icon={<ArrowRightIcon width={18} height={18} />}>
              <div className="space-y-3">
                {[
                  { n: 1, title: t("upload.how.step1.title"), desc: t("upload.how.step1.desc") },
                  { n: 2, title: t("upload.how.step2.title"), desc: t("upload.how.step2.desc") },
                  { n: 3, title: t("upload.how.step3.title"), desc: t("upload.how.step3.desc") },
                  { n: 4, title: t("upload.how.step4.title"), desc: t("upload.how.step4.desc") },
                ].map((s) => (
                  <div key={s.n} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(15,23,42,0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--ink)",
                      }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <p className="text-slate-900 font-medium">{s.title}</p>
                      <p className="text-slate-600 text-sm mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title={t("upload.quality.title")} icon={<SearchIcon width={18} height={18} />}>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                <li>{t("upload.quality.item1")}</li>
                <li>{t("upload.quality.item2")}</li>
                <li>{t("upload.quality.item3")}</li>
                <li>{t("upload.quality.item4")}</li>
                <li>{t("upload.quality.item5")}</li>
              </ul>
            </InfoCard>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoCard title={t("upload.privacy.title")} icon={<LockIcon width={18} height={18} />}>
              <div className="space-y-2">
                <p className="text-slate-600 text-sm">{t("upload.privacy.p1")}</p>
                <p className="text-slate-600 text-sm">{t("upload.privacy.p2")}</p>
              </div>
            </InfoCard>

            <InfoCard title={t("upload.results.title")} icon={<DatabaseIcon width={18} height={18} />}>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                <li>{t("upload.results.item1")}</li>
                <li>{t("upload.results.item2")}</li>
                <li>{t("upload.results.item3")}</li>
                <li>{t("upload.results.item4")}</li>
              </ul>
            </InfoCard>
          </div>
        </div>

        {/* Right: upload card */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="sg-card p-6 sg-rise" style={{ animationDelay: "60ms" }}>
            <SectionTitle>{t("nav.upload")}</SectionTitle>

            <div
              {...getRootProps()}
              className="mt-4 rounded-2xl p-7 sm:p-8 text-left cursor-pointer transition-all"
              style={{
                border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
                background: isDragActive
                  ? "linear-gradient(180deg, rgba(14,165,233,0.10), rgba(255,255,255,0.65))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.65))",
                boxShadow: isDragActive ? "0 0 0 6px var(--ring)" : "none",
              }}
            >
              <input {...getInputProps()} />

              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "rgba(14,165,233,0.10)",
                    border: "1px solid var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  {loading ? <SparkIcon width={20} height={20} /> : <UploadIcon width={20} height={20} />}
                </div>

                <div className="min-w-0">
                  <p className="text-slate-900 font-semibold">
                    {loading ? t("upload.drop.loading") : t("upload.drop.prompt")}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    {loading ? t("upload.drop.loading_hint") : t("upload.drop.hint")}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="sg-chip px-3 py-1">{t("upload.drop.required")}</span>
                    <span className="sg-chip px-3 py-1">{t("upload.drop.optional")}</span>
                  </div>
                </div>
              </div>
            </div>

            {error ? (
              <div
                className="mt-4 p-3 rounded-xl text-sm"
                style={{
                  backgroundColor: "rgba(248,113,113,0.10)",
                  border: "1px solid rgba(248,113,113,0.35)",
                  color: "#7f1d1d",
                }}
              >
                {error}
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Tech stack
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TECH.map((x) => (
                  <span
                    key={x}
                    className="px-3 py-1.5 text-xs rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.80)",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--ink)" }}
              >
                {t("upload.cta.view_jobs")}
                <ArrowRightIcon width={16} height={16} />
              </Link>
              <span className="text-xs text-slate-500">.csv, .json</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

