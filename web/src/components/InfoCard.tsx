export default function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="sg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon ? (
          <span
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: "rgba(14,165,233,0.08)",
              border: "1px solid var(--border)",
              color: "var(--ink)",
            }}
          >
            {icon}
          </span>
        ) : null}
        <h2 className="text-slate-900 font-semibold text-base">{title}</h2>
      </div>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}
