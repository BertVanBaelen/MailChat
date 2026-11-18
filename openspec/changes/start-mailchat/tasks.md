# Tasks: Start MailChat

## 1. Foundation

- [ ] Confirm public HTTPS origin and OAuth callback URLs.
- [ ] Scaffold the GitHub repository and OpenSpec structure.
- [ ] Scaffold React, TypeScript, Vite, PWA, and lint/test tooling.
- [ ] Add strict component, lint, and build configuration.
- [ ] Add Kokonut UI and Untitled UI only after license and package checks.

## 2. Local account vault

- [ ] Implement account metadata and Web Crypto secret storage.
- [ ] Implement Gmail OAuth with PKCE.
- [ ] Implement Microsoft OAuth with PKCE.
- [ ] Implement custom IMAP/SMTP configuration and TLS validation.
- [ ] Add account reconnect and revoke states.

## 3. Mail relay

- [ ] Scaffold Fastify inside the Home Assistant add-on image.
- [ ] Implement Gmail and Microsoft provider adapters.
- [ ] Implement ImapFlow sync adapter.
- [ ] Implement Nodemailer send adapter.
- [ ] Reject loopback, link-local, metadata, and private destinations.
- [ ] Add request limits and bounded attachment handling.

## 4. Mail parser and thread engine

- [ ] Preserve raw MIME messages locally.
- [ ] Implement message-ID and References grouping.
- [ ] Implement conservative subject fallback.
- [ ] Implement sender bubble projection.
- [ ] Implement signature, greeting, footer, and quoted-history cleanup.
- [ ] Preserve "Show original" behavior.

## 5. Compose

- [ ] Store greeting and signature presets per thread.
- [ ] Add Reply, Reply all, and Forward states.
- [ ] Insert selected presets exactly once in each outgoing MIME.
- [ ] Add local drafts and Outbox retry state.
- [ ] Add no-reply confirmation and override behavior.

## 6. Newsletter view

- [ ] Implement list-header and bulk classification.
- [ ] Add page-reader HTML rendering.
- [ ] Add safe external-link confirmation.
- [ ] Disable compose for newsletters and no-reply senders.
- [ ] Add archive, unsubscribe, and move-to-chat actions.

## 7. PWA

- [ ] Add install manifest and icons.
- [ ] Add service-worker update behavior.
- [ ] Add offline shell and cached thread behavior.
- [ ] Document iOS foreground-sync limits.
- [ ] Add Android and iOS smoke checks.

## 8. Home Assistant

- [ ] Create add-on repository layout.
- [ ] Configure ingress and public reverse-proxy routing.
- [ ] Build `aarch64` and `amd64` release images.
- [ ] Publish versioned GHCR packages.
- [ ] Document installation and upgrade behavior.

## 9. Security and automation

- [ ] Add pull-request lint, typecheck, test, and build checks.
- [ ] Add CodeQL.
- [ ] Add secret scanning.
- [ ] Add dependency review and lockfile auditing.
- [ ] Add container image scanning.
- [ ] Add SBOM and provenance.
- [ ] Add release workflow for tags and immutable digests.
