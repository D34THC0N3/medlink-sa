import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Risk, ApptStatus } from './types'

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const RISK_STYLE: Record<Risk, string> = {
  low: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
  stable: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
  mild: 'text-amber-700 bg-amber-50 ring-amber-600/20',
  moderate: 'text-orange-700 bg-orange-50 ring-orange-600/20',
  high: 'text-red-700 bg-red-50 ring-red-600/20',
  critical: 'text-red-800 bg-red-100 ring-red-700/30'
}

export const STATUS_STYLE: Record<ApptStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  'checked-in': 'bg-indigo-100 text-indigo-700',
  upcoming: 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-amber-100 text-amber-700',
  rescheduled: 'bg-purple-100 text-purple-700'
}

export function Field({
  label,
  children,
  className
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

export function ChartTooltip({
  active,
  payload,
  label,
  unit
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  unit?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-slate-900">{label}</p>
      <p className="text-slate-600">
        {payload[0].value}
        {unit ?? ''}
      </p>
    </div>
  )
}

export function NotifToggle({
  on,
  onToggle
}: {
  on: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
        on ? 'bg-blue-600' : 'bg-slate-200'
      )}
      aria-label="Toggle"
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
          on ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export function ControlBtn({
  children,
  active,
  onClick,
  className
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
        active
          ? 'border-blue-200 bg-blue-50 text-blue-700'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        className
      )}
    >
      {children}
    </button>
  )
}

export function SoapBlock({
  label,
  color,
  children
}: {
  label: string
  color: string
  children: React.ReactNode
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700'
  }
  return (
    <div className="space-y-2">
      <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide', colorMap[color] ?? 'bg-slate-100 text-slate-600')}>
        {label}
      </span>
      <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
    </div>
  )
}

export function InfoTile({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-white p-4 space-y-2">
      <div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-xs font-medium uppercase tracking-wide">{label}</span></div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  )
}

export function ScanLine({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" x2="17" y1="12" y2="12" />
    </svg>
  )
}

export function FlaskConical({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.5 2v5.1a2 2 0 0 1-.6 1.4L6 10.5a1.4 1.4 0 0 0-.4 1.1v.8a2 2 0 0 0 .6 1.4l5.8 5.8a2 2 0 0 0 1.4.6h.8a1.4 1.4 0 0 0 1.1-.4l2-2a2 2 0 0 0 .6-1.4V12a1.4 1.4 0 0 0-.4-1.1L15.5 8.5a2 2 0 0 1-.6-1.4V2" /><path d="M14 2h6" />
    </svg>
  )
}

export function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
    </svg>
  )
}
