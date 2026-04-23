import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

type Vars = Record<string, string | number | boolean | null | undefined>;

export interface I18nApi {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
}

const I18nContext = createContext<I18nApi | null>(null);

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    if (v === null || v === undefined) return "";
    return String(v);
  });
}

function detectInitialLang(): Lang {
  const stored = localStorage.getItem("sg_lang");
  if (stored === "tr" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem("sg_lang", next);
    // Helps screen readers and browser-native widgets (date/time, etc.)
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Vars) => {
      const raw = translations[lang][key] ?? translations.en[key] ?? key;
      return interpolate(raw, vars);
    },
    [lang]
  );

  const api = useMemo<I18nApi>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nApi {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within <I18nProvider />");
  }
  return ctx;
}
