# MailChat

MailChat is a chat-oriented PWA email client for Android and iOS. It connects to existing mail accounts and presents conversations as chat bubbles while preserving standard email and MIME behavior.

The implementation is in the PWA foundation and custom TLS account vertical-slice stage.

## Implemented

- React, TypeScript, Vite, PWA manifest, and Workbox service-worker generation
- Mobile inbox, thread, newsletter, settings, and account routes
- Untitled UI icon library
- Device-local IndexedDB account metadata
- Web Crypto AES-GCM encrypted custom-account credentials
- Fastify relay for custom IMAP/SMTP operations
- ImapFlow inbox sync
- Nodemailer SMTP send adapter
- Loopback, link-local, metadata, private-network, and DNS destination checks
- Relay rate limiting
- Unit tests for vault and network policies
- OpenSpec change tracking and strict validation

## Development

Start the PWA and relay in two terminals:

```powershell
npm install
npm run dev
npm run dev:server
```

The PWA uses `http://localhost:5173` and proxies `/api` to `http://127.0.0.1:8787`.

Relay health:

```powershell
curl.exe http://127.0.0.1:8787/api/health
```

Validation:

```powershell
npm run lint
npm test
npm run build
openspec validate --all --strict --no-interactive
```

Private mail servers on a Home Assistant LAN can be enabled explicitly:

```powershell
$env:MAILCHAT_ALLOW_PRIVATE_TARGETS="true"
npm run dev:server
```

Loopback and cloud metadata addresses remain blocked.

## Relay security

The relay is stateless:

- Custom credentials are supplied ephemerally by the PWA
- No account password or refresh token is persisted by the relay
- Provider clients and IMAP/SMTP sessions are created per operation
- Public-host SSRF checks run before IMAP/SMTP connections
- The relay uses TLS certificate validation
- PWA and relay share the public HTTPS origin in production

Set `MAILCHAT_PUBLIC_ORIGIN` to the exact public HTTPS origin when deployed.

## Repository

- GitHub: `BertVanBaelen/MailChat`
- Registry: `ghcr.io/bertvanbaelen/mailchat`
- Deployment: native Home Assistant add-on
- License: MIT

Planning and implementation status:

- [`ROADMAP.md`](ROADMAP.md)
- [`openspec/changes/start-mailchat`](openspec/changes/start-mailchat)
- [`docs/logo-mockups.html`](docs/logo-mockups.html)
