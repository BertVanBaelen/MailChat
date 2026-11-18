import Dexie, { type EntityTable } from 'dexie'
import type { CustomAccount } from '../types/account'

interface VaultKeyRecord {
  id: 'device'
  key: CryptoKey
  createdAt: string
}

interface VaultSecretRecord {
  accountId: string
  iv: ArrayBuffer
  ciphertext: ArrayBuffer
  updatedAt: string
}

class MailChatDatabase extends Dexie {
  accounts!: EntityTable<CustomAccount, 'id'>
  vaultKeys!: EntityTable<VaultKeyRecord, 'id'>
  vaultSecrets!: EntityTable<VaultSecretRecord, 'accountId'>

  constructor() {
    super('mailchat-device')
    this.version(1).stores({
      accounts: 'id, provider, email, enabled, updatedAt',
      vaultKeys: 'id',
      vaultSecrets: 'accountId, updatedAt',
    })
  }
}

export const accountDatabase = new MailChatDatabase()

async function getOrCreateVaultKey(): Promise<CryptoKey> {
  const existing = await accountDatabase.vaultKeys.get('device')
  if (existing) return existing.key

  if (!globalThis.crypto?.subtle) {
    throw new Error('This browser cannot create a device-local encrypted account vault.')
  }

  const key = await globalThis.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )

  await accountDatabase.vaultKeys.put({
    id: 'device',
    key,
    createdAt: new Date().toISOString(),
  })
  return key
}

export async function saveCustomAccount(
  account: CustomAccount,
  password: string,
): Promise<void> {
  await storeAccountPassword(account.id, password)
  await accountDatabase.accounts.put(account)
}

export async function storeAccountPassword(
  accountId: string,
  password: string,
): Promise<void> {
  const key = await getOrCreateVaultKey()
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12)).buffer
  const plaintext = new TextEncoder().encode(password)
  const ciphertext = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext,
  )

  await accountDatabase.vaultSecrets.put({
    accountId,
    iv,
    ciphertext,
    updatedAt: new Date().toISOString(),
  })
}

export async function loadAccountPassword(accountId: string): Promise<string> {
  const key = await getOrCreateVaultKey()
  const record = await accountDatabase.vaultSecrets.get(accountId)
  if (!record) throw new Error('No encrypted password is stored for this account.')

  const plaintext = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: record.iv },
    key,
    record.ciphertext,
  )
  return new TextDecoder().decode(plaintext)
}

export async function listCustomAccounts(): Promise<CustomAccount[]> {
  return accountDatabase.accounts
    .where('provider')
    .equals('custom')
    .sortBy('createdAt')
}

export async function removeCustomAccount(accountId: string): Promise<void> {
  await accountDatabase.transaction(
    'rw',
    accountDatabase.accounts,
    accountDatabase.vaultSecrets,
    async () => {
      await accountDatabase.accounts.delete(accountId)
      await accountDatabase.vaultSecrets.delete(accountId)
    },
  )
}
