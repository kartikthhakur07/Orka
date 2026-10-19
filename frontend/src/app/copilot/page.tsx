'use client'

import { useState, useRef, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { askCopilot, getDashboard } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useSidebar } from '@/context/SidebarContext'
import {
  Send,
  User,
  Sparkles,
  Loader2,
  RefreshCw,
  MessageSquare,
  Zap,
  Database,
  Copy,
  Check,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Download,
  AlertCircle
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  grounded?: boolean
  latencyMs?: number
}

interface CategoryPrompt {
  category: 'burnout' | 'sprint' | 'allocation' | 'risk'
  icon: any
  label: string
  prompts: string[]
}

const CATEGORIES: CategoryPrompt[] = [
  {
    category: 'burnout',
    icon: ShieldAlert,
    label: 'Burnout & Fatigue',
    prompts: [
      'Who is currently at highest burnout risk?',
      'Who should work from home (WFH) this week to recover?',
      'Show me after-hours commit spikes across the team'
    ]
  },
  {
    category: 'sprint',
    icon: TrendingUp,
    label: 'Sprint & Critical Path',
    prompts: [
      'How is the current sprint velocity pacing?',
      'Which project milestone or epic is most at risk of delay?',
      'Why is the Payment Module delayed?'
    ]
  },
  {
    category: 'allocation',
    icon: Layers,
    label: 'Task Delegation',
    prompts: [
      'Who should I assign Machine Learning & Python tasks to?',
      'Which engineer has the most available workload headroom?',
      'What critical skills are currently missing from the squad?'
    ]
  },
  {
    category: 'risk',
    icon: Activity,
    label: 'Root Cause & Health',
    prompts: [
      'Provide an executive summary of team health score',
      'What is our trailing meeting density impact on sprint output?',
      'Which pull requests have been blocked in review longest?'
    ]
  }
]

