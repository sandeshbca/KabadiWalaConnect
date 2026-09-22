"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole, Recycle } from "lucide-react";
import { apiRoles, Role, roleRoutes } from "@/lib/types";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const roles: { value: Role; description: string }[] = [
  { value: "Citizen", description: "Book and track pickups" },
  { value: "Collector", description: "Manage route and stock" },
  { value: "Recycler", description: "Source verified material" },
];

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("Citizen");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const registering = mode === "register";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = registering
      ? {
          name: String(form.get("name") || "").trim(),
          phone: String(form.get("phone") || "").trim(),
          password: String(form.get("password") || ""),
          role: role.toLowerCase(),
          location: { area: String(form.get("area") || "").trim() },
        }
      : {
          phone: String(form.get("phone") || "").trim(),
          password: String(form.get("password") || ""),
        };

    try {
      const response = await fetch(`${api}/api/auth/${registering ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "We could not complete your request. Please try again.");
      const signedInRole = apiRoles[result.user.role as keyof typeof apiRoles];
      if (!signedInRole) throw new Error("Your account has an unsupported role.");
      sessionStorage.setItem("kc_token", result.token);
      sessionStorage.setItem("kc_user", JSON.stringify(result.user));
      router.replace(roleRoutes[signedInRole]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to continue. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#eef9f2] p-5">
      <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-lime/45 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-200/70 blur-3xl" />
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_rgba(7,95,73,.16)] backdrop-blur md:grid-cols-[.85fr_1.15fr]">
        <aside className="hidden bg-forest p-9 text-white md:block">
          <Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-forest"><Recycle size={22} /></span><span><b className="block">KabadiConnect</b><small className="text-emerald-200">India&apos;s circular network</small></span></Link>
          <div className="mt-20"><p className="text-xs font-bold uppercase tracking-[.16em] text-lime">Built for better recycling</p><h1 className="mt-3 text-4xl font-black leading-tight">One account.<br />A clearer next step.</h1><p className="mt-5 leading-7 text-emerald-100">From a household pickup to team operations, the whole circular journey stays connected.</p></div>
          <div className="mt-12 space-y-3 text-sm text-emerald-100"><p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-lime" /> Secure, role-based access</p><p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-lime" /> Real-time work updates</p><p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-lime" /> Measurable impact</p></div>
        </aside>
        <div className="p-6 sm:p-9">
          <Link href="/" className="flex items-center gap-3 md:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lime"><Recycle size={20} /></span><span><b className="block leading-4 text-forest">KabadiConnect</b><small className="text-[11px] text-slate-500">India&apos;s circular network</small></span></Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-emerald-600 md:mt-0">{registering ? "Join the network" : "Secure sign in"}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-forest">{registering ? "Create your account" : "Welcome back"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{registering ? "Pick your role now—you will get the right workspace immediately after registration." : "Sign in to continue to your role-specific dashboard."}</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            {registering && <><Field name="name" label="Full name" placeholder="Your name" autoComplete="name" /><Field name="area" label="Your area" placeholder="e.g. HSR Layout, Bengaluru" autoComplete="address-level2" /></>}
            <Field name="phone" label="Mobile number" placeholder="10-digit mobile number" type="tel" autoComplete="tel" pattern="[6-9][0-9]{9}" />
            <Field name="password" label="Password" placeholder="At least 8 characters" type="password" autoComplete={registering ? "new-password" : "current-password"} minLength={8} />
            {registering && <fieldset><legend className="mb-2 text-sm font-bold text-forest">I&apos;m joining as a</legend><div className="grid gap-2 sm:grid-cols-3">{roles.map((item) => <button key={item.value} type="button" onClick={() => setRole(item.value)} className={`rounded-xl border p-3 text-left transition ${role === item.value ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-slate-200 hover:border-emerald-200"}`}><b className="block text-sm text-forest">{item.value}</b><span className="mt-1 block text-[11px] leading-4 text-slate-500">{item.description}</span></button>)}</div></fieldset>}
            {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest p-3.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(7,95,73,.16)] transition hover:bg-[#064c3b] disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Please wait…" : registering ? "Create account" : "Login securely"}<ArrowRight size={17} /></button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">{registering ? "Already registered?" : "New to KabadiConnect?"} <Link className="font-bold text-emerald-700 hover:text-emerald-900" href={registering ? "/login" : "/register"}>{registering ? "Login" : "Create account"}</Link></p>
          <p className="mt-5 flex justify-center gap-1.5 text-xs text-slate-400"><LockKeyhole size={14} /> Your account is protected with secure authentication.</p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, placeholder, type = "text", autoComplete, minLength, pattern }: { label: string; name: string; placeholder: string; type?: string; autoComplete?: string; minLength?: number; pattern?: string }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-bold text-forest">{label}</span><input required name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} minLength={minLength} pattern={pattern} className="field rounded-xl border-slate-200 px-3.5 py-3 text-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" /></label>;
}
