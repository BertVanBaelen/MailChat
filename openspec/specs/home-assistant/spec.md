# Home Assistant Add-on

## Purpose

MailChat is distributed as a native Home Assistant add-on and can be published to GHCR with multi-architecture container images.

## Requirements

### Requirement: Add-on repository structure

The source repository SHALL contain a valid Home Assistant add-on repository layout.

#### Scenario: Add-on discovery

- **WHEN** a user adds the GitHub repository as a Home Assistant add-on repository
- **THEN** Home Assistant discovers MailChat
- **AND** resolves the add-on image, architecture, and version.

### Requirement: Multi-architecture images

Release images SHALL support every architecture declared by the add-on.

#### Scenario: Release on ARM or x86

- **WHEN** a release workflow runs
- **THEN** it builds supported amd64 and ARM add-on images
- **AND** publishes matching image tags to GHCR.

### Requirement: Public HTTPS origin

The add-on SHALL support reverse-proxy or public domain configuration.

#### Scenario: Add-on is served publicly

- **WHEN** an HTTPS reverse proxy routes to the add-on
- **THEN** the PWA is served from one stable origin
- **AND** OAuth redirects, PWA manifest, service worker, and CSP use that origin.

### Requirement: HA ingress

The add-on SHALL support Home Assistant ingress for local use.

#### Scenario: Open through HA sidebar

- **WHEN** a user opens the add-on through ingress
- **THEN** the app receives a valid same-origin path
- **AND** local account storage remains origin-specific.

### Requirement: Add-on configuration

The add-on SHALL separate public routing settings from account state.

#### Scenario: Configure add-on

- **WHEN** a user configures the public origin or relay limits
- **THEN** the add-on validates configuration
- **AND** never stores mailbox account settings in Home Assistant configuration.

### Requirement: Versioned releases

GHCR and add-on versions SHALL correspond to released source versions.

#### Scenario: GitHub tag is published

- **WHEN** a semantic version tag is pushed
- **THEN** GitHub Actions publish matching `ghcr.io/bertvanbaelen/mailchat:<version>` and immutable digest
- **AND** update the add-on `updater.json` or `config.json` version.
