# Chat Thread View

## Purpose

MailChat reconstructs email threads and presents them as a chronological chat while preserving standard email transport behavior.

## Requirements

### Requirement: Message-ID thread grouping

The system SHALL group mail using RFC message identifiers and their reply/forward relationships.

#### Scenario: Normal reply

- **WHEN** a new message contains an `In-Reply-To` or `References` chain matching an existing thread
- **THEN** MailChat appends the message chronologically to that thread.

#### Scenario: Subject-only match

- **WHEN** a message has no matching message IDs but has a compatible subject
- **THEN** MailChat may suggest a thread match
- **AND** SHALL provide a deterministic original-header view if the match is uncertain.

### Requirement: Sender-based bubbles

The system SHALL render each original message as a bubble attributed to its sender.

#### Scenario: One sender sends several messages

- **WHEN** one sender sends multiple messages in the same thread
- **THEN** each message remains a separate bubble with timestamp and delivery state
- **AND** repeated sends are not collapsed into a single chat entry.

#### Scenario: Multiple recipients reply

- **WHEN** a thread has several recipients
- **THEN** MailChat shows the sender and reply mode
- **AND** distinguishes Reply, Reply all, and Forward actions.

### Requirement: Cleanup view

The system SHALL hide repeated signatures, generic greetings, footers, and quoted histories only in the cleaned chat view.

#### Scenario: Signature is hidden

- **WHEN** cleanup identifies a repeated signature
- **THEN** the bubble shows a concise note that cleanup was applied
- **AND** the original MIME and signature remain available.

#### Scenario: Cleanup detection is uncertain

- **WHEN** cleanup cannot distinguish content from a real message
- **THEN** MailChat preserves the content
- **AND** offers manual hide/show controls.

### Requirement: Per-thread compose presets

Greeting and signature selections SHALL be stored independently for each thread.

#### Scenario: Switch threads

- **WHEN** a user selects a greeting and signature for one thread
- **AND** switches to another thread
- **THEN** that thread opens with its own saved preset choices
- **AND** account defaults are not silently substituted.

#### Scenario: Multiple outgoing mails

- **WHEN** a user sends multiple messages in the same thread
- **THEN** the per-thread presets remain active
- **AND** each sent MIME message receives the selected greeting and signature exactly once.

#### Scenario: Forwarded message

- **WHEN** a user forwards a message
- **THEN** it is rendered as a distinct forwarded bubble or action
- **AND** it does not merge with the original sender's personal history.

### Requirement: Original preservation

The system SHALL preserve original mail headers and content independently of the cleaned view.

#### Scenario: Show original

- **WHEN** a user selects "Show original"
- **THEN** MailChat shows the complete MIME-derived content without mutating stored source data.
