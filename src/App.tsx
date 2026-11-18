import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ChevronDown,
  DotsVertical,
  Mail01,
  Plus,
  SearchLg,
  Send01,
  Settings01,
  Shield01,
  User01,
} from '@untitledui/icons'
import './App.css'
import type { CustomAccount, CustomAccountDraft } from './types/account'
import {
  listCustomAccounts,
  loadAccountPassword,
  removeCustomAccount,
  saveCustomAccount,
} from './lib/account-vault'
import { syncCustomAccount, testCustomAccount } from './lib/mail-api'

const emptyDraft: CustomAccountDraft = {
  label: 'Personal',
  email: '',
  username: '',
  password: '',
  imapHost: '',
  imapPort: 993,
  imapTls: 'ssl',
  smtpHost: '',
  smtpPort: 587,
  smtpTls: 'starttls',
}

function AppShell() {
  return (
    <main className="app-shell">
      <div className="app-frame">
        <Routes>
          <Route path="/" element={<InboxPage />} />
          <Route path="/thread/:threadId" element={<ThreadPage />} />
          <Route path="/newsletters" element={<NewsletterPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/add" element={<AddAccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </main>
  )
}

function PageHeader({
  title,
  back,
  action,
}: {
  title: string
  back?: boolean
  action?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="page-header">
      {back ? (
        <button className="icon-button" type="button" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft aria-hidden="true" />
        </button>
      ) : (
        <div className="header-mark"><Mail01 aria-hidden="true" /></div>
      )}
      <h1>{title}</h1>
      {action || <div className="header-mark-spacer" />}
    </header>
  )
}

function InboxPage() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState('Personal')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const threads = [
    {
      id: 'project-handoff',
      initials: 'PH',
      title: 'Project handoff',
      preview: 'Mike: I added the launch notes. No blocker so far.',
      time: '10:03',
      count: '3',
      tone: '',
    },
    {
      id: 'family-plans',
      initials: 'FP',
      title: 'Family plans',
      preview: 'Megan: Saturday lunch works. Shall we book 12:30?',
      time: '09:18',
      count: '2',
      tone: 'warm',
    },
    {
      id: 'field-notes',
      initials: 'FN',
      title: 'Field Notes',
      preview: 'Three ideas worth keeping this week...',
      time: '08:20',
      count: 'Newsletter',
      tone: 'newsletter',
      newsletter: true,
    },
  ]
  const visibleThreads = threads.filter((thread) =>
    `${thread.title} ${thread.preview} ${thread.count}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  )

  useEffect(() => {
    if (!profileOpen) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    window.addEventListener('keydown', dismiss)
    return () => window.removeEventListener('keydown', dismiss)
  }, [profileOpen])

  return (
    <>
      <PageHeader
        title="Inbox"
        action={
          <div className="header-actions">
            <button
              className={`icon-button ${searchOpen ? 'is-active' : ''}`}
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Search mail'}
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((open) => !open)
                if (searchOpen) setSearchTerm('')
              }}
            >
              <SearchLg aria-hidden="true" />
            </button>
            <button
              className={`avatar-button kokonut-trigger ${profileOpen ? 'is-open' : ''}`}
              type="button"
              aria-label="Account menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span>BV</span>
              <span className="avatar-status" aria-hidden="true" />
            </button>
            {profileOpen && (
              <button
                className="profile-click-away"
                type="button"
                aria-label="Close account menu"
                onClick={() => setProfileOpen(false)}
              />
            )}
            {profileOpen && (
              <div className="kokonut-profile-menu" role="menu">
                <button
                  className="kokonut-profile-header"
                  type="button"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="kokonut-avatar">
                    <span>BV</span>
                    <span className="avatar-status" aria-hidden="true" />
                  </span>
                  <span className="kokonut-profile-copy">
                    <strong>Bert Van Baelen</strong>
                    <small>berrebaelen@gmail.com</small>
                  </span>
                  <span className="kokonut-chevron" aria-hidden="true">
                    <ChevronDown />
                  </span>
                </button>
                <div className="kokonut-menu-divider" />
                <NavLink
                  className="kokonut-menu-row"
                  to="/accounts"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="kokonut-row-icon"><User01 aria-hidden="true" /></span>
                  <span className="kokonut-row-copy">
                    <strong>Mail accounts</strong>
                    <small>Manage device-local accounts</small>
                  </span>
                  <span className="kokonut-row-arrow" aria-hidden="true">›</span>
                </NavLink>
                <button
                  className="kokonut-menu-row kokonut-account-row"
                  type="button"
                  role="menuitem"
                  onClick={() => setSelectedAccount((account) => account === 'Personal' ? 'Work' : 'Personal')}
                >
                  <span className="kokonut-row-icon"><Mail01 aria-hidden="true" /></span>
                  <span className="kokonut-row-copy">
                    <strong>Switch account</strong>
                    <small>{selectedAccount}</small>
                  </span>
                  <span className="kokonut-row-arrow" aria-hidden="true">›</span>
                </button>
                <NavLink
                  className="kokonut-menu-row"
                  to="/settings"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="kokonut-row-icon"><Settings01 aria-hidden="true" /></span>
                  <span className="kokonut-row-copy">
                    <strong>Settings</strong>
                    <small>Privacy and display preferences</small>
                  </span>
                  <span className="kokonut-row-arrow" aria-hidden="true">›</span>
                </NavLink>
              </div>
            )}
          </div>
        }
      />
      <div className="page-content">
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              className="inbox-search"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <SearchLg aria-hidden="true" />
              <input
                autoFocus
                aria-label="Search conversations"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search people, subjects, or messages"
              />
              {searchTerm && (
                <button type="button" aria-label="Clear search" onClick={() => setSearchTerm('')}>×</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="inbox-section-heading">
          <span>{searchTerm ? 'Search results' : 'Today'}</span>
          <span>{visibleThreads.length} {visibleThreads.length === 1 ? 'conversation' : 'conversations'}</span>
        </div>
        <div className="thread-list">
          {visibleThreads.map((thread) => (
            <NavLink
              className={`thread-row ${thread.tone === 'newsletter' ? 'newsletter-row' : ''}`}
              to={thread.newsletter ? '/newsletters' : `/thread/${thread.id}`}
              key={thread.id}
            >
              <div className={`thread-avatar ${thread.tone}`}>{thread.initials}</div>
              <div className="thread-copy">
                <div className="thread-row-top">
                  <strong>{thread.title}</strong>
                  <span className={thread.tone === 'newsletter' ? 'quiet-badge' : 'count-badge'}>
                    {thread.count}
                  </span>
                </div>
                <p>{thread.preview}</p>
              </div>
              <div className="thread-meta">
                <time>{thread.time}</time>
                {thread.tone !== 'newsletter' && <span className="unread-dot" aria-label="Unread" />}
              </div>
            </NavLink>
          ))}
          {visibleThreads.length === 0 && (
            <div className="inbox-empty">
              <SearchLg aria-hidden="true" />
              <strong>No conversations found</strong>
              <span>Try a name, subject, or message text.</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function ThreadPage() {
  const { threadId = 'project-handoff' } = useParams<{ threadId: string }>()
  const thread = threadId === 'family-plans'
    ? { title: 'Family plans', meta: '3 messages · 2 people' }
    : threadId === 'workshop-notes'
      ? { title: 'Workshop notes', meta: 'Forwarded thread · 1 draft' }
      : { title: 'Project handoff', meta: '4 messages · 3 people' }
  const [draft, setDraft] = useState('')
  const [presetByThread, setPresetByThread] = useState<Record<string, { greeting: string; signature: string }>>(() => {
    try {
      const stored = localStorage.getItem('mailchat-thread-presets')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })
  const presets = presetByThread[threadId] ?? { greeting: 'Hi', signature: 'Brief' }
  const greeting = presets.greeting
  const signature = presets.signature
  const [queuedDrafts, setQueuedDrafts] = useState<string[]>([])
  const [sentDrafts, setSentDrafts] = useState<string[]>([])

  const updatePresets = (next: { greeting: string; signature: string }) => {
    setPresetByThread((current) => {
      const updated = { ...current, [threadId]: next }
      localStorage.setItem('mailchat-thread-presets', JSON.stringify(updated))
      return updated
    })
  }

  const formatMessage = (text: string) => {
    const greetingLine = greeting === 'No greeting' ? '' : `${greeting},`
    const signatureText = signature === 'None'
      ? ''
      : signature === 'Formal'
        ? 'Kind regards,\nBert Van Baelen'
        : signature === 'Project'
          ? 'Best,\nBert\nProduct Team'
          : 'Best,\nBert'
    return [greetingLine, text, signatureText].filter(Boolean).join('\n\n')
  }

  const sendDraft = () => {
    const text = draft.trim()
    if (!text) return
    setSentDrafts((current) => [...current, formatMessage(text)])
    setDraft('')
  }

  const queueDraft = () => {
    const text = draft.trim()
    if (!text) return
    setQueuedDrafts((current) => [...current, text])
    setDraft('')
  }

  const sendQueuedDraft = (index: number) => {
    const text = queuedDrafts[index]
    setSentDrafts((current) => [...current, formatMessage(text)])
    setQueuedDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const removeQueuedDraft = (index: number) => {
    setQueuedDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <>
      <PageHeader
        title={thread.title}
        back
        action={
          <button className="icon-button" type="button" aria-label="Thread options">
            <DotsVertical aria-hidden="true" />
          </button>
        }
      />
      <div className="thread-page">
        <div className="thread-scroll">
          <div className="day-divider">Today</div>
          {threadId === 'family-plans' ? (
            <>
              <div className="bubble-row">
                <div className="bubble-avatar">MG</div>
                <article className="bubble">
                  <div className="bubble-meta"><strong>Megan</strong><time>09:10</time></div>
                  <p>Are we still on for lunch on Saturday?</p>
                  <div className="cleaned-note">Reply chain hidden · Show original</div>
                </article>
              </div>
              <div className="bubble-row mine">
                <article className="bubble">
                  <div className="bubble-meta"><strong>You</strong><time>09:14</time></div>
                  <p>Saturday works. Does 12:30 suit you?</p>
                  <div className="cleaned-note">Casual presets applied · Delivered</div>
                </article>
              </div>
              <div className="bubble-row">
                <div className="bubble-avatar">MG</div>
                <article className="bubble">
                  <div className="bubble-meta"><strong>Megan</strong><time>09:18</time></div>
                  <p>12:30 is perfect. I’ll book the table.</p>
                  <div className="cleaned-note">Signature hidden · Show original</div>
                </article>
              </div>
            </>
          ) : (
            <>
              <div className="bubble-row">
                <div className="bubble-avatar">AL</div>
                <article className="bubble">
                  <div className="bubble-meta"><strong>Alice</strong><time>09:42</time></div>
                  <p>Hi, I’ve attached the revised checklist. The remaining items are ready for review.</p>
                  <div className="cleaned-note">Signature hidden · Show original</div>
                </article>
              </div>
              <div className="bubble-row mine">
                <article className="bubble">
                  <div className="bubble-meta"><strong>You</strong><time>09:47</time></div>
                  <p>Thanks Alice. I’ll review them this afternoon and send a consolidated update.</p>
                  <div className="cleaned-note">Greeting + signature applied · Delivered</div>
                </article>
              </div>
              <div className="bubble-row">
                <div className="bubble-avatar">MK</div>
                <article className="bubble">
                  <div className="bubble-meta"><strong>Mike</strong><time>10:03</time></div>
                  <p>I added the launch notes. No blocker so far.</p>
                  <div className="cleaned-note">Quoted chain hidden · Show original</div>
                </article>
              </div>
            </>
          )}
          <AnimatePresence initial={false}>
            {sentDrafts.map((text, index) => (
              <motion.div
                className="bubble-row mine ai-sent-row"
                key={`sent-${index}`}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              >
                <article className="bubble">
                  <div className="bubble-meta"><strong>You</strong><time>Now</time></div>
                  <p>{text}</p>
                  <div className="cleaned-note">Queued presets applied · Sent</div>
                </article>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="thread-composer-dock">
          <AnimatePresence initial={false}>
            {queuedDrafts.length > 0 && (
              <motion.section
                className="ai-draft-queue"
                aria-label="Queued mail drafts"
                initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
              >
                <div className="ai-draft-queue-header">
                  <span>{queuedDrafts.length} queued</span>
                  <span>Send one now</span>
                </div>
                {queuedDrafts.map((text, index) => (
                  <motion.div
                    className="ai-draft-row"
                    key={`${text}-${index}`}
                    layout
                  >
                    <span className="ai-draft-number">{index + 1}</span>
                    <p>{text}</p>
                    <button
                      type="button"
                      aria-label={`Send now: ${text}`}
                      onClick={() => sendQueuedDraft(index)}
                    >
                      Send now
                    </button>
                    <button
                      type="button"
                      className="ai-draft-remove"
                      aria-label={`Remove queued draft: ${text}`}
                      onClick={() => removeQueuedDraft(index)}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
          <motion.div
            className="composer ai-composer"
            layout
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
          <div className="ai-preset-strip" aria-label="Per-thread presets">
            <label className="ai-preset-control">
              <span>Greeting</span>
              <select
                aria-label="Greeting preset"
                value={greeting}
                onChange={(event) => updatePresets({ greeting: event.target.value, signature })}
              >
                <option value="Hi">Hi</option>
                <option value="Hello">Hello</option>
                <option value="Good morning">Good morning</option>
                <option value="No greeting">No greeting</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
            <label className="ai-preset-control">
              <span>Signature</span>
              <select
                aria-label="Signature preset"
                value={signature}
                onChange={(event) => updatePresets({ greeting, signature: event.target.value })}
              >
                <option value="Brief">Brief</option>
                <option value="Formal">Formal</option>
                <option value="Project">Project</option>
                <option value="None">None</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </label>
          </div>
          <div className="compose-row ai-compose-row">
            <button type="button" className="attach-button" aria-label="Attach">+</button>
            <textarea
              aria-label="Message"
              placeholder="Write a message..."
              value={draft}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  if (event.metaKey || event.ctrlKey) {
                    queueDraft()
                  } else {
                    sendDraft()
                  }
                }
              }}
            />
            <button type="button" className="send-button ai-send-button" aria-label="Send" onClick={sendDraft}>
              <Send01 aria-hidden="true" />
            </button>
          </div>
          {draft.trim() && (
            <div className="ai-compose-footer">
              <span>{greeting === 'No greeting' ? 'No greeting' : `${greeting} greeting`}</span>
              <span>{signature === 'None' ? 'No signature' : `${signature} signature`}</span>
              <button type="button" onClick={queueDraft}>Queue draft</button>
            </div>
          )}
        </motion.div>
      </div>
      </div>
    </>
  )
}

function NewsletterPage() {
  return (
    <>
      <PageHeader title="Newsletters" back />
      <div className="newsletter-page">
        <section className="newsletter-hero">
          <span>Newsletter · No reply</span>
          <h2>Field Notes</h2>
          <p>Weekly brief · 18 November</p>
        </section>
        <article className="newsletter-article">
          <h3>Three ideas worth keeping</h3>
          <p>This week: quieter planning, more useful metrics, and why good tools should feel almost invisible.</p>
          <div className="article-card">
            <strong>Inside the new workflow</strong>
            <p>A practical guide to reducing context switching across the team.</p>
          </div>
          <div className="article-card">
            <strong>From the community</strong>
            <p>Small changes that made a large difference in daily operations.</p>
          </div>
        </article>
      </div>
    </>
  )
}

function AccountsPage() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<CustomAccount[]>([])
  const [syncResult, setSyncResult] = useState('')

  useEffect(() => {
    void listCustomAccounts().then(setAccounts)
  }, [])

  async function syncAccount(account: CustomAccount) {
    setSyncResult('')
    try {
      const password = await loadAccountPassword(account.id)
      const result = await syncCustomAccount(account, password)
      setSyncResult(`${result.exists} messages in INBOX`)
    } catch (error) {
      setSyncResult(error instanceof Error ? error.message : 'Mailbox sync failed.')
    }
  }

  async function removeAccount(account: CustomAccount) {
    await removeCustomAccount(account.id)
    setAccounts(await listCustomAccounts())
  }

  return (
    <>
      <PageHeader
        title="Accounts"
        back
        action={
          <button className="icon-button" type="button" aria-label="Add account" onClick={() => navigate('/accounts/add')}>
            <Plus aria-hidden="true" />
          </button>
        }
      />
      <div className="settings-page">
        {syncResult && <div className="notice">{syncResult}</div>}
        {accounts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><User01 aria-hidden="true" /></div>
            <h2>No mail accounts</h2>
            <p>Add a custom IMAP and SMTP account stored only on this device.</p>
            <button className="primary-button" type="button" onClick={() => navigate('/accounts/add')}>
              <Plus aria-hidden="true" />
              Add account
            </button>
          </div>
        ) : (
          accounts.map((account) => (
            <article className="account-card" key={account.id}>
              <div className="account-card-icon"><Shield01 aria-hidden="true" /></div>
              <div className="account-card-copy">
                <strong>{account.label}</strong>
                <small>{account.email}</small>
                <small>{account.imapHost}:{account.imapPort} · TLS</small>
              </div>
              <div className="account-card-actions">
                <button type="button" className="secondary-button" onClick={() => void syncAccount(account)}>Sync</button>
                <button type="button" className="text-button danger" onClick={() => void removeAccount(account)}>Remove</button>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  )
}

function AddAccountPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<CustomAccountDraft>(emptyDraft)
  const [status, setStatus] = useState<'idle' | 'testing' | 'saving' | 'error' | 'connected'>('idle')
  const [message, setMessage] = useState('')

  function update<K extends keyof CustomAccountDraft>(key: K, value: CustomAccountDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function testConnection() {
    setStatus('testing')
    setMessage('')
    try {
      await testCustomAccount({
        imapHost: draft.imapHost,
        imapPort: draft.imapPort,
        imapSecure: draft.imapTls === 'ssl',
        smtpHost: draft.smtpHost,
        smtpPort: draft.smtpPort,
        smtpSecure: draft.smtpTls === 'ssl',
        username: draft.username,
        password: draft.password,
      })
      setStatus('connected')
      setMessage('IMAP and SMTP connections verified.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Connection test failed.')
    }
  }

  async function saveAccount() {
    setStatus('saving')
    setMessage('')
    try {
      const now = new Date().toISOString()
      const account: CustomAccount = {
        id: crypto.randomUUID(),
        provider: 'custom',
        label: draft.label,
        email: draft.email,
        username: draft.username,
        imapHost: draft.imapHost,
        imapPort: draft.imapPort,
        imapTls: draft.imapTls,
        smtpHost: draft.smtpHost,
        smtpPort: draft.smtpPort,
        smtpTls: draft.smtpTls,
        enabled: true,
        createdAt: now,
        updatedAt: now,
      }
      await saveCustomAccount(account, draft.password)
      setStatus('idle')
      setMessage('Account saved on this device.')
      navigate('/accounts')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Account could not be saved.')
    }
  }

  return (
    <>
      <PageHeader title="Add custom account" back />
      <div className="settings-page form-page">
        {message && (
          <div className={`notice ${status === 'error' ? 'notice-error' : ''}`}>
            {message}
          </div>
        )}
        <section className="form-section">
          <h2>Account</h2>
          <label>
            <span>Account name</span>
            <input value={draft.label} onChange={(event) => update('label', event.target.value)} />
          </label>
          <label>
            <span>Email address</span>
            <input type="email" value={draft.email} onChange={(event) => update('email', event.target.value)} />
          </label>
          <label>
            <span>Username</span>
            <input value={draft.username} onChange={(event) => update('username', event.target.value)} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={draft.password} onChange={(event) => update('password', event.target.value)} />
          </label>
        </section>

        <section className="form-section">
          <h2>Incoming · IMAP</h2>
          <div className="form-grid">
            <label>
              <span>Host</span>
              <input value={draft.imapHost} onChange={(event) => update('imapHost', event.target.value)} placeholder="mail.example.com" />
            </label>
            <label>
              <span>Port</span>
              <input type="number" value={draft.imapPort} onChange={(event) => update('imapPort', Number(event.target.value))} />
            </label>
          </div>
          <label>
            <span>Encryption</span>
            <select value={draft.imapTls} onChange={(event) => update('imapTls', event.target.value as CustomAccountDraft['imapTls'])}>
              <option value="ssl">TLS / SSL</option>
              <option value="starttls">STARTTLS</option>
            </select>
          </label>
        </section>

        <section className="form-section">
          <h2>Outgoing · SMTP</h2>
          <div className="form-grid">
            <label>
              <span>Host</span>
              <input value={draft.smtpHost} onChange={(event) => update('smtpHost', event.target.value)} placeholder="smtp.example.com" />
            </label>
            <label>
              <span>Port</span>
              <input type="number" value={draft.smtpPort} onChange={(event) => update('smtpPort', Number(event.target.value))} />
            </label>
          </div>
          <label>
            <span>Encryption</span>
            <select value={draft.smtpTls} onChange={(event) => update('smtpTls', event.target.value as CustomAccountDraft['smtpTls'])}>
              <option value="ssl">TLS / SSL</option>
              <option value="starttls">STARTTLS</option>
            </select>
          </label>
        </section>

        <button className="secondary-button wide" type="button" onClick={() => void testConnection()} disabled={status === 'testing'}>
          {status === 'testing' ? 'Testing…' : 'Test connection'}
        </button>
        <button className="primary-button wide" type="button" onClick={() => void saveAccount()} disabled={status === 'saving' || status === 'testing'}>
          {status === 'saving' ? 'Saving…' : 'Save account on this device'}
        </button>
      </div>
    </>
  )
}

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="settings-page">
        <NavLink className="settings-row" to="/accounts">
          <div className="settings-row-icon"><User01 aria-hidden="true" /></div>
          <div>
            <strong>Mail accounts</strong>
            <small>Add or remove device-local accounts</small>
          </div>
          <span>›</span>
        </NavLink>
        <div className="settings-row">
          <div className="settings-row-icon"><Shield01 aria-hidden="true" /></div>
          <div>
            <strong>Privacy</strong>
            <small>Mail data stays on this device</small>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppShell
