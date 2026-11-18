# PWA Delivery

## Purpose

MailChat is installed on Android and iOS as a PWA and does not require app-store distribution.

## Requirements

### Requirement: Installable PWA

The app SHALL meet PWA install criteria and remain usable on mobile browsers.

#### Scenario: Android install

- **WHEN** Chrome or a compatible Android browser visits the public HTTPS origin
- **THEN** the app offers installation
- **AND** works as a standalone app after installation.

#### Scenario: iOS install

- **WHEN** Safari visits the public HTTPS origin
- **THEN** the app provides concise Add to Home Screen instructions
- **AND** works in standalone display mode.

### Requirement: Offline shell and local cache

The PWA SHALL serve a cached shell and locally available messages without a network connection.

#### Scenario: Device has no network

- **WHEN** the PWA opens offline
- **THEN** the app shows cached conversations and drafts
- **AND** clearly distinguishes cached data from live provider data.

#### Scenario: Message send is offline

- **WHEN** a user sends mail while offline
- **THEN** MailChat creates a local Outbox entry
- **AND** retries safely without creating duplicate messages.

### Requirement: Update behavior

The PWA SHALL version releases and control when a new service worker activates.

#### Scenario: New release is deployed

- **WHEN** a new version becomes available
- **THEN** MailChat shows an optional update notice
- **AND** activates the new version without discarding local account state.

### Requirement: Push limitations

The PWA SHALL explain platform notification limitations and degrade gracefully.

#### Scenario: iOS background sync is unavailable

- **WHEN** iOS does not permit background PWA synchronization
- **THEN** MailChat syncs when foregrounded
- **AND** informs the user instead of claiming real-time push delivery.