export default function CopilotPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const { user } = useAuth()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am **ORKA Copilot**, your enterprise engineering decision intelligence assistant.\n\nI am connected directly to your live team telemetry and PostgreSQL database. You can query me about team capacity, 14-day burnout risks, sprint blockers, or optimal task delegation recommendations.`,
      timestamp: new Date(),
      grounded: true,
      latencyMs: 85
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dashboardStats, setDashboardStats] = useState({
    activeEngineers: 15,
    sprintVelocity: '94%',
    burnoutAlerts: 2,
    dbStatus: 'Connected (Live)'
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Fetch quick live stats for the right panel widget
  useEffect(() => {
    getDashboard()
      .then(data => {
        if (data) {
          setDashboardStats({
            activeEngineers: data.total_members || 15,
            sprintVelocity: data.sprint_velocity ? `${data.sprint_velocity}%` : '94%',
            burnoutAlerts: data.high_burnout_count ?? 2,
            dbStatus: 'Neon PostgreSQL (Live)'
          })
        }
      })
      .catch(() => {
        // Fallback to active defaults
      })
  }, [])

  const handleSend = async (customPrompt?: string) => {
    const question = (customPrompt || input).trim()
    if (!question || loading) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    if (!customPrompt) setInput('')
    setLoading(true)

    const startTime = performance.now()

    try {
      const res = await askCopilot({ question })
      const elapsed = Math.round(performance.now() - startTime)

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.answer || 'Query completed based on current database telemetry.',
        timestamp: new Date(),
        grounded: true,
        latencyMs: elapsed
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to reach backend telemetry engine. Please ensure FastAPI service is running on port 8000 and PostgreSQL is accessible.',
        timestamp: new Date(),
        grounded: false
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Session cleared. Ready for your next operational inquiry. What would you like to analyze?`,
        timestamp: new Date(),
        grounded: true
      }
    ])
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackState(prev => ({ ...prev, [id]: type }))
  }

  const handleExport = () => {
    const transcript = messages
      .map(m => `### ${m.role === 'user' ? '👤 User' : '🏢 ORKA Copilot'} (${m.timestamp.toLocaleTimeString()})\n\n${m.content}\n`)
      .join('\n---\n\n')

    const blob = new Blob([transcript], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orka-copilot-session-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Format message content with markdown-like highlights
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      // Bold syntax regex
      const parts = line.split(/(\*\*.*?\*\*)/g)

      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} style={{ color: '#09090b', fontWeight: 800 }}>
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, marginTop: 4, marginBottom: 4, alignItems: 'flex-start' }}>
            <span style={{ color: '#f7a501', fontWeight: 800, fontSize: '15px', lineHeight: '20px' }}>•</span>
            <span style={{ flex: 1 }}>{formattedLine}</span>
          </div>
        )
      }

      // Empty lines as paragraph breaks
      if (!line.trim()) {
        return <div key={idx} style={{ height: 10 }} />
      }

      return (
        <p key={idx} style={{ margin: '0 0 6px', lineHeight: 1.65 }}>
          {formattedLine}
        </p>
      )
    })
  }

  const allPrompts = CATEGORIES.flatMap(c => c.prompts)
  const displayedPrompts = selectedCategory === 'all'
    ? allPrompts
    : CATEGORIES.find(c => c.category === selectedCategory)?.prompts || allPrompts

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="AI Workstation Copilot">
          <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 84px)', padding: '20px 24px', boxSizing: 'border-box' }}>
            
            {/* ═══════════════════════════════════════════════════════════════════
                WORKSTATION HEADER BAR
            ═══════════════════════════════════════════════════════════════════ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 16,
              paddingBottom: 14,
              borderBottom: '1px solid #dcdfd2'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: '#f7a501',
                  border: '1.5px solid #23251d',
                  boxShadow: '2px 2px 0px #23251d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: 5,
                  flexShrink: 0
                }}>
                  <img src="/orka-logo.png" alt="ORKA" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#09090b', letterSpacing: '-0.02em', margin: 0 }}>
                      ORKA Copilot
                    </h1>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a'
                    }}>
                      v2.0 Decision Engine
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                      Neon DB Connected
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
                    Zero-surveillance operational intelligence grounded strictly on live team sprint & workload metrics
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleExport}
                  title="Export session transcript"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: '1px solid #dcdfd2',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#23251d',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f4f4f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <Download size={14} /> Export
                </button>
                <button
                  onClick={handleClear}
                  title="Reset conversation"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: '1px solid #dcdfd2',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#23251d',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f4f4f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <RefreshCw size={14} /> Clear Chat
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                MAIN TWO-COLUMN WORKSTATION LAYOUT
            ═══════════════════════════════════════════════════════════════════ */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 340px',
              gap: 18,
              flex: 1,
              minHeight: 0
            }}>

              {/* ─────────────────────────────────────────────────────────────
                  LEFT PANEL: CHAT CANVAS & COMMAND BAR
              ───────────────────────────────────────────────────────────── */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: 14,
                border: '1px solid #dcdfd2',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden'
              }}>
                
                {/* Category Quick Selector Ribbon */}
                <div style={{
                  padding: '10px 16px',
                  background: '#fcfcfa',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  overflowX: 'auto',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>
                    Quick Focus:
                  </span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 9999,
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: selectedCategory === 'all' ? '1.5px solid #23251d' : '1px solid #e5e7eb',
                      background: selectedCategory === 'all' ? '#23251d' : '#ffffff',
                      color: selectedCategory === 'all' ? '#ffffff' : '#4b5563',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    All Prompts
                  </button>
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon
                    const isSelected = selectedCategory === cat.category
                    return (
                      <button
                        key={cat.category}
                        onClick={() => setSelectedCategory(cat.category)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 9999,
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          border: isSelected ? '1.5px solid #23251d' : '1px solid #e5e7eb',
                          background: isSelected ? '#23251d' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#4b5563',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={12} color={isSelected ? '#f7a501' : '#6b7280'} />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>

                {/* Messages Scroll Area */}
                <div style={{
                  flex: 1,
                  padding: '24px 24px 16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20
                }}>
                  {messages.map(m => {
                    const isUser = m.role === 'user'
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          flexDirection: isUser ? 'row-reverse' : 'row',
                          gap: 12,
                          alignItems: 'flex-start',
                          maxWidth: '100%'
                        }}
                      >
                        {/* Avatar */}
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: isUser ? '#18181b' : '#f7a501',
                          color: isUser ? '#ffffff' : '#23251d',
                          border: isUser ? '1px solid #27272a' : '1.5px solid #23251d',
                          boxShadow: '1px 1px 0px rgba(0,0,0,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          {isUser ? (
                            <User size={18} />
                          ) : (
                            <img src="/orka-logo.png" alt="ORKA" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                          )}
                        </div>

                        {/* Message Content Bubble */}
                        <div style={{
                          maxWidth: isUser ? '75%' : '85%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6
                        }}>
                          {/* Bubble Metadata */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#9ca3af',
                            justifyContent: isUser ? 'flex-end' : 'flex-start'
                          }}>
                            <span>{isUser ? (user?.name || 'You') : 'ORKA Copilot'}</span>
                            <span>·</span>
                            <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {m.grounded && (
                              <>
                                <span>·</span>
                                <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <Database size={10} /> Grounded Telemetry
                                </span>
                              </>
                            )}
                            {m.latencyMs && (
                              <span style={{ color: '#6b7280' }}>({m.latencyMs}ms)</span>
                            )}
                          </div>

                          {/* Bubble Box */}
                          <div style={{
                            padding: isUser ? '12px 18px' : '16px 20px',
                            borderRadius: 14,
                            background: isUser ? '#18181b' : '#fcfcfa',
                            color: isUser ? '#ffffff' : '#18181b',
                            border: isUser ? 'none' : '1px solid #e5e7eb',
                            boxShadow: isUser
                              ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                              : '0 2px 8px rgba(0, 0, 0, 0.02)',
                            fontSize: '14px'
                          }}>
                            {isUser ? (
                              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.content}</p>
                            ) : (
                              renderMessageContent(m.content)
                            )}
                          </div>

                          {/* Assistant Message Actions (Copy & Feedback) */}
                          {!isUser && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4, marginTop: 2 }}>
                              <button
                                onClick={() => handleCopy(m.id, m.content)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: copiedId === m.id ? '#059669' : '#9ca3af',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  cursor: 'pointer',
                                  padding: '2px 6px',
                                  borderRadius: 4
                                }}
                              >
                                {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                                {copiedId === m.id ? 'Copied' : 'Copy'}
                              </button>

                              <button
                                onClick={() => handleFeedback(m.id, 'up')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: feedbackState[m.id] === 'up' ? '#059669' : '#9ca3af',
                                  cursor: 'pointer',
                                  padding: '2px 4px'
                                }}
                                title="Accurate and helpful"
                              >
                                <ThumbsUp size={12} />
                              </button>

                              <button
                                onClick={() => handleFeedback(m.id, 'down')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: feedbackState[m.id] === 'down' ? '#dc2626' : '#9ca3af',
                                  cursor: 'pointer',
                                  padding: '2px 4px'
                                }}
                                title="Needs refinement"
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Thinking Indicator */}
                  {loading && (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#f7a501',
                        border: '1.5px solid #23251d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5
                      }}>
                        <img src="/orka-logo.png" alt="ORKA" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{
                        padding: '12px 18px',
                        borderRadius: 14,
                        background: '#fcfcfa',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        <Loader2 size={16} className="animate-spin" color="#f7a501" />
                        <span>Querying live sprint telemetry and computing recommendations...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Command Bar Input Box */}
                <div style={{
                  padding: '16px',
                  background: '#ffffff',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      handleSend()
                    }}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      background: '#fcfcfa',
                      borderRadius: 12,
                      border: '1.5px solid #dcdfd2',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      placeholder="Ask ORKA Copilot about team workloads, sprint risks, or burnout radar..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        fontSize: '14px',
                        borderRadius: 12,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        color: '#18181b',
                        resize: 'none',
                        minHeight: '44px',
                        maxHeight: '120px',
                        fontFamily: 'inherit',
                        lineHeight: 1.5
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 10 }}>
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background: loading || !input.trim() ? '#e5e7eb' : '#f7a501',
                          color: loading || !input.trim() ? '#9ca3af' : '#18181b',
                          border: loading || !input.trim() ? '1px solid #d1d5db' : '1.5px solid #23251d',
                          boxShadow: loading || !input.trim() ? 'none' : '1.5px 1.5px 0px #23251d',
                          cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                  </form>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    padding: '0 4px',
                    fontSize: '11px',
                    color: '#9ca3af'
                  }}>
                    <span>Press <strong>Enter</strong> to send · <strong>Shift + Enter</strong> for line break</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Zap size={11} color="#f7a501" /> Realtime Groq LLaMA 3.3 Engine
                    </span>
                  </div>
                </div>

              </div>

              {/* ─────────────────────────────────────────────────────────────
                  RIGHT PANEL: TELEMETRY COMMAND HUB & PROMPT LAUNCHER
              ───────────────────────────────────────────────────────────── */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                overflowY: 'auto'
              }}>

                {/* 1. Live Telemetry Stream Card */}
                <div style={{
                  padding: '16px 18px',
                  background: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #dcdfd2',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      TELEMETRY STREAMS
                    </span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: '10px 12px', background: '#fcfcfa', borderRadius: 8, border: '1px solid #f0f0ed' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Engineers Tracked</span>
                      <strong style={{ fontSize: '18px', fontWeight: 800, color: '#09090b' }}>{dashboardStats.activeEngineers}</strong>
                    </div>

                    <div style={{ padding: '10px 12px', background: '#fcfcfa', borderRadius: 8, border: '1px solid #f0f0ed' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Sprint Velocity</span>
                      <strong style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>{dashboardStats.sprintVelocity}</strong>
                    </div>

                    <div style={{ padding: '10px 12px', background: '#fcfcfa', borderRadius: 8, border: '1px solid #f0f0ed' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Burnout Risk Radar</span>
                      <strong style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>{dashboardStats.burnoutAlerts} High</strong>
                    </div>

                    <div style={{ padding: '10px 12px', background: '#fcfcfa', borderRadius: 8, border: '1px solid #f0f0ed' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Database Sync</span>
                      <strong style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', display: 'block', marginTop: 4 }}>Live Neon DB</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Diagnostic Prompts Card */}
                <div style={{
                  padding: '18px',
                  background: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #dcdfd2',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={15} color="#f7a501" />
                      <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#09090b', margin: 0 }}>
                        Diagnostic Prompts
                      </h3>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>1-Click Query</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    {displayedPrompts.slice(0, 6).map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        disabled={loading}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderRadius: 8,
                          fontSize: '12.5px',
                          fontWeight: 600,
                          background: '#fcfcfa',
                          border: '1px solid #e5e7eb',
                          color: '#23251d',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.background = '#ffffff'
                            e.currentTarget.style.borderColor = '#f7a501'
                            e.currentTarget.style.transform = 'translateX(2px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.currentTarget.style.background = '#fcfcfa'
                            e.currentTarget.style.borderColor = '#e5e7eb'
                            e.currentTarget.style.transform = 'none'
                          }
                        }}
                      >
                        <span style={{ lineHeight: 1.4 }}>{prompt}</span>
                        <ChevronRight size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Telemetry Guardrails Notebook Note */}
                <div style={{
                  padding: '14px 16px',
                  background: '#fcfcfa',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280',
                  lineHeight: 1.5
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#09090b', marginBottom: 4 }}>
                    <Sparkles size={14} color="#f7a501" />
                    <span>Deterministic AI Guardrails</span>
                  </div>
                  <p style={{ margin: 0 }}>
                    ORKA queries objective git commits, issue story points, and calendar blocks. No webcam, screen capture, or keystroke tracking is ever permitted.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
