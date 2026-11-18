# Email Accounts

## Purpose

MailChat connects a device to existing Gmail, Microsoft, and custom TLS email accounts without creating a central MailChat user account.

## Requirements

### Requirement: Device-local account configuration

The system SHALL store account configuration on the device and SHALL NOT require a MailChat account.

#### Scenario: Add account

- **WHEN** a user adds an account
- **THEN** MailChat explains whether provider OAuth or custom IMAP/SMTP settings are required
- **AND** the account becomes usable without creating a MailChat identity.

#### Scenario: Reopen installed PWA

- **WHEN** a user reopens the installed PWA
- **THEN** MailChat restores enabled accounts from device-local storage
- **AND** does not download account secrets from a MailChat backend.

### Requirement: Gmail OAuth

The system SHALL support Gmail authorization using browser-compatible OAuth and the Gmail API.

#### Scenario: Gmail authorization succeeds

- **WHEN** Gmail authorization completes
- **THEN** MailChat stores the shortest-lived usable credentials permitted by the provider on the device
- **AND** synchronizes through Gmail API-compatible operations.

#### Scenario: Gmail authorization is revoked

- **WHEN** the provider returns an invalid or revoked credential
- **THEN** MailChat marks the account disconnected
- **AND** prompts the user to reconnect instead of silently retrying forever.

### Requirement: Microsoft OAuth

The system SHALL support Microsoft account authorization using Microsoft Graph.

#### Scenario: Microsoft account has multiple mail identities

- **WHEN** a Microsoft authorization selects an account with multiple addresses or aliases
- **THEN** MailChat lists each usable sending identity
- **AND** lets the user choose the default identity per account.

### Requirement: Custom IMAP and SMTP over TLS

The system SHALL support custom email accounts using IMAP for reading and SMTP for sending.

#### Scenario: Valid TLS configuration

- **WHEN** the user provides IMAP and SMTP hosts, ports, and credentials
- **THEN** MailChat validates TLS and authentication before enabling synchronization
- **AND** stores credentials only in the device-local encrypted account vault.

#### Scenario: Certificate or TLS failure

- **WHEN** IMAP or SMTP certificate validation fails
- **THEN** the app refuses the connection
- **AND** shows actionable host, certificate, and port diagnostics
- **AND** does not offer insecure TLS as a default.

### Requirement: Stateless mail relay

The add-on SHALL act as a relay and SHALL NOT become a mailbox account store.

#### Scenario: Custom mailbox sync

- **WHEN** the PWA requests a custom mailbox sync
- **THEN** the add-on receives the request over the authenticated public HTTPS origin
- **AND** uses credentials supplied ephemerally from the device
- **AND** does not persist those credentials.

#### Scenario: Add-on restart

- **WHEN** the add-on restarts
- **THEN** no account passwords or OAuth refresh tokens are restored from add-on storage.
