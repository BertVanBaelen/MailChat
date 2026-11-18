# MailChat

MailChat is a chat-oriented email PWA for Android and iOS. It presents existing Gmail, Microsoft, and custom TLS mail accounts as conversations while preserving standard email threading and MIME data.

The first deployment target is a native Home Assistant add-on. The PWA is public-origin and installable, but account choices and encrypted account state remain on the user's device.

## Project status

The repository is at the OpenSpec analysis stage. The requirements, architecture, security constraints, and CI/release proposal are available under [`openspec`](openspec/).

The interactive concept mockup is available at [`docs/mockup.html`](docs/mockup.html).

The first Graphify pass produced [`graphify-out/graph.html`](graphify-out/graph.html) and [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md).
The graph contains 74 nodes and 86 edges across 10 communities. Graph integrity found no dangling endpoints, missing endpoints, self-loops, or directed edge collapses.

## Core decisions

- PWA-first delivery, with no App Store or Play Store dependency
- Device-local account storage and mail cache
- Gmail and Microsoft OAuth
- Custom IMAP/SMTP over TLS
- Stateless Home Assistant mail relay
- Per-thread greeting and signature choices
- Original MIME preservation with cleaned chat presentation
- Dedicated newsletter read mode
- No-reply compose protection

## Repository

- GitHub: `BertVanBaelen/MailChat`
- Registry: `ghcr.io/bertvanbaelen/mailchat`
- Deployment: native Home Assistant add-on
- License: MIT
