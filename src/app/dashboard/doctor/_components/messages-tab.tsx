'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MessageCircle, Search, Send, Paperclip, Smile, Phone, Video,
  MoreHorizontal, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { fadeUp } from './shared'
import type { Conversation } from './types'
import { CONVERSATIONS } from './mock-data'

export function MessagesTab() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(CONVERSATIONS[0] ?? null)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<Record<string, Array<{ from: string; text: string; time: string }>>>({})
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!search) return CONVERSATIONS
    return CONVERSATIONS.filter(c =>
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const currentMessages = useMemo(() => {
    if (!selectedConvo) return []
    return messages[selectedConvo.id] ?? [
      { from: 'patient', text: selectedConvo.lastMessage, time: selectedConvo.lastTime },
      { from: 'doctor', text: 'Thank you, I will review this shortly.', time: '10:30 AM' }
    ]
  }, [selectedConvo, messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  const handleSend = () => {
    if (!messageText.trim() || !selectedConvo) return
    const newMsg = { from: 'doctor', text: messageText.trim(), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => ({
      ...prev,
      [selectedConvo.id]: [...(prev[selectedConvo.id] ?? []), newMsg]
    }))
    setMessageText('')
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConvo.id]: [...(prev[selectedConvo.id] ?? []), { from: 'patient', text: 'Thank you, doctor.', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]
      }))
    }, 2000)
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="h-[calc(100vh-12rem)]">
      <div className="flex h-full rounded-2xl border overflow-hidden bg-card">
        {/* Sidebar — desktop: always visible, mobile: toggled */}
        <div className={cn(
          'w-full border-r flex flex-col md:w-80',
          mobileOpen ? 'flex' : 'hidden md:flex'
        )}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Messages</h2>
              <span className="text-xs text-muted-foreground">{CONVERSATIONS.filter(c => c.unread > 0).length} unread</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <Button
                key={c.id}
                variant="ghost"
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 h-auto text-left border-b justify-start rounded-none hover:bg-muted',
                  selectedConvo?.id === c.id && 'bg-primary/10 hover:bg-primary/10'
                )}
                onClick={() => { setSelectedConvo(c); setMobileOpen(false) }}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {c.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">{c.patientName}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{c.lastTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1 shrink-0">
                    {c.unread}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedConvo ? (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle sidebar">
                    {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {selectedConvo.patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{selectedConvo.patientName}</p>
                    <p className="text-[11px] text-muted-foreground">{selectedConvo.patientEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Call patient"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Video call"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {currentMessages.map((m, i) => (
                  <div key={i} className={cn('flex', m.from === 'doctor' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%] rounded-2xl px-4 py-2.5 text-sm',
                      m.from === 'doctor'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}>
                      <p>{m.text}</p>
                      <p className={cn('text-[10px] mt-1', m.from === 'doctor' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-5 py-3 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Attach file">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 h-9 text-sm"
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Emoji">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
