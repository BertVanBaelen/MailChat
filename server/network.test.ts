import { describe, expect, it } from 'vitest'
import {
  isAddressBlocked,
  isIpv4AddressBlocked,
  isIpv6AddressBlocked,
  validateHostName,
} from './network.js'

describe('mail relay network policy', () => {
  it('blocks loopback and link-local IPv4 targets', () => {
    expect(isIpv4AddressBlocked('127.0.0.1', true)).toBe(true)
    expect(isIpv4AddressBlocked('169.254.169.254', true)).toBe(true)
  })

  it('blocks RFC1918 targets unless private targets are explicitly allowed', () => {
    expect(isIpv4AddressBlocked('192.168.1.20', false)).toBe(true)
    expect(isIpv4AddressBlocked('192.168.1.20', true)).toBe(false)
    expect(isIpv4AddressBlocked('10.20.30.40', false)).toBe(true)
    expect(isIpv4AddressBlocked('10.20.30.40', true)).toBe(false)
  })

  it('blocks IPv6 loopback, link-local, multicast, and unspecified targets', () => {
    expect(isIpv6AddressBlocked('::', true)).toBe(true)
    expect(isIpv6AddressBlocked('::1', true)).toBe(true)
    expect(isIpv6AddressBlocked('fe80::1', true)).toBe(true)
    expect(isIpv6AddressBlocked('ff02::1', true)).toBe(true)
  })

  it('allows unique-local IPv6 only when private targets are allowed', () => {
    expect(isIpv6AddressBlocked('fd12:3456::1', false)).toBe(true)
    expect(isIpv6AddressBlocked('fd12:3456::1', true)).toBe(false)
  })

  it('blocks mapped private IPv4 addresses', () => {
    expect(isAddressBlocked('::ffff:127.0.0.1', true)).toBe(true)
  })

  it('rejects malformed host names', () => {
    expect(() => validateHostName('../private')).toThrow()
    expect(() => validateHostName('')).toThrow()
  })
})
