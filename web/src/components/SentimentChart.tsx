import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { JobSummary } from "../types";
import { useI18n } from "../i18n/I18nProvider";

type SentimentKey = "Positive" | "Negative" | "Neutral";

const PALETTE: Record<SentimentKey, string> = {
  Positive: "#4ade80",
  Negative: "#f87171",
  Neutral: "#64748b",
};

function labelForSentiment(t: ReturnType<typeof useI18n>["t"], s: SentimentKey) {
  if (s === "Positive") return t("sentiment.positive");
  if (s === "Negative") return t("sentiment.negative");
  return t("sentiment.neutral");
}

export default function SentimentChart({ summary }: { summary: JobSummary }) {
  const { t } = useI18n();

  const data = [
    { key: "Positive" as const, value: summary.positiveCount },
    { key: "Negative" as const, value: summary.negativeCount },
    { key: "Neutral" as const, value: summary.neutralCount },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <p className="text-gray-500 text-sm">{t("common.no_data")}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          nameKey="key"
        >
          {data.map((d) => (
            <Cell key={d.key} fill={PALETTE[d.key]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--ink)",
            fontSize: "12px",
          }}
          formatter={(value: unknown, name: unknown) => {
            const key = name as SentimentKey;
            const v = Number(value ?? 0);
            const pct =
              summary.totalRecords > 0
                ? Math.round((v / summary.totalRecords) * 100)
                : 0;
            return [`${v.toLocaleString()} (${pct}%)`, labelForSentiment(t, key)];
          }}
          labelFormatter={() => ""}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: "var(--muted)", fontSize: "12px" }}>
              {labelForSentiment(t, value as SentimentKey)}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
