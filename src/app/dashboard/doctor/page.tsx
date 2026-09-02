'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Activity, Users, Calendar, ClipboardList, MessageCircle, Video, Settings, FileText, Pill, Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

import type { TabId } from './_components/types'

const OverviewTab = dynamic(() => import('./_components/overview-tab').then(m => ({ default: m.OverviewTab })), { ssr: false })
const ScheduleTab = dynamic(() => import('./_components/schedule-tab').then(m => ({ default: m.ScheduleTab })), { ssr: false })
const PatientsTab = dynamic(() => import('./_components/patients-tab').then(m => ({ default: m.PatientsTab })), { ssr: false })
const PrescriptionsTab = dynamic(() => import('./_components/prescriptions-tab').then(m => ({ default: m.PrescriptionsTab })), { ssr: false })
const VideoTab = dynamic(() => import('./_components/video-tab').then(m => ({ default: m.VideoTab })), { ssr: false })
const NotesTab = dynamic(() => import('./_components/notes-tab').then(m => ({ default: m.NotesTab })), { ssr: false })
const MessagesTab = dynamic(() => import('./_components/messages-tab').then(m => ({ default: m.MessagesTab })), { ssr: false })
const SettingsTab = dynamic(() => import('./_components/settings-tab').then(m => ({ default: m.SettingsTab })), { ssr: false })

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'consults', label: 'Consults', icon: Video },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function DoctorDashboardPage() {
  const { user, updateUser, signOut } = useAuth()
  const [tab, setTab] = useState<TabId>('overview')

  const goToTab = (t: string) => setTab(t as TabId)

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return <OverviewTab goToTab={goToTab} />
      case 'schedule':
        return <ScheduleTab />
      case 'patients':
        return <PatientsTab goToTab={goToTab} />
      case 'prescriptions':
        return <PrescriptionsTab />
      case 'consults':
        return <VideoTab goToTab={goToTab} />
      case 'notes':
        return <NotesTab />
      case 'messages':
        return <MessagesTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab goToTab={goToTab} />
    }
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <nav className="flex gap-1 rounded-xl bg-slate-100 p-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap',
                tab === t.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              )}
            >
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>

        {renderTab()}
      </div>
    </DashboardLayout>
  )
}
