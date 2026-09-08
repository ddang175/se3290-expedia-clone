# Deliverables and verification record

This record describes the final local implementation and checks reported for this revision. **Browser verification, automated coverage, and code presence are separate evidence categories.** No public deployment, final repository push, or demonstration recording is claimed.

## Deliverable status

| Deliverable | Status | Remaining action |
| --- | --- | --- |
| Application source | Implemented locally; integrated workflows verified as listed below | Confirm final repository destination and publish the reviewed revision |
| Final report | Complete in [FINAL_REPORT.md](FINAL_REPORT.md), with verified results and limitations | Add student metadata and final submission links |
| Architecture/technology/deployment explanation | Included in the report and [README](../README.md) | No feature-description placeholders remain |
| Challenges, solutions, and future work | Included in the report | Retain the distinction between local prototype and production service |
| Local setup | Seed, environment template, JSON Server dependency, setup/admin helpers, and instructions present | Reviewer supplies their own Firebase configuration/test account |
| Automated validation | **61 tests passed in 14 suites**; final CI-mode build passed | Remote CI run is not claimed until publication triggers one |
| Contribution process | [CONTRIBUTING.md](../CONTRIBUTING.md) and GitHub Actions workflow present | Confirm repository permissions for publication |
| Attribution | Original contributors and upstream/origin repositories credited | Preserve attribution in the submitted narration/captions |
| 5–10 minute demonstration | Exact seven-minute script at [DEMO_WALKTHROUGH.md](DEMO_WALKTHROUGH.md) | **Actual recording not made**; narration/caption format awaits user choice |
| Public repository delivery | Pending | Destination not yet confirmed; current connected account has read-only access to the existing public fork |
| Public application deployment | **Not performed** | Do not present historical upstream hosting as this revision |
| Final course submission | Pending external details and delivery | Add metadata, actual repository/recording links, and submit |

## Browser-verified workflows

| Check | Result and observed evidence |
| --- | --- |
| Normal Firebase phone sign-in | **PASS.** Privately configured fictional number completed verification; no login bypass used. |
| Account navigation and refresh | **PASS.** Account, Admin, and Trips appeared; full page reload retained sign-in. |
| Hotel query and filters | **PASS.** Bangalore, October 10–12, 2026 remained in the search query. Ascending price and minimum rating 4 returned four results. |
| Selected hotel and quotation | **PASS.** Dbrooks, record 42, showed ₹1,300 × 2 nights plus ₹468 taxes = **₹3,068**. |
| Hotel booking persistence | **PASS.** `POST /bookings` saved a UUID booking, confirmation appeared, and Trips retained it after reload. |
| Flight search and quotation | **PASS.** Delhi → Mumbai, October 10, 2026, ₹5,000–₹6,000 filter returned IndiGo at ₹5,999; two travelers totaled **₹11,998**. |
| Flight booking and Trips | **PASS.** The saved flight and hotel bookings both appeared in Trips. |
| Activity destination/text search | **PASS.** The page loaded 54 activities; Delhi plus the query Lotus returned one result. |
| Admin dashboard | **PASS.** Baseline counts showed 239 hotels, 22 flights, and 54 activities. |
| Admin flight create/search/edit | **PASS.** QA Demo Air was added locally at ₹4,500, found through search, and updated through PATCH to **₹4,200**. |
| Admin-to-public catalog consistency | **PASS.** The changed temporary flight price appeared in public flight search. |

The specific dates and prices describe the verified sample data. Rehearse with valid future dates when making the actual video. The temporary QA flight and saved bookings are local records; they are not included in the clean seed.

## Automated results and remaining verification limits

The full local suite passed **61 tests across 14 suites** using the project's noninteractive test command:

```bash
npm run test:ci
```

Six final UI regressions also cover checkout autofill, cleared form values, invalid dates, and confirmation banners for cancelled records using mocked APIs. No live cancellation is claimed.

The suite covers account/session behavior, registration/login control flow, route guards, hotel and flight catalog rules, activity behavior, booking validation/pricing, and administrative actions/forms. Firebase and HTTP mocks in tests exercise application behavior without replacing the separate browser checks above.

The final production build passed:

```bash
CI=true npm run build
```

The build had **zero application warnings**. An outdated Browserslist-data notice was nonfatal. Scoped admin ESLint and `git diff --check` also passed. These are local results, not evidence of a remote CI run or public release.

