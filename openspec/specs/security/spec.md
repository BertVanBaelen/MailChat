# Security

## Purpose

Security controls protect OAuth credentials, custom mail credentials, mailbox content, and public Home Assistant deployments.

## Requirements

### Requirement: OAuth PKCE

The PWA SHALL use provider-supported authorization flows with PKCE or an equally secure supported mechanism.

#### Scenario: Authorization callback

- **WHEN** an OAuth callback completes
- **THEN** MailChat validates state and PKCE verifier
- **AND** stores provider credentials only in the encrypted device vault.

### Requirement: Encrypted local account vault

The PWA SHALL protect account secrets at rest on the device.

#### Scenario: Save custom account credentials

- **WHEN** custom account credentials are stored
- **THEN** MailChat encrypts them using Web Crypto
- **AND** uses an origin-bound key or platform-supported secure key mechanism where available.

#### Scenario: Export or backup

- **WHEN** a user creates a backup
- **THEN** MailChat never exports raw account passwords or refresh tokens in plain text
- **AND** requires explicit decryption confirmation.

### Requirement: Stateless add-on relay

The add-on SHALL keep account secrets in memory only for the duration of an operation.

#### Scenario: Relay request

- **WHEN** an operation is accepted
- **THEN** the add-on validates origin and request shape
- **AND** creates isolated provider clients
- **AND** destroys secret-bearing objects after completion.

### Requirement: Multi-user relay isolation

The relay SHALL isolate every request between users and devices.

#### Scenario: Multiple users call the relay

- **WHEN** users on two devices add custom mail accounts
- **THEN** the relay creates separate provider clients for each request
- **AND** each request supplies only its own ephemeral credentials
- **AND** neither user can read the other's mailbox, credentials, drafts, or Outbox.

#### Scenario: Relay process is inspected

- **WHEN** the relay process is running
- **THEN** it does not retain account passwords or refresh tokens in persistent storage
- **AND** it does not retain cross-user mailbox caches after the operation completes.

### Requirement: Email HTML sanitization

The PWA SHALL sanitize received HTML before rendering.

#### Scenario: HTML message contains active content

- **WHEN** an HTML message contains scripts, event handlers, unsafe URLs, or remote tracking
- **THEN** MailChat removes active content
- **AND** only allows explicitly approved remote resources.

### Requirement: SSRF and network controls

The custom mail relay SHALL prevent unsafe destination access.

#### Scenario: Custom host points to private infrastructure

- **WHEN** the user enters an IMAP or SMTP host
- **THEN** the add-on resolves the host
- **AND** rejects loopback, link-local, metadata, and private-network targets unless the target is the explicitly allowed Home Assistant network.

#### Scenario: Host redirects or DNS changes

- **WHEN** a relay attempt changes resolved address
- **THEN** MailChat revalidates the destination against the network policy.

### Requirement: Security CI

Pull requests SHALL run dependency, static-analysis, secret, container, and PWA security checks.

#### Scenario: Pull request to main

- **WHEN** a pull request targets `main`
- **THEN** lint, type-check, unit tests, dependency review, CodeQL, secret scanning, and container scan SHALL run
- **AND** merge SHALL be blocked on defined high-confidence failures.

#### Scenario: Release image

- **WHEN** a tagged release or release branch is built
- **THEN** the workflow creates provenance and SBOM metadata
- **AND** publishes a multi-architecture GHCR image.
