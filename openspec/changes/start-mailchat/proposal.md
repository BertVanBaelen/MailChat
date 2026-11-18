# Change: Start MailChat

## Why

Create a PWA that makes email conversations easier to scan while retaining standard email interoperability. The add-on is intended to run on a Home Assistant server, but account credentials and mailbox state remain per device.

## What Changes

- Scaffold a React, TypeScript, and Vite PWA.
- Add provider adapters for Gmail, Microsoft, and custom IMAP/SMTP.
- Add a device-local encrypted account vault.
- Add IMAP/SMTP relay endpoints to the Home Assistant add-on.
- Add message-ID thread reconstruction and cleaned chat rendering.
- Add per-thread greeting and signature presets.
- Add newsletter and no-reply read modes.
- Add install and offline behavior for Android and iOS.
- Add GHCR multi-architecture publishing and semantic versioning.
- Add security and PR-quality GitHub Actions.

## Design Decisions

1. A PWA, not an App Store or Play Store app, is the first release.
2. MailChat is an email client, not a hosted email provider.
3. The add-on is stateless; it holds neither account configuration nor mailbox credentials on disk.
4. Account secrets and refresh tokens are local to the browser vault.
5. The add-on mail relay receives ephemeral provider credentials per operation.
6. Gmail and Microsoft use provider APIs; custom accounts use IMAP/SMTP.
7. Original MIME data remains immutable and the cleaned view is reconstructive only.
8. Thread grouping prefers message IDs and reply relationships over subject matching.
9. Newsletters enter a dedicated page reader and are not normal chat conversations.
10. The public HTTPS origin is the base for PWA caching and OAuth callbacks.

## Key Risk

Browser PWAs cannot reliably perform direct IMAP/SMTP operations. A server relay is required for custom TLS accounts. This relay must never persist credentials and must enforce destination-network controls.

The PWA must also account for iOS background-sync and notification limitations. Android will receive better background behavior; iOS foreground sync is the reliable baseline.
