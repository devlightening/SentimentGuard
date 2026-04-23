import { Link, Outlet, useLocation } from "react-router-dom";
import { ShieldIcon } from "../components/Icons";
import { useI18n } from "../i18n/I18nProvider";

export default function Layout() {
  const { pathname } = useLocation();
  const { t, lang, setLang } = useI18n();

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  const navLinks = [
    { to: "/", label: t("nav.upload") },
    { to: "/jobs", label: t("nav.jobs") },
  ];

  return (
    <div className="min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 10%, rgba(14,165,233,0.12), transparent 40%), radial-gradient(circle at 88% 12%, rgba(249,115,22,0.10), transparent 38%), radial-gradient(circle at 70% 92%, rgba(20,184,166,0.10), transparent 42%)",
        }}
      />

      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(246,247,251,0.78)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,233,0.95), rgba(20,184,166,0.85))",
                boxShadow: "0 10px 24px rgba(14,165,233,0.18)",
                color: "white",
              }}
            >
              <ShieldIcon width={16} height={16} strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900 tracking-tight">
                Sentiment<span style={{ color: "var(--accent)" }}>Guard</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {t("app.nav_subtitle")}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive(to)
                    ? "rgba(14,165,233,0.10)"
                    : "transparent",
                  color: isActive(to) ? "var(--ink)" : "var(--muted)",
                }}
              >
                {label}
              </Link>
            ))}

            <div
              className="ml-2 flex items-center rounded-xl overflow-hidden sg-chip"
              aria-label={t("nav.lang")}
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                className="px-2.5 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  color: lang === "en" ? "var(--ink)" : "var(--muted2)",
                  backgroundColor:
                    lang === "en" ? "rgba(15,23,42,0.06)" : "transparent",
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tr")}
                className="px-2.5 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  color: lang === "tr" ? "var(--ink)" : "var(--muted2)",
                  backgroundColor:
                    lang === "tr" ? "rgba(15,23,42,0.06)" : "transparent",
                }}
              >
                TR
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative">
        <Outlet />
      </main>

      <footer
        className="relative mt-16 py-8 text-center text-xs text-slate-500"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {t("app.tagline")}
      </footer>
    </div>
  );
}
