# Design: MailChat first implementation

## Architecture

```text
Android/iOS PWA
  - React UI
  - Web Crypto account vault
  - IndexedDB mail cache
  - Service worker
          |
          | HTTPS, same public origin
          v
Home Assistant add-on
  - Static PWA server
  - Stateless mail API
  - ImapFlow relay
  - Nodemailer relay
          |
          v
Gmail API / Microsoft Graph / custom IMAP / custom SMTP
```

## Browser storage

Use IndexedDB for:

- Account metadata without plaintext passwords
- Message envelopes and MIME references
- Thread membership
- Cleaned display fragments
- Per-thread greeting/signature choices
- Drafts and Outbox entries
- Cached attachments

Use Web Crypto for:

- Encrypting custom credentials
- Encrypting OAuth refresh/access tokens
- Origin-bound device export keys where supported

Do not assume Web Crypto keys remain exportable or transferable across devices.

## Add-on runtime

The add-on should contain:

- A static PWA server
- A protected mail relay API
- Provider adapters
- Configuration validation
- Request rate limits
- Network-policy checks
- Optional HA ingress path support

The add-on should not contain:

- Account database tables
- Credential files
- Mail archive storage
- OAuth client secrets for browser-only PKCE flows
- A MailChat login account system

## Multi-device and multi-user isolation

One MailChat relay instance can serve multiple users and devices without becoming a shared mailbox. There is no shared user pool and no server-side mailbox.

Each request must contain:

- An authenticated device or user session
- A local account identifier
- Provider or custom-host operation metadata
- Short-lived provider credentials or custom credentials supplied ephemerally

The relay must:

- Create one isolated provider or IMAP/SMTP client per request
- Use separate memory scopes and connections per device session
- Never cache account credentials or cross-user mail in process memory or disk
- Never store drafts, Outbox entries, messages, or attachment bodies
- Derive authorization from the authenticated request rather than an account name alone
- Apply per-device and per-account rate limits

Gmail and Microsoft operations should preferably run directly from the PWA to provider APIs. This reduces custom relay exposure and lets provider OAuth remain device-local.

The custom IMAP/SMTP relay is then an optional path for accounts that browsers cannot connect to directly. Credentials are sent over public HTTPS, used for the duration of one operation, and discarded afterward.

## Provider flow

### Gmail

- Browser starts authorization with PKCE.
- Browser stores refresh and access credentials in its encrypted vault.
- Browser or relay calls Gmail API operations.
- The relay may receive a short-lived token for server-side operations.

### Microsoft

- Browser starts Microsoft OAuth with PKCE.
- Microsoft account identity and aliases are displayed on-device.
- Provider operations use Microsoft Graph.

### Custom account

- PWA validates host and port settings.
- PWA encrypts credentials in the local vault.
- PWA supplies credentials ephemerally to the relay.
- Relay creates a short-lived IMAP or SMTP client.
- Relay never persists credentials or source mailboxes.

## Thread reconstruction

The thread engine combines:

1. `Message-ID`
2. `In-Reply-To`
3. `References`
4. Provider thread identifiers
5. Conservative subject normalization as a fallback

Every result has confidence metadata. Cleanup is a view projection, never mutation of the source MIME.

## Newsletter detection

Newsletter detection is a weighted classifier:

- Strong: `List-Id`, `List-Unsubscribe`
- Strong: bulk or mailing-list `Precedence`
- Medium: repeat-sender statistics
- Medium: marketing footer or no-reply sender patterns
- Confirm: HTML-only bulk template signatures

Ambiguous mail stays in Chat by default, with "Move to newsletters" and "Not a newsletter" controls.

## Security

- CSP without unsafe-inline or unsafe-eval.
- DOMPurify with a strict allowlist.
- Sandbox remote HTML or only proxy/strip remote resources.
- OAuth state and PKCE validation.
- Origin allowlist for relay requests.
- SSRF and private-network destination checks.
- Rate limits and bounded attachment sizes.
- Dependency lockfiles and CodeQL.
- Secret scanning and container scanning.
- SBOM and provenance for release images.

## PWA update model

- SemVer app versions
- Cache-first static shell
- Network-first API responses
- Local IndexedDB remains authoritative for drafts and account choices
- New service worker waits for explicit activation

## CI and release

Pull requests run:

- formatting and lint
- TypeScript type check
- unit and component tests
- dependency review
- CodeQL
- secret scanning
- container build and image scan
- PWA build and Lighthouse PWA checks

Releases publish:

- immutable GHCR digest
- SemVer tag
- `latest` tag only for stable releases
- SPDX SBOM
- provenance attestation

## HA packaging

Use a repository layout compatible with Home Assistant add-ons:

```text
repository.yaml
mailchat/
  config.yaml
  Dockerfile
  build.yaml
  rootfs/
  translations/
  README.md
```

Build for `aarch64`, `amd64`, and any additional architectures selected later.
