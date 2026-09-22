"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dashboardActionKey,
  dashboardSubtitleKey,
  dashboardTitleKey,
  messages,
  TKey,
  translate,
} from "./translations";

export type LangCode =
  | "en"
  | "hi"
  | "bn"
  | "te"
  | "mr"
  | "ta"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "or"
  | "as"
  | "ur";

export const languages: { code: LangCode; label: string; speech: string }[] = [
  { code: "en", label: "English", speech: "en-IN" },
  { code: "hi", label: "हिन्दी", speech: "hi-IN" },
  { code: "bn", label: "বাংলা", speech: "bn-IN" },
  { code: "te", label: "తెలుగు", speech: "te-IN" },
  { code: "mr", label: "मराठी", speech: "mr-IN" },
  { code: "ta", label: "தமிழ்", speech: "ta-IN" },
  { code: "gu", label: "ગુજરાતી", speech: "gu-IN" },
  { code: "kn", label: "ಕನ್ನಡ", speech: "kn-IN" },
  { code: "ml", label: "മലയാളം", speech: "ml-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ", speech: "pa-IN" },
  { code: "or", label: "ଓଡ଼ିଆ", speech: "or-IN" },
  { code: "as", label: "অসমীয়া", speech: "as-IN" },
  { code: "ur", label: "اردو", speech: "ur-IN" },
];

function readStoredLang(): LangCode {
  if (typeof window === "undefined") return "en";
  const saved = sessionStorage.getItem("kc_lang") as LangCode | null;
  if (saved && languages.some((l) => l.code === saved)) return saved;
  return "en";
}

type I18nCtx = {
  lang: LangCode;
  setLang: (c: LangCode) => void;
  t: (key: TKey) => string;
  speechLang: string;
  roleTitle: (role: string) => string;
  roleSubtitle: (role: string) => string;
  roleAction: (role: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(readStoredLang());
    setMounted(true);
  }, []);

  const setLang = useCallback((c: LangCode) => {
    setLangState(c);
    sessionStorage.setItem("kc_lang", c);
    if (typeof document !== "undefined") document.documentElement.lang = c;
    speakText(translate(c, "languageChanged"), speechFor(c));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
  }, [lang, mounted]);

  const speechLang = speechFor(lang);
  const t = useCallback((key: TKey) => translate(lang, key), [lang]);
  const roleTitle = useCallback(
    (role: string) => t(dashboardTitleKey(role)),
    [t],
  );
  const roleSubtitle = useCallback(
    (role: string) => t(dashboardSubtitleKey(role)),
    [t],
  );
  const roleAction = useCallback(
    (role: string) => t(dashboardActionKey(role)),
    [t],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, speechLang, roleTitle, roleSubtitle, roleAction }),
    [lang, setLang, t, speechLang, roleTitle, roleSubtitle, roleAction],
  );

  if (!mounted) {
    return (
      <I18nContext.Provider
        value={{
          lang: "en",
          setLang,
          t: (k) => messages.en[k],
          speechLang: "en-IN",
          roleTitle: (r) => translate("en", dashboardTitleKey(r)),
          roleSubtitle: (r) => translate("en", dashboardSubtitleKey(r)),
          roleAction: (r) => translate("en", dashboardActionKey(r)),
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

function speechFor(code: LangCode) {
  return languages.find((l) => l.code === code)?.speech || "en-IN";
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n requires I18nProvider");
  return ctx;
}

function pickVoice(lang: string) {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  const base = lang.split("-")[0];
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(base)) ||
    voices.find((v) => v.lang.includes("IN")) ||
    voices[0] ||
    null
  );
}

export function speakText(text: string, lang: string) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

export function stopSpeech() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}
