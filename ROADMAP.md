# MailChat Roadmap

## Product outcome

MailChat is a PWA email client that presents existing accounts as chat threads while preserving standard email compatibility. The first release will run as a native Home Assistant add-on, keep account state on each device, and publish versioned container images to GHCR.

The MVP is complete only when a user can install it on Android or iOS, connect at least one account, read a real inbox, send a real reply, preserve the original MIME message, and safely add a Home Assistant release.

## Release sequence

### 0. Analysis and repository foundation

Status: Complete

- Interactive UX mockups
- OpenSpec project context and specifications
- Stateless multi-user relay design
- Local Graphify knowledge graph
- Public repository, MIT license, and working CI
- GitHub Actions for OpenSpec, secret, and dependency checks
- GitHub Actions template for versioned GHCR releases

Exit criteria:

- OpenSpec strict validation passes
- Main CI passes
- Every implementation phase has a linked specification

### 1. PWA shell and local foundation

Status: In progress

Build:

- React + TypeScript + Vite application
- Kokonut UI and Untitled UI integration
- Mobile conversation, inbox, settings, and newsletter routes
- PWA manifest and icons
- Strict lint, formatting, unit test, and build scripts
- IndexedDB/Dexie storage for non-secret state
- Web Crypto account-secret vault
- Service worker and update banner

Exit criteria:

- Installable as a PWA on Android and iOS
- Offline shell opens without an account
- Installed app survives reload and update
- Navigation and settings work with no backend mailbox
- Unit tests cover storage and PWA update behavior

### 2. Custom TLS account vertical slice

Status: In progress

Build:

- IMAP/SMTP account setup
- TLS and certificate validation
- Encrypted custom-account credentials on the device
- Stateless Fastify mail relay in the add-on
- IMAP sync for folders, flags, and envelope data
- SMTP send for one account
- Ephemeral credentials with no server persistence
- SSRF, private-network, size, timeout, and rate limits

Exit criteria:

- One custom account can sync a real inbox
- Read and send work over valid TLS
- Invalid certificates and hosts fail clearly
- Restarting the add-on does not expose account credentials
- Two users can use separate accounts without cross-user state

### 3. Chat thread and MIME engine

Status: Planned

Build:

- Raw MIME preservation
- Message-ID, In-Reply-To, and References grouping
- Conservative subject fallback
- Sender attribution and chronological bubbles
- Attachments and forwarding representation
- Signature, greeting, footer, and quoted-history cleanup
- "Show original" fallback
- Reply, Reply all, and Forward state

Thread conflicts:

- Separate sends remain separate bubbles
- Subject changes remain uncertain until message IDs connect them
- Forwarded mail remains distinct from normal thread history
- Mailing-list recipients are shown explicitly

Exit criteria:

- Real replies group by message ID
- Ambiguous subjects do not merge unrelated mail
- Cleanup never modifies or destroys original MIME
- Attachments and forwards remain navigable
- MIME and threading edge cases have deterministic tests

### 4. Compose presets and local reliability

Status: Planned

Build:

- Greeting and signature preset libraries
- Preset selection saved per thread
- Presets inserted exactly once per sent MIME
- Per-thread draft storage
- Offline Outbox
- Retry and duplicate-send protection
- No-reply override confirmation
- Reply-all confirmation for multi-recipient threads

Exit criteria:

- Presets survive thread navigation and app reload
- Switching threads restores each thread's choices
- Multiple sends add no repeated greeting or signature
- Offline sends retry safely
- No-reply senders require explicit override

### 5. Gmail and Microsoft accounts

Status: Planned

Build:

- Gmail OAuth with PKCE
- Microsoft OAuth with PKCE
- Gmail API adapter
- Microsoft Graph adapter
- Alias and From-address selection
- Account reconnect and revoked-credential handling
- Provider-native thread identifiers where available

Architecture choice:

- OAuth credentials and mailbox data remain on the device
- Provider APIs may be called directly from the PWA
- The add-on relay is not the account database

Exit criteria:

- Gmail account connects and sends
- Microsoft account connects and sends
- Revoked or expired credentials reconnect safely
- Aliases can be selected per send
- Provider API calls do not store refresh tokens on the add-on

### 6. Newsletters and no-reply behavior

Status: Planned

Build:

- List-ID, List-Unsubscribe, and Precedence detection
- Mailing-list and bulk-classification fallback
- Dedicated newsletter page reader
- Disabled normal reply composer
- Unsubscribe and external-link controls
- "Move to newsletter" and "Move to chat" corrections
- Safe tracking-link separation

Exit criteria:

- Known bulk mail opens in page-reader mode
- No-reply mail cannot compose without override confirmation
- Mailing-list replies can distinguish Reply and Reply all
- Newsletter HTML is sanitized and tracking is blocked by default

### 7. Home Assistant packaging

Status: Planned

Build:

- Native add-on repository layout
- Add-on configuration schema
- Public HTTPS and ingress routing support
- Reverse-proxy and CSP configuration
- amd64 and aarch64 images
- Startup, health, and configuration validation
- Upgrade and rollback documentation

Exit criteria:

- Add-on installs from a repository URL
- PWA opens through ingress
- PWA opens through a public HTTPS origin
- Both selected architectures run
- Add-on restart preserves no account credentials

### 8. Release and beta hardening

Status: Planned

Build:

- SemVer tags and immutable GHCR digests
- SBOM and provenance
- Container image scanning
- CodeQL
- Dependency lockfile and secret checks
- Android and iOS install smoke tests
- Error, telemetry, and privacy review
- Backup and uninstall behavior

Exit criteria:

- Tag creates a valid GHCR release
- Stable tags publish only after checks pass
- Image digest and add-on version stay aligned
- No secrets appear in logs or repositories
- Core flows pass Android and iOS beta smoke tests

## MVP feature priority

The first implementation slice should be:

1. PWA shell
2. Local vault
3. One custom TLS account
4. Inbox and MIME-thread reading
5. Reply and per-thread presets
6. Newsletter/no-reply classification
7. Home Assistant add-on packaging
8. Gmail and Microsoft OAuth

Gmail and Microsoft are high-value provider integrations, but they should follow the custom-account vertical slice so thread parsing and sending behavior are proven without provider-specific complexity.

## Deferred beyond the MVP

- Cross-device encrypted mail-cache sync
- Shared account/workspace support
- App-store distribution
- Native push notifications
- CalDAV, contacts, or calendar integration
- Shared mailboxes and delegation
- End-to-end encryption
- External encryption plugins
- Desktop or Electron application
