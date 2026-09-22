"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Leaf,
  Menu,
  PackageCheck,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";

const stats = [
  ["8.4K+", "kg recycled this month"],
  ["125+", "verified collection partners"],
  ["12", "cities connected"],
  ["96%", "on-time pickup score"],
];

const pathways = [
  {
    icon: Truck,
    title: "For households",
    text: "Schedule a pickup in minutes, follow its status, and see your environmental impact grow.",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: PackageCheck,
    title: "For collectors",
    text: "Build efficient routes, manage requests and list collected material for verified recyclers.",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    icon: BarChart3,
    title: "For recyclers & teams",
    text: "Secure reliable supply, monitor performance, and run your circular operation from one workspace.",
    accent: "bg-sky-100 text-sky-700",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfdfb] text-slate-900">
      <nav className="sticky top-0 z-40 border-b border-emerald-950/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
          <Brand />
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a
              className="transition hover:text-emerald-700"
              href="#how-it-works"
            >
              How it works
            </a>
            <a className="transition hover:text-emerald-700" href="#roles">
              Who it&apos;s for
            </a>
            <a className="transition hover:text-emerald-700" href="#impact">
              Our impact
            </a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-forest transition hover:bg-emerald-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(7,95,73,.2)] transition hover:-translate-y-0.5 hover:bg-[#064c3b]"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl p-2 text-forest md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-emerald-950/5 bg-white px-5 py-4 md:hidden">
            <div className="mx-auto grid max-w-7xl gap-1 text-sm font-semibold text-slate-700">
              <a
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-emerald-50"
                href="#how-it-works"
              >
                How it works
              </a>
              <a
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-emerald-50"
                href="#roles"
              >
                Who it&apos;s for
              </a>
              <a
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-emerald-50"
                href="#impact"
              >
                Our impact
              </a>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-emerald-100 pt-3">
                <Link
                  href="/login"
                  className="rounded-xl border border-emerald-100 px-3 py-2.5 text-center text-forest"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-forest px-3 py-2.5 text-center text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative isolate overflow-hidden bg-[#eaf8ef]">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-lime/40 blur-3xl" />
        <div className="absolute -right-36 top-0 h-[30rem] w-[30rem] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-2 text-xs font-extrabold tracking-wide text-emerald-700 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              INDIA&apos;S SMART RECYCLING NETWORK
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-6 max-w-3xl text-5xl font-black leading-[.98] tracking-[-.055em] text-forest sm:text-6xl lg:text-7xl"
            >
              Give every kilo a{" "}
              <span className="text-emerald-600">better next life.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg"
            >
              KabadiConnect brings citizens, collectors and recyclers into one
              trusted, real-time network. Pickup, material, teams and impact—all
              connected.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-forest px-5 py-3.5 text-sm font-bold text-white shadow-[0_15px_30px_rgba(7,95,73,.24)] transition hover:-translate-y-0.5 hover:bg-[#064c3b]"
              >
                Join the network{" "}
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-bold text-forest transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                See how it works <ChevronRight size={17} />
              </a>
            </motion.div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" /> Verified
                partners
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" /> Live
                pickup tracking
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />{" "}
                Transparent impact
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute inset-7 rounded-[2.5rem] bg-emerald-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_30px_70px_rgba(7,95,73,.15)] backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
                    Network pulse
                  </p>
                  <h2 className="mt-1 text-xl font-black text-forest">
                    Today&apos;s circular flow
                  </h2>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Sparkles size={21} />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center">
                <MiniMetric value="24" label="Pickups" />
                <MiniMetric value="482" label="kg moved" />
                <MiniMetric value="18" label="Partners" />
              </div>
              <div className="mt-5 space-y-3">
                <FlowRow
                  icon={<UsersRound size={17} />}
                  label="Citizen request"
                  detail="Plastic & paper · 8 kg"
                  color="bg-emerald-50 text-emerald-600"
                  status="Scheduled"
                />
                <div className="ml-5 h-3 border-l border-dashed border-emerald-200" />
                <FlowRow
                  icon={<Truck size={17} />}
                  label="Collector assigned"
                  detail="Pickup at 5:30 PM"
                  color="bg-amber-50 text-amber-600"
                  status="On route"
                />
                <div className="ml-5 h-3 border-l border-dashed border-emerald-200" />
                <FlowRow
                  icon={<Recycle size={17} />}
                  label="Material recovered"
                  detail="Verified for recycling"
                  color="bg-sky-50 text-sky-600"
                  status="Tracked"
                />
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-forest px-4 py-3.5 text-white">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />{" "}
                  Live network
                </span>
                <span className="text-xs text-emerald-200">Updating now</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="impact" className="border-y border-emerald-100 bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-emerald-100 px-5 py-3 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 md:px-8">
          {stats.map(([value, label]) => (
            <div className="px-4 py-5 text-center" key={label}>
              <p className="text-2xl font-black tracking-tight text-forest">
                {value}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="roles"
        className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-600">
            One connected platform
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-forest md:text-5xl">
            Made for everyone who keeps material moving.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Start with the role that fits you today. Your dashboard keeps the
            right work, data and actions together.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pathways.map(({ icon: Icon, title, text, accent }, index) => (
            <motion.article
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group rounded-3xl border border-emerald-950/5 bg-white p-6 shadow-[0_12px_35px_rgba(7,95,73,.05)]"
              key={title}
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${accent}`}
              >
                <Icon size={22} />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[.15em] text-slate-400">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-xl font-black text-forest">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition group-hover:gap-2.5"
              >
                Create account <ArrowRight size={15} />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-forest px-5 py-20 text-white md:px-8 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-lime">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.035em] md:text-5xl">
              From doorstep to next life, completely visible.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-emerald-100">
              No calls, no guesswork, no disconnected records. Every role gets a
              clear next step and real-time updates.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-forest transition hover:bg-[#d7ff91]"
            >
              Get started free <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            <Step
              index="01"
              title="Create your account"
              text="Choose citizen, collector or recycler and enter your details securely."
              icon={<ShieldCheck size={20} />}
            />
            <Step
              index="02"
              title="Do the work that matters"
              text="Request a pickup, manage a route, list material or guide your field team."
              icon={<Truck size={20} />}
            />
            <Step
              index="03"
              title="Track progress and impact"
              text="Live status, verified activity and meaningful reporting stay available in your dashboard."
              icon={<BarChart3 size={20} />}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-emerald-50 to-lime-50 p-8 text-center md:p-14">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            <Leaf size={23} />
          </div>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black tracking-[-.035em] text-forest md:text-5xl">
            Your next pickup can start a bigger cycle.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Join a verified local network that makes recycling easier to trust,
            manage and measure.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-forest px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#064c3b]"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-bold text-forest transition hover:bg-emerald-50"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-emerald-950/5 bg-white px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <Brand />
          <p className="flex items-center gap-2">
            <Leaf size={15} className="text-emerald-600" /> Every kilo has a
            next life.
          </p>
        </div>
      </footer>
    </main>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lime shadow-sm">
        <Recycle size={21} />
      </span>
      <span>
        <b className="block leading-4 text-forest">KabadiConnect</b>
        <small className="text-[11px] font-medium text-slate-500">
          India&apos;s circular network
        </small>
      </span>
    </Link>
  );
}
function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block text-lg font-black text-forest">{value}</b>
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
    </div>
  );
}
function FlowRow({
  icon,
  label,
  detail,
  color,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  color: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${color}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <b className="block text-sm text-forest">{label}</b>
        <small className="block truncate text-xs text-slate-500">
          {detail}
        </small>
      </span>
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
        {status}
      </span>
    </div>
  );
}
function Step({
  index,
  title,
  text,
  icon,
}: {
  index: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime text-forest">
        {icon}
      </span>
      <div>
        <span className="text-xs font-bold tracking-[.14em] text-lime">
          {index}
        </span>
        <h3 className="mt-1 text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-emerald-100">{text}</p>
      </div>
    </div>
  );
}
