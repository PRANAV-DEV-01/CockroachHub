import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Locale = "en" | "hi";

const messages: Partial<Record<Locale, Record<string, any>>> = {};

async function loadLocale(locale: Locale) {
  if (messages[locale]) return messages[locale];
  const mod = await import(`../i18n/${locale}.json`);
  messages[locale] = mod.default;
  return mod.default;
}

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => any;
}

export const Ctx = createContext<LocaleCtx>({
  locale: "en",
  setLocale: () => {},
  t: (p: string) => p as any,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem("cockroachhub-locale") as Locale) || "en";
  });
  const [data, setData] = useState<Record<string, any>>({});
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    loadLocale(locale).then(setData);
    localStorage.setItem("cockroachhub-locale", locale);
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (path: string): any => {
      const parts = path.split(".");
      let val: any = dataRef.current;
      for (const p of parts) {
        if (val && typeof val === "object" && p in val) val = val[p];
        else return path;
      }
      return val;
    },
    []
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}
