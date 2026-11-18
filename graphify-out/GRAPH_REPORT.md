# Graph Report - MailChat  (2026-11-18)

## Corpus Check
- 11 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 74 nodes · 86 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 2% INFERRED · 3% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Mail Relay
- PWA and Compose
- Local Vault
- OAuth Providers
- Home Assistant Packaging
- Releases and CI
- Thread Reconstruction
- Newsletter Reader
- Mailing List Detection

## God Nodes (most connected - your core abstractions)
1. `Stateless Mail Relay` - 12 edges
2. `Chat-oriented Email PWA` - 11 edges
3. `Device-local Account Storage` - 6 edges
4. `Home Assistant Add-on` - 5 edges
5. `Gmail OAuth` - 5 edges
6. `Microsoft OAuth` - 5 edges
7. `Custom IMAP and SMTP` - 4 edges
8. `Immutable Original MIME` - 4 edges
9. `Message-ID Thread Grouping` - 4 edges
10. `Newsletter Page Reader` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Browser IMAP and SMTP Constraint` --rationale_for--> `Stateless Mail Relay`  [EXTRACTED]
  openspec/ANALYSIS.md → openspec/project.md
- `Relay Statelessness Constraint` --rationale_for--> `Stateless Mail Relay`  [EXTRACTED]
  openspec/ANALYSIS.md → openspec/project.md
- `Device-local Account Configuration` --implements--> `Device-local Account Storage`  [EXTRACTED]
  openspec/specs/email-accounts/spec.md → openspec/project.md
- `Gmail API Account Synchronization` --implements--> `Gmail OAuth`  [EXTRACTED]
  openspec/specs/email-accounts/spec.md → openspec/project.md
- `Microsoft Graph Account Synchronization` --implements--> `Microsoft OAuth`  [EXTRACTED]
  openspec/specs/email-accounts/spec.md → openspec/project.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Device Account Security Flow** — openspec_project_device_local_account_storage, openspec_project_web_crypto, openspec_specs_security_spec_encrypted_local_account_vault, openspec_specs_security_spec_oauth_pkce, openspec_specs_email_accounts_spec_device_local_account_configuration [EXTRACTED 1.00]
- **Stateless Custom Mail Relay** — openspec_project_stateless_mail_relay, openspec_project_custom_imap_smtp, openspec_specs_email_accounts_spec_ephemeral_relay_credentials, openspec_specs_security_spec_stateless_add_on_relay, openspec_specs_security_spec_ssrf_controls, openspec_analysis_browser_imap_constraint [EXTRACTED 1.00]
- **Chat Mail Thread View** — openspec_project_chat_oriented_email_pwa, openspec_specs_chat_thread_spec_message_id_thread_grouping, openspec_specs_chat_thread_spec_sender_bubbles, openspec_specs_chat_thread_spec_cleanup_view, openspec_specs_chat_thread_spec_original_preservation, openspec_changes_start_mailchat_design_thread_engine [EXTRACTED 1.00]

## Communities (10 total, 1 thin omitted)

### Community 0 - "Mail Relay"
Cohesion: 0.19
Nodes (4): Ephemeral Custom Account Relay Flow, Mail Relay Implementation Tasks, Custom IMAP and SMTP, Custom IMAP SMTP TLS Configuration

### Community 1 - "PWA and Compose"
Cohesion: 0.15
Nodes (10): Compose Implementation Tasks, Foundation Implementation Tasks, PWA Implementation Tasks, Chat-oriented Email PWA, Public HTTPS Origin, React TypeScript Vite, Per-thread Compose Presets, Sender-based Message Bubbles (+2 more)

### Community 2 - "Local Vault"
Cohesion: 0.22
Nodes (9): Account Vault Implementation Tasks, Device-local Account Storage, IndexedDB and Dexie, Web Crypto, Workbox, Device-local Account Configuration, Add-on Configuration, Offline Local Outbox (+1 more)

### Community 3 - "OAuth Providers"
Cohesion: 0.38
Nodes (6): Gmail PKCE Provider Flow, Microsoft PKCE Provider Flow, Gmail OAuth, Microsoft OAuth, Gmail API Account Synchronization, Microsoft Graph Account Synchronization

### Community 4 - "Home Assistant Packaging"
Cohesion: 0.29
Nodes (7): Home Assistant Packaging Layout, Home Assistant Implementation Tasks, Home Assistant Add-on, MailChat, Home Assistant Add-on Repository, Home Assistant Ingress, Multi-architecture Add-on Images

### Community 5 - "Releases and CI"
Cohesion: 0.29
Nodes (6): PWA SemVer Update Model, Security and Automation Implementation Tasks, GitHub and GHCR, Semantic Releases, Versioned GHCR and Add-on Releases, PWA Service-worker Update

### Community 6 - "Thread Reconstruction"
Cohesion: 0.38
Nodes (5): Thread Reconstruction Engine, Message Thread Reconstruction, Mail Parser and Thread Implementation Tasks, Cleaned Chat View, Message-ID Thread Grouping

### Community 7 - "Newsletter Reader"
Cohesion: 0.67
Nodes (4): Newsletter Read Modes, Newsletter Implementation Tasks, No-reply Detection, Newsletter Page Reader

### Community 8 - "Mailing List Detection"
Cohesion: 1.00
Nodes (3): Weighted Newsletter Classifier, Mailing-list Reply Choices, Newsletter Detection

## Ambiguous Edges - Review These
- `Gmail OAuth` → `Stateless Mail Relay`  [AMBIGUOUS]
  openspec/ANALYSIS.md · relation: conceptually_related_to
- `Microsoft OAuth` → `Stateless Mail Relay`  [AMBIGUOUS]
  openspec/ANALYSIS.md · relation: conceptually_related_to
- `GitHub and GHCR` → `Public HTTPS Origin`  [AMBIGUOUS]
  openspec/ANALYSIS.md · relation: conceptually_related_to

## Knowledge Gaps
- **23 isolated node(s):** `Device-local Account Configuration`, `Gmail API Account Synchronization`, `Microsoft Graph Account Synchronization`, `Sender-based Message Bubbles`, `Cleaned Chat View` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 31 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Chat-oriented Email PWA` connect `PWA and Compose` to `Local Vault`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `Device-local Account Configuration`, `Gmail API Account Synchronization`, `Microsoft Graph Account Synchronization` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `Immutable Original MIME` connect `Thread Reconstruction` to `PWA and Compose`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Gmail OAuth` and `Stateless Mail Relay`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Microsoft OAuth` and `Stateless Mail Relay`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `GitHub and GHCR` and `Public HTTPS Origin`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._