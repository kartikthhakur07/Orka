'use client'

import { useState, useRef, useEffect } from 'react'
import { askCopilot } from '@/lib/api'
import { Bot, Send, User, Zap, AlertTriangle } from 'lucide-react'

/* ── Types ────────────────────────────────────────────────────────────── */
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/* ── Suggested Questions ──────────────────────────────────────────────── */
const SUGGESTIONS = [
  'Why is Payment Module delayed?',
  'Who is most burned out?',
  'Who should I assign ML tasks to?',
  'How is the sprint going?',
  'Who should WFH this week?',
  'Which project is at risk?',
  'Who is most productive?',
  'What skills are missing?',
]

/* ── Highlight names/keywords in AI response ──────────────────────────── */
function HighlightedText({ text }: { text: string }) {
  // Simple heuristic: highlight proper nouns (capitalized words) in orange
  const parts = text.split(/(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b)/)
  return (
    <span>
      {parts.map((part, i) => {
        if (/^[A-Z][a-z]+/.test(part) && part.length > 2 && !['The','This','That','These','Those','When','What','Who','How','Why','Where'].includes(part)) {
          return <span key={i} style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

/* ── Chat Bubble ──────────────────────────────────────────────────────── */
function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const timeStr = message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 16,
        opacity: 0, animationFillMode: 'forwards'
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? 'rgba(249,115,22,0.20)' : 'rgba(168,85,247,0.20)',
        border: `1px solid ${isUser ? 'rgba(249,115,22,0.30)' : 'rgba(168,85,247,0.30)'}`,
      }}>
        {isUser
          ? <User size={14} color="var(--accent-orange)" />
          : <Bot size={14} color="var(--accent-purple)" />
        }
      </div>

      <div style={{ maxWidth: '72%' }}>
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
          {isUser
            ? <p style={{ lineHeight: 1.5 }}>{message.content}</p>
            : <p style={{ lineHeight: 1.6 }}><HighlightedText text={message.content} /></p>
          }
        </div>
        <p style={{
          fontSize: '0.65rem', color: 'var(--text-faint)', marginTop: 4,
          textAlign: isUser ? 'right' : 'left'
        }}>
          {timeStr}
        </p>
      </div>
    </div>
  )
}

/* ── Typing Indicator ─────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(168,85,247,0.20)',
        border: '1px solid rgba(168,85,247,0.30)',
        flexShrink: 0
      }}>
        <Bot size={14} color="var(--accent-purple)" />
      </div>
      <div className="chat-bubble-ai" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  )
}

/* ── Welcome Message ──────────────────────────────────────────────────── */
function WelcomeScreen() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
        background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Bot size={28} color="var(--accent-purple)" />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
        ORKA AI Copilot
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 320, margin: '0 auto' }}>
        Ask me anything about your team's performance, projects, deadlines, or workload.
      </p>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(false)

    try {
      const res = await askCopilot({ question: text, query: text, message: text })
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.answer || res.response || res.message || JSON.stringify(res),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setError(true)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Backend is offline. Please start the server with: uvicorn main:app --reload',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="section-title">🤖 AI Project Copilot</h1>
        <p className="section-subtitle">Ask anything about your team, projects, and performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, height: 'calc(100vh - 200px)' }}>
        {/* ── Left: Suggestions ── */}
        <div className="glass-card p-4" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 12 }}>
            <Zap size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Suggested
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                disabled={loading}
                style={{
                  padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)',
                  fontSize: '0.78rem', cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', transition: 'all 150ms', lineHeight: 1.4,
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    ;(e.target as HTMLButtonElement).style.background = 'rgba(249,115,22,0.08)'
                    ;(e.target as HTMLButtonElement).style.borderColor = 'rgba(249,115,22,0.20)'
                    ;(e.target as HTMLButtonElement).style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={e => {
                  ;(e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'
                  ;(e.target as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'
                  ;(e.target as HTMLButtonElement).style.color = 'var(--text-secondary)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Chat ── */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {messages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <>
                {messages.map(m => <ChatBubble key={m.id} message={m} />)}
                {loading && <TypingIndicator />}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', gap: 10, alignItems: 'center'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={inputRef}
                className="orka-input"
                style={{ paddingRight: 44, fontSize: '0.9rem' }}
                placeholder="Ask ORKA anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </div>
            <button
              className="btn-primary"
              style={{ padding: '10px 16px', minWidth: 'auto', flexShrink: 0 }}
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              {loading
                ? <div className="typing-dot" style={{ width: 5, height: 5 }} />
                : <Send size={16} />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
