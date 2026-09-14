'use client'

import { useState, useRef, useEffect } from 'react'
import { askCopilot } from '@/lib/api'
import Badge from '@/components/Badge'
import { Bot, Send, User, Zap } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

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

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b)/)
  return (
    <span>
      {parts.map((part, i) => {
        if (/^[A-Z][a-z]+/.test(part) && part.length > 2 && !['The','This','That','These','Those','When','What','Who','How','Why','Where'].includes(part)) {
          return <span key={i} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

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
        gap: 10,
        marginBottom: 16,
        opacity: 0, animationFillMode: 'forwards'
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? 'rgba(99, 102, 241, 0.2)' : 'rgba(59, 130, 246, 0.2)',
        border: `1px solid ${isUser ? 'rgba(99, 102, 241, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
      }}>
        {isUser
          ? <User size={14} color="var(--accent-primary)" />
          : <Bot size={14} color="#3b82f6" />
        }
      </div>

      <div style={{ maxWidth: '75%' }}>
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
          {isUser
            ? <p style={{ fontSize: 'var(--font-xs)', lineHeight: 1.5 }}>{message.content}</p>
            : <p style={{ fontSize: 'var(--font-xs)', lineHeight: 1.6 }}><HighlightedText text={message.content} /></p>
          }
        </div>
        <p style={{
          fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4,
          textAlign: isUser ? 'right' : 'left'
        }}>
          {timeStr}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(59, 130, 246, 0.2)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        flexShrink: 0
      }}>
        <Bot size={14} color="#3b82f6" />
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

function WelcomeScreen() {
  return (
    <div style={{ textAlign: 'center', padding: '55px 21px' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 21px',
        background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Bot size={30} color="var(--accent-primary)" />
      </div>
      <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
        ORKA Copilot Intelligence
      </h3>
      <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
        Ask me anything about team cognitive load, project slippage risks, optimal skill delegation, or sprint progress.
      </p>
    </div>
  )
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
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
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="section-title">AI Copilot</h1>
          <Badge variant="purple">Neural LLM</Badge>
        </div>
        <p className="section-subtitle">Real-time organizational intelligence & predictive query assistant</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 21, minHeight: 'calc(100vh - 240px)' }}>
        <div className="glass-card p-5" style={{ height: 'fit-content' }}>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 13 }}>
            <Zap size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} color="var(--accent-primary)" />
            Suggested Prompts
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                disabled={loading}
                style={{
                  padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)',
                  fontSize: 'var(--font-xs)', cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', transition: 'all 150ms', lineHeight: 1.4,
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(99, 102, 241, 0.08)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99, 102, 241, 0.25)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '21px' }}>
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

          <div style={{
            padding: '16px 21px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', gap: 12, alignItems: 'center',
            background: '#ffffff'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={inputRef}
                className="orka-input"
                style={{ paddingRight: 44, fontSize: 'var(--font-xs)' }}
                placeholder="Ask ORKA Copilot anything about team telemetry..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </div>
            <button
              className="btn-primary"
              style={{ padding: '10px 18px', minWidth: 'auto', flexShrink: 0 }}
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              {loading
                ? <div className="typing-dot" style={{ width: 6, height: 6 }} />
                : <Send size={16} />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

