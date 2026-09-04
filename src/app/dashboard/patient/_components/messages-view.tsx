'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, MessageSquare, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/lang-context'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

type Draft = { text: string }

type Thread = {
  id: string
  name: string
  role: string
  unread: number
  messages: Array<{ sender: 'user' | 'doctor'; text: string; time: string }>
}

const THREADS: Thread[] = [
  {
    id: '1',
    name: 'Dr. Sipho Dlamini',
    role: 'Cardiology',
    unread: 2,
    messages: [
      { sender: 'doctor', text: 'Hi, just reviewed your latest results.', time: '10:30 AM' },
      { sender: 'doctor', text: 'Your blood work looks good. Let\'s adjust your dosage.', time: '10:32 AM' },
    ],
  },
  {
    id: '2',
    name: 'MedLink Pharmacy',
    role: 'Pharmacy',
    unread: 0,
    messages: [
      { sender: 'doctor', text: 'Your prescription is ready for collection.', time: '9:15 AM' },
    ],
  },
  {
    id: '3',
    name: 'Dr. Thandi Nkosi',
    role: 'General Practitioner',
    unread: 0,
    messages: [
      { sender: 'doctor', text: 'See you at your next appointment.', time: 'Yesterday' },
    ],
  },
]

export function MessagesView() {
  const { t } = useLang()
  const [active, setActive] = useState(THREADS[0]?.id ?? '')
  const [draft, setDraft] = useState<Draft>({ text: '' })
  const [msgs, setMsgs] = useState<Record<string, Array<Thread['messages'][0]>>>({})
  const [mobileOpen, setMobileOpen] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const threadMessages = useMemo(() => {
    const t = THREADS.find(x => x.id === active)
    return msgs[active] ?? t?.messages ?? []
  }, [active, msgs])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages])

  const send = () => {
    if (!draft.text.trim()) return
    const userMsg = { sender: 'user' as const, text: draft.text.trim(), time: 'now' }
    setMsgs(prev => ({ ...prev, [active]: [...(prev[active] ?? []), userMsg] }))
    setDraft({ text: '' })
    setTimeout(() => {
      setMsgs(prev => ({ ...prev, [active]: [...(prev[active] ?? []), { sender: 'doctor', text: t('patient.messages.autoReply'), time: 'now' }] }))
    }, 1200)
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t('patient.messages.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('patient.messages.subtitle')}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          {mobileOpen ? t('common.close') : t('patient.messages.threads')}
        </Button>
      </div>

      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 14rem)' }}>
        {/* Thread list — desktop: always visible, mobile: toggled */}
        <div className={cn(
          'w-full shrink-0 rounded-2xl border border-border bg-card p-3 lg:w-72',
          mobileOpen ? 'block' : 'hidden lg:block'
        )}>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('patient.messages.searchPlaceholder')}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            {THREADS.map(thread => (
              <button
                key={thread.id}
                onClick={() => { setActive(thread.id); setMobileOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-sm transition hover:bg-muted',
                  active === thread.id && 'bg-primary/10 text-primary'
                )}
              >
                <span className="line-clamp-1 flex-1">{thread.name}</span>
                {thread.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {thread.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active thread */}
        <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{THREADS.find(x => x.id === active)?.name}</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {threadMessages.map((m, i) => (
              <div key={i} className={cn('flex', m.sender === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-xs rounded-2xl px-4 py-2 text-sm', m.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  {m.text}
                  <div className="mt-0.5 text-[10px] opacity-60">{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={draft.text}
              onChange={e => setDraft({ text: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('patient.messages.typePlaceholder')}
              className="h-9 flex-1 text-sm"
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={send} disabled={!draft.text.trim()} aria-label={t('patient.messages.send')}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
