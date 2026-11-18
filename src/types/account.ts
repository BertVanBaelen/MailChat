export type CustomTlsMode = 'ssl' | 'starttls'

export interface CustomAccount {
  id: string
  provider: 'custom'
  label: string
  email: string
  username: string
  imapHost: string
  imapPort: number
  imapTls: CustomTlsMode
  smtpHost: string
  smtpPort: number
  smtpTls: CustomTlsMode
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomAccountDraft {
  label: string
  email: string
  username: string
  password: string
  imapHost: string
  imapPort: number
  imapTls: CustomTlsMode
  smtpHost: string
  smtpPort: number
  smtpTls: CustomTlsMode
}
