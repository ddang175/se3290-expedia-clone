# Contributing

This repository contains an academic travel booking prototype adapted from Chalo Ghume. Keep changes reproducible, describe their actual behavior, and preserve the original contributors' attribution in [README.md](README.md).

## Set up a working copy

Fork the repository that hosts the revision you intend to change, clone your fork, and create a focused branch:

```bash
git clone YOUR_FORK_URL
cd se3290-expedia-clone
git switch -c fix/describe-the-change
npm ci
cp .env.example .env.local
```

Replace the fork URL and directory name as needed. The final public submission repository is still pending confirmation; the origin recorded in the README is the source of this checkout.

Follow the [README's Firebase setup](README.md#run-locally), then run `npm run server` and `npm start` in separate terminals. The API uses port 8080; React uses port 3000. CI runs Node.js 22, while the recorded local environment uses Node.js 26.5.0 and npm 11.17.0.

`npm run server` creates `db.json` from the clean seed only if no local database exists. It does not reset existing accounts or reservations. Keep any database backup private. To test administration, register a fictional Firebase number, use the documented `grant-admin` command, then sign out and sign in again.

## Report a reproducible defect

Include enough information for another contributor to reproduce the behavior:

- A concise description of the expected and actual result.
- The revision, operating system, Node/npm versions, and browser used.
- The route, relevant synthetic catalog/traveler inputs, and numbered reproduction steps.
- Whether the API was running, and any relevant sanitized error message or request status.
- A screenshot or short recording when it clarifies the defect.

Do not include a real phone number, fixed Firebase test code, private environment file, local account/booking export, or payment information. Replace sensitive values with descriptive placeholders. Report an observed failure rather than guessing its cause.

## Make and verify changes

Keep each branch focused on a concrete behavior or defect. Use the shared `src/baseurl.js` API configuration instead of introducing additional service URLs. Preserve the Firebase phone-verification flow and the application's `+91` input convention unless a change explicitly includes international phone support.

New registration must remain a normal `user` account. Catalog deletion belongs in administrator workflows. Display save or booking success only after the API confirms the operation, and preserve retryable input when a request fails. Keep real-payment and supplier-inventory claims out of the demonstration flow.

Add or update meaningful tests when changing authentication, authorization behavior, booking rules, persistence, or catalog mutations. Tests should verify the outcome and relevant failure cases. Small presentation or documentation edits may use an appropriate visual or content check instead.

Before opening a pull request, run:

```bash
npm run test:ci
npm run build
```

For application changes, also check the affected flow in the browser. Automated Firebase tests use mocks; changes to the actual OTP flow require a private configured test number for browser verification. For an administrator mutation, use a clearly named disposable record, verify its saved change, and remove only that record afterward.

Do not claim a check passed unless you ran it. Describe failures, blocked checks, or untested cases in the pull request. A production build is not evidence of a public deployment or a live booking.

## Open a pull request

A reviewable pull request includes:

- The user-visible problem and the resulting behavior.
- The scope of the change and any necessary setup or data migration.
- The tests/build commands actually run and their outcomes.
- Browser evidence for changed interactions or layout, with private data removed.
- Any remaining limitations that affect use or review.

Check the diff for unrelated changes and generated/private files. Commit dependency changes with the updated lockfile. Keep sample-data updates in `db.seed.json` synthetic and preserve its empty account/booking collections; do not commit your working `db.json`. Update README/setup guidance when commands or configuration change.

## Data, documentation, and attribution

`.env.local`, `db.json`, `node_modules/`, `build/`, and local evidence under `artifacts/` are intentionally ignored. Do not commit service-account keys, private tokens, configured test credentials, or real user records. Browser `REACT_APP_*` configuration is visible in the client build and must not contain server secrets.

JSON Server does not enforce backend authentication or roles. Keep the demonstration API local. Any production-backend proposal must address token verification, roles, account ownership, validation, and durable storage; hiding a button or protecting a browser route is insufficient.

Keep the [final report](docs/FINAL_REPORT.md), [demonstration walkthrough](docs/DEMO_WALKTHROUGH.md), and [deliverables record](docs/DELIVERABLES.md) consistent with the final implementation and actual evidence. A script is not a recorded video, and an inherited deployment URL is not a deployment of this revision.

Retain credit to Kumkum, Ashish, Amit, Sagar Balsaraf, and Sarim, and distinguish inherited work from your changes. No `LICENSE` file is currently included; this guide does not declare a license or change the original work's license status.
