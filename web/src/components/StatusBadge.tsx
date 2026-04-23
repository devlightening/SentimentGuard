import { useI18n } from "../i18n/I18nProvider";

interface Props {
  status: string;
}

const CONFIG: Record<
  string,
  { bg: string; color: string; dot?: boolean; labelKey?: "status.pending" | "status.running" | "status.completed" | "status.failed" }
> = {
  Pending: { bg: "rgba(234,179,8,0.12)", color: "#a16207", labelKey: "status.pending" },
  Running: { bg: "rgba(14,165,233,0.12)", color: "#0369a1", dot: true, labelKey: "status.running" },
  Completed: { bg: "rgba(34,197,94,0.12)", color: "#166534", labelKey: "status.completed" },
  Failed: { bg: "rgba(239,68,68,0.12)", color: "#991b1b", labelKey: "status.failed" },
};

export default function StatusBadge({ status }: Props) {
  const { t } = useI18n();
  const c = CONFIG[status] ?? { bg: "#1f2937", color: "#9ca3af" };
  const label = c.labelKey ? t(c.labelKey) : status;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: c.bg,
        color: c.color,
        border: "1px solid var(--border)",
      }}
    >
      {c.dot && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: c.color }}
        />
      )}
      {label}
    </span>
  );
}
