"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
export type { TabId } from "./types";
import type { TabId, BedStatus } from "./types";
import {
  LayoutDashboard,
  BedDouble,
  ListOrdered,
  Users,
  UserCheck,
  Building2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------- Animation variants ---------- */

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* ---------- Bed status styles ---------- */

export const BED_STATUS_META: Record<
  BedStatus,
  { label: string; tile: string; dot: string; ring: string; chart: string; text: string }
> = {
  occupied: {
    label: "Occupied",
    tile: "bg-rose-500/90 border-rose-400/50 text-white",
    dot: "bg-rose-500",
    ring: "ring-rose-500/40",
    chart: "#f43f5e",
    text: "text-rose-500",
  },
  available: {
    label: "Available",
    tile: "bg-emerald-500/90 border-emerald-400/50 text-white",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/40",
    chart: "#10b981",
    text: "text-emerald-500",
  },
  cleaning: {
    label: "Cleaning",
    tile: "bg-amber-500/90 border-amber-400/50 text-white",
    dot: "bg-amber-500",
    ring: "ring-amber-500/40",
    chart: "#f59e0b",
    text: "text-amber-500",
  },
  reserved: {
    label: "Reserved",
    tile: "bg-violet-500/90 border-violet-400/50 text-white",
    dot: "bg-violet-500",
    ring: "ring-violet-500/40",
    chart: "#8b5cf6",
    text: "text-violet-500",
  },
};

/* ---------- Tab bar ---------- */

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "beds", label: "Beds & wards", icon: BedDouble },
  { id: "queue", label: "Queue", icon: ListOrdered },
  { id: "staff", label: "Staff", icon: Users },
  { id: "approvals", label: "Approvals", icon: UserCheck },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function TabBar({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <div className="glass-panel -mx-1 flex gap-1 overflow-x-auto rounded-2xl p-1.5">
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <Button
            key={t.id}
            onClick={() => setTab(t.id)}
            variant="ghost"
            className={cn(
              "relative shrink-0 gap-2 rounded-xl px-3.5 py-2 text-sm font-medium",
              active
                ? "text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            )}
            aria-current={active ? "page" : undefined}
            aria-label={t.label}
          >
            {active && (
              <motion.span
                layoutId="hospital-tab-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-medical to-cyan-500 shadow-[0_6px_20px_var(--glow-1)]"
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10 whitespace-nowrap">{t.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

/* ---------- Section header ---------- */

export function SectionHeader({
  kicker,
  icon: Icon,
  title,
  subtitle,
}: {
  kicker: string;
  icon: React.ElementType;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-medical">
        <Icon className="h-3.5 w-3.5" />
        {kicker}
      </div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/* ---------- View header ---------- */

export function ViewHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-medical/15 to-cyan-400/15 text-medical">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------- Stat card ---------- */

export function StatCard({
  label,
  value,
  hint,
  trend,
  trendDir,
  icon: Icon,
  accent,
  ariaLabel,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
  trendDir?: "up" | "down" | "flat";
  icon: React.ElementType;
  accent: string;
  ariaLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="stat-card relative"
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-bold tracking-tight">
            {value}
          </div>
          {hint && (
            <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
          )}
        </div>
        <span
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{
            background: `color-mix(in oklab, ${accent} 15%, transparent)`,
            color: accent,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trendDir === "up" && (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
          )}
          {trendDir === "down" && (
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
          )}
          <span
            className={
              trendDir === "up"
                ? "text-emerald-500"
                : trendDir === "down"
                ? "text-rose-500"
                : "text-muted-foreground"
            }
          >
            {trend}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ---------- Glass tooltip ---------- */

export function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs shadow-xl">
      {label && <div className="mb-1 font-semibold">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Status pill ---------- */

export function StatusPill({
  tone,
  children,
}: {
  tone: "emerald" | "rose" | "amber" | "violet" | "medical" | "slate";
  children: React.ReactNode;
}) {
  const cls = {
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    rose: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    medical: "border-medical/20 bg-medical/10 text-medical",
    slate: "border-border/60 bg-foreground/5 text-muted-foreground",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold",
        cls
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Toggle row ---------- */

export function ToggleRow({
  icon: Icon,
  title,
  desc,
  checked,
  onCheckedChange,
  tone = "medical",
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  tone?: "medical" | "amber" | "emerald";
}) {
  const toneCls = {
    medical: "text-medical bg-medical/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  }[tone];
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", toneCls)}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-[0.7rem] text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-6 w-11 cursor-pointer rounded-full transition-colors",
          checked ? "bg-medical" : "bg-foreground/20"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </div>
    </div>
  );
}
