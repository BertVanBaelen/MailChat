import { ImapFlow } from 'imapflow'
import nodemailer from 'nodemailer'
import { resolveAndValidateHost } from './network.js'

export interface CustomConnectionConfig {
  imapHost: string
  imapPort: number
  imapSecure: boolean
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  username: string
  password: string
}

export interface SyncConfig {
  imapHost: string
  imapPort: number
  imapSecure: boolean
  username: string
  password: string
}

export interface SendConfig {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  username: string
  password: string
  to: string
  cc?: string
  bcc?: string
  subject: string
  text: string
  html?: string
}

export interface MailSyncMessage {
  uid: number
  subject: string
  from: string
  date: string | null
  flags: string[]
  size: number
}

export async function testCustomConnection(config: CustomConnectionConfig): Promise<void> {
  const allowPrivate = process.env.MAILCHAT_ALLOW_PRIVATE_TARGETS === 'true'
  await resolveAndValidateHost(config.imapHost, allowPrivate)
  await resolveAndValidateHost(config.smtpHost, allowPrivate)

  const imap = new ImapFlow({
    host: config.imapHost,
    port: config.imapPort,
    secure: config.imapSecure,
    auth: { user: config.username, pass: config.password },
    tls: { rejectUnauthorized: true },
    socketTimeout: 15_000,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    logger: false,
  })

  try {
    await imap.connect()
    await imap.noop()
  } finally {
    await imap.logout().catch(() => undefined)
  }

  const smtp = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: { user: config.username, pass: config.password },
    requireTLS: !config.smtpSecure,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 15_000,
    tls: { rejectUnauthorized: true, servername: config.smtpHost },
  })

  await smtp.verify()
  smtp.close()
}

export async function syncInbox(config: SyncConfig): Promise<{
  mailbox: 'INBOX'
  exists: number
  messages: MailSyncMessage[]
}> {
  const allowPrivate = process.env.MAILCHAT_ALLOW_PRIVATE_TARGETS === 'true'
  await resolveAndValidateHost(config.imapHost, allowPrivate)

  const imap = new ImapFlow({
    host: config.imapHost,
    port: config.imapPort,
    secure: config.imapSecure,
    auth: { user: config.username, pass: config.password },
    tls: { rejectUnauthorized: true },
    socketTimeout: 20_000,
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    logger: false,
  })

  try {
    await imap.connect()
    const mailbox = await imap.mailboxOpen('INBOX')
    if (!mailbox.exists) {
      return { mailbox: 'INBOX', exists: 0, messages: [] }
    }

    const start = Math.max(1, mailbox.exists - 24)
    const fetched = await imap.fetchAll(`${start}:*`, {
      uid: true,
      flags: true,
      envelope: true,
      internalDate: true,
      size: true,
    })

    const messages = fetched
      .map((message) => {
        const sender = message.envelope?.from?.[0]
        const internalDate = message.internalDate
        const from = sender?.address
          ? sender.name
            ? `${sender.name} <${sender.address}>`
            : sender.address
          : 'Unknown sender'
        return {
          uid: message.uid,
          subject: message.envelope?.subject || '(No subject)',
          from,
          date: internalDate instanceof Date
            ? internalDate.toISOString()
            : typeof internalDate === 'string'
              ? internalDate
              : null,
          flags: Array.from(message.flags || []),
          size: message.size || 0,
        }
      })
      .sort((a, b) => {
        if (!a.date || !b.date) return 0
        return Date.parse(b.date) - Date.parse(a.date)
      })

    return { mailbox: 'INBOX', exists: mailbox.exists, messages }
  } finally {
    await imap.logout().catch(() => undefined)
  }
}

export async function sendCustomMail(config: SendConfig): Promise<{ messageId: string }> {
  const allowPrivate = process.env.MAILCHAT_ALLOW_PRIVATE_TARGETS === 'true'
  await resolveAndValidateHost(config.smtpHost, allowPrivate)

  const smtp = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: { user: config.username, pass: config.password },
    requireTLS: !config.smtpSecure,
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    tls: { rejectUnauthorized: true, servername: config.smtpHost },
  })

  const sent = await smtp.sendMail({
    from: config.username,
    to: config.to,
    cc: config.cc,
    bcc: config.bcc,
    subject: config.subject,
    text: config.text,
    html: config.html,
  })
  smtp.close()

  return { messageId: sent.messageId || '' }
}
