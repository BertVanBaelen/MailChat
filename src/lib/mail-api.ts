import type { CustomAccount } from '../types/account'

export interface TestCustomAccountRequest {
  imapHost: string
  imapPort: number
  imapSecure: boolean
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  username: string
  password: string
}

export interface TestCustomAccountResponse {
  ok: boolean
  imap: 'connected'
  smtp: 'verified'
}

export interface MailSyncMessage {
  uid: number
  subject: string
  from: string
  date: string | null
  flags: string[]
  size: number
}

export interface MailSyncResponse {
  mailbox: 'INBOX'
  exists: number
  messages: MailSyncMessage[]
}

export async function testCustomAccount(
  request: TestCustomAccountRequest,
): Promise<TestCustomAccountResponse> {
  const response = await fetch('/api/mail/custom/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message || `Connection test failed (${response.status}).`)
  }
  return response.json()
}

export async function syncCustomAccount(
  account: CustomAccount,
  password: string,
): Promise<MailSyncResponse> {
  const response = await fetch('/api/mail/custom/sync', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      accountId: account.id,
      imapHost: account.imapHost,
      imapPort: account.imapPort,
      imapSecure: account.imapTls === 'ssl',
      username: account.username,
      password,
    }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message || `Mailbox sync failed (${response.status}).`)
  }
  return response.json()
}
