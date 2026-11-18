# Newsletters and No-Reply Mail

## Purpose

Newsletters and no-reply senders are presented as read material instead of unreliable chat conversations.

## Requirements

### Requirement: Newsletter detection

The system SHALL classify bulk and newsletter-like mail using providers' list headers and sender traits.

#### Scenario: Mailing-list headers are present

- **WHEN** a message contains `List-Id`, `List-Unsubscribe`, or compatible bulk headers
- **THEN** MailChat routes it to the Newsletter view
- **AND** records the originating mailing-list address separately.

#### Scenario: Sender name looks personal

- **WHEN** the visible name looks personal but headers classify the message as bulk
- **THEN** the newsletter classification SHALL take precedence
- **AND** the cleaned thread view SHALL remain available as a fallback.

### Requirement: Page reader

Newsletter messages SHALL render in a page-reader view with no normal reply box.

#### Scenario: Open newsletter

- **WHEN** a user opens a newsletter
- **THEN** MailChat shows sender, subject, date, sanitized HTML, and external article actions
- **AND** does not show a compose box.

#### Scenario: Newsletter uses a tracked web view

- **WHEN** the newsletter contains external tracking and article links
- **THEN** MailChat separates tracking URLs from visible destination URLs
- **AND** applies link confirmation and privacy protections before navigation.

### Requirement: No-reply detection

The system SHALL detect no-reply and support-like sender addresses.

#### Scenario: Standard no-reply address

- **WHEN** the sender address contains a no-reply pattern or provider-specific no-reply marker
- **THEN** MailChat disables Reply and compose for that thread
- **AND** offers only original-message, unsubscribe, and external-support actions.

#### Scenario: User overrides no-reply protection

- **WHEN** a user attempts to compose despite no-reply detection
- **THEN** MailChat requires a confirmation dialog
- **AND** does not automatically retry or open a compose window before confirmation.

### Requirement: Mailing-list reply choices

The system SHALL offer safe Reply and Reply all choices for mailing-list mail.

#### Scenario: Mailing list has reply-to metadata

- **WHEN** a list message includes `Reply-To` or list-specific headers
- **THEN** MailChat shows the actual destination and sender identity
- **AND** asks before Reply all if the list may expose many recipients.
