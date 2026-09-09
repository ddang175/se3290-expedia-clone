# Chalo Ghume · SE3290 Expedia Clone

An educational travel booking application built with React, Redux, Firebase phone authentication, and a local JSON Server API. Browse sample hotels, flights, and activities; create an account; save demonstration bookings; review Trips; and maintain the catalog through an administrator interface.

Reservations are local demonstration records. The application does not process payments, contact travel providers, or confirm real inventory.

## Run locally

Use the project checkout containing this revision. CI targets **Node.js 22**; local verification used **Node.js 26.5.0 and npm 11.17.0**. Install the committed dependency versions:

```bash
npm ci
cp .env.example .env.local
```

Populate the Firebase values in `.env.local` with your Firebase web application's configuration. Keep `REACT_APP_API_BASE_URL=http://localhost:8080` for the default local API. Restart `npm start` after changing environment values.

Configure Firebase Authentication before trying registration or sign-in:

1. Enable the Phone sign-in provider in your Firebase project.
2. In **Authentication → Settings → SMS region policy**, allow **India (+91)** for this application's existing phone-number format. An empty region allowlist blocked verification during this project's setup.
3. Configure a fictional **+91** phone number and its fixed verification code under **Phone numbers for testing**. Keep those values private.
4. Enter only the **10 national digits** in the application; it adds `+91` before contacting Firebase.

No configured test number or verification code is included in the repository. Authentication uses the normal Firebase verification flow; there is no development login bypass.

The configured fictional-number flow was verified on localhost in this project. Firebase's current [phone-authentication guide](https://firebase.google.com/docs/auth/web/phone-auth) restricts localhost as a hosted domain for phone authentication; this local test is not a guarantee of real-SMS support on localhost. Any hosted frontend must have its actual domain configured in Firebase Authentication.

Start the API in one terminal:

```bash
npm run server
```

This runs `scripts/setup-data.cjs`, which creates an ignored `db.json` from `db.seed.json` **only when `db.json` is absent**, then starts JSON Server on `127.0.0.1:8080`. The seed contains sample catalog records and empty account/booking collections. Existing local data is preserved across server restarts.

Start React in a second terminal:

```bash
npm start
```

Open [the local application](http://localhost:3000). The local API is [localhost:8080](http://localhost:8080). Both processes are needed for the complete application; phone verification also requires access to Firebase.

`.env.local`, `db.json`, installed dependencies, build output, and local evidence artifacts are ignored. `REACT_APP_*` values are included in the browser build: never use them for service-account keys or other server secrets.

## Application workflows

| Area | Behavior |
| --- | --- |
| Accounts | Register a verified phone number and name; sign in with an OTP; sign out from the navigation bar. |
| Session | A normal sign-in survives refresh in its browser tab. “Keep me signed in” uses persistent browser storage until sign-out. Legacy passwords are excluded from saved sessions. |
| Hotels and flights | Search sample catalog records, apply supported filters/sorting, and carry a selection into checkout. |
| Activities | Browse destination activities, including explicit empty results. |
| Checkout | Validate traveler details and save a demonstration reservation associated with the signed-in account. No card details or payment are collected. |
| Trips | Review the account's saved demonstration bookings at `/trips`. |
| Administration | Users with the explicit `admin` role can open `/admin` and create, edit, or delete local hotel/flight catalog records. |

Registration waits for the API save before showing the sign-in page. Checkout and administration require the appropriate signed-in state in the interface. Failed requests display feedback rather than claiming success.

To grant an existing local account administrator access, register it first, then replace `YOUR_REGISTERED_10_DIGIT_NUMBER` with its national phone number:

```bash
npm run grant-admin -- YOUR_REGISTERED_10_DIGIT_NUMBER
```

Sign out and sign in again to load the updated role. New registrations receive the `user` role; the application does not offer self-service administrator registration.

## Project structure

```text
src/
  Pages/                 Routes, accounts, catalog, checkout, Trips, admin
  Components/            Shared navigation, route guards, search controls
  Redux/                 State, authentication, and catalog actions
  services/              Booking operations and validation
  01_firebase/           Firebase initialization from environment values
  baseurl.js             Shared API base URL
scripts/                 Local data setup and administrator helper
public/                  Static application assets
.github/workflows/       Automated validation
docs/                    Report, demonstration script, deliverables record
db.seed.json             Shareable catalog seed with no accounts/bookings
.env.example             Configuration variable names and placeholders
```

## Validation and contribution

```bash
npm run test:ci
npm run build
```

The tests cover authentication/session behavior, route guards, catalog behavior, booking rules, and administrative forms. Authentication unit/integration tests mock Firebase and do not replace a browser check with a privately configured test number. The production build writes static assets to `build/`; it does not publish the application or start its API.

The [GitHub Actions workflow](.github/workflows/ci.yml) installs dependencies, runs tests, and builds on Node.js 22. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process, and [the deliverables record](docs/DELIVERABLES.md) for actual verification outcomes and remaining submission items.

## Scope and deployment status

JSON Server is a local demonstration data service. It does **not** validate Firebase ID tokens or enforce account ownership and administrator permissions on the server. Browser route guards and role checks control the interface; they are not a secure backend authorization boundary. Keep this service local and use synthetic account/traveler data.

A production release needs a protected backend with token verification, server-enforced roles and ownership, request validation, and durable storage before exposing account or booking data. Live inventory and payments would require separate provider integrations.

**This revision has not been publicly deployed.** The final public submission repository is pending confirmation, and no demonstration video is claimed as recorded. Historical upstream deployment links do not represent this revision.

- [Final report](docs/FINAL_REPORT.md)
- [Demonstration walkthrough and recording checklist](docs/DEMO_WALKTHROUGH.md)
- [Deliverables, verification evidence, and pending submission items](docs/DELIVERABLES.md)

## Attribution and license status

The original Chalo Ghume project credits **Kumkum (team lead), Ashish, Amit, Sagar Balsaraf, and Sarim**. Its original repository is [kumkumdutta/interesting-stretch-8935](https://github.com/kumkumdutta/interesting-stretch-8935). This checkout originated from [ddang175/se3290-expedia-clone](https://github.com/ddang175/se3290-expedia-clone); that origin is not a claim that the current local changes have been published there.

The SE3290 revision builds on those contributors' work with setup, application repairs, validation, and documentation. Preserve their attribution when describing your own contributions. No `LICENSE` file is currently included in this checkout; this README does not declare a license or relicense the original work.
