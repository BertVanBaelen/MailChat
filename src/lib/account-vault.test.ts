// @vitest-environment jsdom

import 'fake-indexeddb/auto'
import { webcrypto } from 'node:crypto'
import { afterEach, describe, expect, it } from 'vitest'
import {
  accountDatabase,
  listCustomAccounts,
  loadAccountPassword,
  removeCustomAccount,
  saveCustomAccount,
} from './account-vault'
import type { CustomAccount } from '../types/account'

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: webcrypto,
})

const account: CustomAccount = {
  id: 'account-1',
  provider: 'custom',
  label: 'Personal',
  email: 'person@example.com',
  username: 'person@example.com',
  imapHost: 'mail.example.com',
  imapPort: 993,
  imapTls: 'ssl',
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpTls: 'starttls',
  enabled: true,
  createdAt: '2026-11-18T18:00:00.000Z',
  updatedAt: '2026-11-18T18:00:00.000Z',
}

afterEach(async () => {
  await accountDatabase.accounts.clear()
  await accountDatabase.vaultSecrets.clear()
  await accountDatabase.vaultKeys.clear()
})

describe('device-local account vault', () => {
  it('stores account metadata and encrypted credentials separately', async () => {
    await saveCustomAccount(account, 'secret-password')

    expect(await listCustomAccounts()).toEqual([account])
    expect(await loadAccountPassword(account.id)).toBe('secret-password')
  })

  it('removes account metadata and credentials together', async () => {
    await saveCustomAccount(account, 'secret-password')
    await removeCustomAccount(account.id)

    expect(await listCustomAccounts()).toEqual([])
  })
})
