# MailChat OpenSpec Analysis

## Baseline

MailChat is a PWA email client that uses chat-like bubbles but remains compatible with email providers and MIME. It is not a hosted email service.

The first deployment is a native Home Assistant add-on on a public HTTPS origin. The PWA and relay are one add-on image. Account credentials and mail state remain on the user's device.

## Architecture recommendation

- React + TypeScript + Vite
- Kokonut UI for focused interaction components
- Untitled UI for application structure and common UI primitives
- Workbox service worker
- IndexedDB/Dexie local cache
- Web Crypto encrypted account vault
- Fastify relay in the add-on
- ImapFlow and Nodemailer for custom accounts
- Gmail API and Microsoft Graph for OAuth accounts

## Critical implementation constraints

1. Browsers cannot reliably perform direct IMAP and SMTP sessions. Custom accounts require an add-on relay.
2. The relay must be stateless with respect to account secrets and mail credentials.
3. OAuth credentials should stay local to the browser. Public HTTPS is required for callback reliability.
4. iOS PWA background sync and push notifications are weaker than Android. Foreground sync is the baseline.
5. Origin isolation and CSP protect OAuth state and rendered mail.
6. HTML mail must be sanitized before rendering.
7. Custom relay destinations need SSRF/private-network rejection.
8. The original MIME message must remain unchanged while the chat view applies cleanups.
9. One relay may serve multiple users and devices, but every request must be isolated and ephemeral.

## GHCR and Home Assistant

Recommended repository:

- GitHub: `BertVanBaelen/MailChat`
- Registry: `ghcr.io/bertvanbaelen/mailchat`
- Source: public
- Package: public
- Deployment: Home Assistant add-on repository

Release tags should use semantic versions. Stable tags should publish an immutable digest plus `latest`; prereleases should use only prerelease tags.

## CI recommendation

PR checks:

- Format and lint
- TypeScript type-check
- Unit/component tests
- PWA production build
- CodeQL
- Secret scanning
- Dependency review
- Container build and Trivy scan
- SHA-pinned action review

Release checks:

- Multi-architecture build
- GHCR push
- SBOM
- Provenance
- Add-on version metadata

## Deferred decisions

- Which public DNS name and reverse proxy configuration
- Whether Gmail and Microsoft sync run entirely in-browser or through the relay
- Whether OAuth client IDs are public provider app registrations
- Android and iOS notification support after PWA beta
- Add-on architectures supported by the HA server
- Kokonut UI and Untitled UI package licenses and React compatibility
