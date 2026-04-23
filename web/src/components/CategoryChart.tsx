import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import type { JobSummary } from "../types";
import { useI18n } from "../i18n/I18nProvider";

type CategoryKey = "Complaint" | "Question" | "Praise" | "Disappointment";

const COLORS = ["#f97316", "#22d3ee", "#a78bfa", "#fb7185"];

function labelForCategory(t: ReturnType<typeof useI18n>["t"], c: CategoryKey) {
  if (c === "Complaint") return t("category.complaint");
  if (c === "Question") return t("category.question");
  if (c === "Praise") return t("category.praise");
  return t("category.disappointment");
}

export default function CategoryChart({ summary }: { summary: JobSummary }) {
  const { t } = useI18n();

  const data = [
    { key: "Complaint" as const, value: summary.complaintCount },
    { key: "Question" as const, value: summary.questionCount },
    { key: "Praise" as const, value: summary.praiseCount },
    { key: "Disappointment" as const, value: summary.disappointmentCount },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        {t("common.no_data")}
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 4 }}>
        <XAxis
          dataKey="key"
          tick={{ fill: "rgba(71,85,105,1)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => labelForCategory(t, v as CategoryKey)}
        />
        <YAxis
          tick={{ fill: "rgba(71,85,105,1)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--ink)",
            fontSize: "12px",
          }}
          cursor={{ fill: "rgba(15,23,42,0.04)" }}
          formatter={(value: unknown, name: unknown) => {
            const v = Number(value ?? 0);
            return [v.toLocaleString(), labelForCategory(t, name as CategoryKey)];
          }}
          labelFormatter={() => ""}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            style={{ fill: "rgba(71,85,105,1)", fontSize: "11px" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
