"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineChart, LogOut, Recycle, Volume2, VolumeX } from "lucide-react";
import { Role, SessionUser, roleRoutes } from "@/lib/types";
import { languages, speakText, stopSpeech, useI18n } from "@/lib/i18n";

export function AppNavigation({
  role,
  notice,
  user,
}: {
  role: Role;
  notice?: string;
  user?: SessionUser;
}) {
  const router = useRouter();
  const { lang, setLang, t, speechLang } = useI18n();
  const signOut = () => {
    sessionStorage.removeItem("kc_token");
    sessionStorage.removeItem("kc_user");
    router.replace("/");
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-emerald-950/5 bg-white/95 px-5 py-3 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lime">
            <Recycle size={20} />
          </span>
          <span>
            <b className="block leading-4 text-forest">KabadiConnect</b>
            <small className="text-[11px] text-slate-500">
              India&apos;s circular network
            </small>
          </span>
        </Link>
        {notice && (
          <p className="hidden max-w-md truncate text-xs font-semibold text-emerald-700 md:block">
            {notice}
          </p>
        )}
        <div className="flex items-center gap-2">
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value as typeof lang)}
            className="max-w-[7rem] rounded-xl border border-emerald-100 bg-white px-2 py-2 text-xs font-bold text-forest"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            title={t("speakPage")}
            onClick={() =>
              speakText(
                `${user?.name || ""}. ${notice || "KabadiConnect dashboard"}`,
                speechLang,
              )
            }
            className="rounded-xl p-2.5 text-emerald-700 hover:bg-emerald-50"
          >
            <Volume2 size={17} />
          </button>
          <button
            type="button"
            title={t("stopVoice")}
            onClick={stopSpeech}
            className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block"
          >
            <VolumeX size={17} />
          </button>
          <Link
            href="/market"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 sm:flex"
          >
            <LineChart size={16} /> {t("marketRates")}
          </Link>
          <Link
            href={roleRoutes[role]}
            className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-sm font-black text-forest"
            title={user?.name}
          >
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </Link>
          <button
            onClick={signOut}
            className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </nav>
  );
}
