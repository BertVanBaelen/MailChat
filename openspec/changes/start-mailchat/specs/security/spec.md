# Security Delta

## ADDED Requirements

### Requirement: Pull-request security checks

Pull requests SHALL run static analysis, dependency review, secret scanning, container scanning, and PWA build checks.

#### Scenario: Pull request targets main

- **WHEN** a pull request targets `main`
- **THEN** the workflow runs type-checking, tests, CodeQL, secret detection, dependency review, and a release-container build
- **AND** a merge remains blocked until the required checks pass.

### Requirement: Release provenance

Release containers SHALL include provenance and an SBOM.

#### Scenario: Semantic version tag is pushed

- **WHEN** a `v*.*.*` tag is pushed
- **THEN** GitHub Actions publishes a signed in-repository provenance record and SPDX SBOM for the immutable GHCR digest
- **AND** tags the add-on manifest with the same semantic version.
