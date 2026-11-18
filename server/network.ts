import dns from 'node:dns/promises'
import net from 'node:net'

export function isIpv4AddressBlocked(address: string, allowPrivate: boolean): boolean {
  const parts = address.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true
  }

  const [a, b] = parts
  if (a === 0 || a === 127 || a >= 224) return true
  if (a === 169 && b === 254) return true
  if (a === 100 && b >= 64 && b <= 127) return true

  if (!allowPrivate) {
    if (a === 10) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
  }
  return false
}

export function isIpv6AddressBlocked(address: string, allowPrivate: boolean): boolean {
  const normalized = address.toLowerCase().split('%')[0]

  if (normalized.includes(':')) {
    if (normalized === '::' || normalized === '::1') return true
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) {
      return !allowPrivate
    }
    if (normalized.startsWith('fe8') || normalized.startsWith('fe9') ||
        normalized.startsWith('fea') || normalized.startsWith('feb')) {
      return true
    }
    if (normalized.startsWith('ff')) return true

    const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return isIpv4AddressBlocked(mapped[1], allowPrivate)
  }

  return false
}

export function isAddressBlocked(address: string, allowPrivate: boolean): boolean {
  const type = net.isIP(address)
  if (type === 4) return isIpv4AddressBlocked(address, allowPrivate)
  if (type === 6) return isIpv6AddressBlocked(address, allowPrivate)
  return true
}

export function validateHostName(host: string): string {
  const normalized = host.trim().toLowerCase()
  if (!normalized) throw new Error('Host is required.')
  if (normalized.includes('/') || normalized.includes('\\')) {
    throw new Error('Host must be a DNS name or IP address.')
  }
  if (normalized.length > 253) throw new Error('Host name is too long.')
  return normalized
}

export async function resolveAndValidateHost(
  host: string,
  allowPrivate = false,
): Promise<{ host: string; addresses: string[] }> {
  const normalized = validateHostName(host)
  const isDirectIp = net.isIP(normalized) !== 0

  if (isDirectIp) {
    if (isAddressBlocked(normalized, allowPrivate)) {
      throw new Error('This network destination is not allowed.')
    }
    return { host: normalized, addresses: [normalized] }
  }

  if (/localhost/i.test(normalized) || normalized.endsWith('.localhost')) {
    throw new Error('Localhost destinations are not allowed.')
  }

  const records = await dns.lookup(normalized, { all: true, verbatim: true })
  if (!records.length) throw new Error('Host could not be resolved.')

  const addresses = records.map((record) => record.address)
  for (const address of addresses) {
    if (isAddressBlocked(address, allowPrivate)) {
      throw new Error('This host resolved to a destination that is not allowed.')
    }
  }

  return { host: normalized, addresses }
}