| Area | Honest verification limit |
| --- | --- |
| Live cancellation | Implemented in Trips, but **not browser-verified**. Automatic approval review blocked the attempted UI action; explicit user approval remains pending. No successful cancellation is claimed. |
| Catalog deletion | Record-specific DELETE, state retention on failure, and correct asynchronous handling passed automated tests. **No live browser deletion was verified.** |
| Hotel administration | Shared forms/actions have automated coverage. The live create/edit example was a flight, not a hotel. |
| Account registration and persistence variants | Covered by automated checks; the explicitly recorded browser evidence is sign-in and full reload. No additional manual scenario is inferred. |
| Interface authorization | Guard logic has automated coverage and the intended admin account opened its interface. JSON Server still lacks server-side token/role/ownership enforcement. |
| Responsive/accessibility/failure-path breadth | Improvements exist, but exhaustive browser/viewport/accessibility testing is not claimed. |
| Fresh reviewer environment | Reproducible commands and a lockfile are provided. The local environment passed validation; another machine's fresh installation is not claimed as tested. |

## Runtime, data, and configuration

| Item | Verified or inspected state |
| --- | --- |
| Local Node.js/npm | **26.5.0 / 11.17.0** |
| CI target | Node.js **22** in `.github/workflows/ci.yml`; remote execution pending publication |
| Client | `http://localhost:3000` |
| JSON API | `http://localhost:8080`, bound to `127.0.0.1` |
| Shared API configuration | `src/baseurl.js`, from `REACT_APP_API_BASE_URL` with local default |
| Firebase configuration | Environment-based initialization; populated `.env.local` is ignored |
| Firebase test setup | Phone provider and privately configured fictional number/code; no active credentials recorded here |
| Shareable seed | **239 hotels, 22 flights, 54 activities, 19 gift cards** |
| Seed accounts/reservations/carts | Empty `users`, `bookings`, `hotelcart`, and `flightcart` collections |
| Hotel city cleanup | **72 explicit city mappings; 167 unassigned**, applied to seed and local data without guessed city assignments |
| Local data | `db.json` retained on disk, ignored, and removed from Git tracking |
| Data startup helper | `scripts/setup-data.cjs` copies the seed only if local `db.json` is absent |
| Administrator helper | `scripts/grant-admin.cjs` promotes an existing local account; fresh login reloads its role |
| Temporary verification data | Local bookings and QA admin flight; absent from the shareable seed |
| Public client/API URL | None for this revision |
| Final published commit | Pending destination confirmation and publication |

An isolated temporary-directory check of the data setup helper passed: first run created 239 hotels with empty users/bookings; after a local user was added, the second run preserved that record. This establishes the helper's seed/preservation behavior without claiming that another machine's full dependency installation was tested.

Firebase sign-in initially returned an SMS region-policy error. The user reported it working after correcting the India policy, and the later browser check verified the local fictional-number flow. This does not establish that all test-number requests bypass policy or that localhost supports real SMS generally. Follow the current [Firebase phone-auth guide](https://firebase.google.com/docs/auth/web/phone-auth) for hosted-domain and provider requirements.

The connected account currently has read-only access to the existing public fork. No final destination has been selected and no final repository push has occurred. The source origin is attribution/provenance, not proof of delivery.

## Recording and external submission items

| Item | Status |
| --- | --- |
| Student full name and ID | Awaiting student |
| Instructor, course section, submission date/channel | Awaiting student/course details |
| Final repository destination | Awaiting confirmation |
| Repository publication and accessible final commit | Pending |
| Narration versus captions | Awaiting user choice |
| Actual video file | **Not recorded** |
| Measured video duration | Not available; script target **7:00** |
| Video viewing link and reviewer access check | Pending actual recording |
| Public hosting | Unperformed; do not imply completion |
| Final upload/submission receipt | Pending |

Do not include phone-verification codes, configured test phone numbers, private environment values, real payment information, or unrelated account data in the public artifacts.

## Final submission review

- [x] Application report reflects implemented behavior and observed local results.
- [x] Original contributors are credited and inherited work is distinguished from this revision.
- [x] Browser evidence includes real configured Firebase sign-in, search, persistent hotel/flight bookings, and admin flight create/edit.
- [x] Full local test suite and final CI-mode build passed.
- [x] Shareable seed excludes accounts, bookings, carts, and temporary QA additions.
- [x] Cancellation and live deletion are explicitly unverified rather than represented as complete checks.
- [ ] Student metadata completed.
- [ ] Repository destination confirmed and the final revision published with appropriate access.
- [ ] Actual 5–10 minute recording created in the chosen format and reviewed.
- [ ] Video/repository links checked for the intended reviewer.
- [ ] Artifacts submitted through the actual course channel.
