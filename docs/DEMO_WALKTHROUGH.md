# Seven-minute demonstration walkthrough

**Recording status: not recorded.** The user has not yet chosen personal narration versus a captioned demonstration. This script supports either format, but no video, voice track, duration, or viewing link is claimed as delivered. Target duration is **7:00**, within the required 5–10 minutes.

## Preparation

- Start both local processes using the [README](../README.md): React at `http://localhost:3000` and JSON Server at `http://localhost:8080`. Firebase requires network access and privately configured provider/test-number settings.
- Use synthetic traveler data and the privately configured fictional Firebase account. The verified administration account already has the local `admin` role; a fresh setup must register an account and use the documented administrator helper.
- Do not display the configured phone number, fixed code, environment file, other account records, or unrelated browser tabs. Frame or conceal credential entry, then show the actual resulting account state.
- Rehearse the sample journeys below. October 10–12, 2026 were the verified hotel dates, and October 10, 2026 was the verified flight date. If those dates are no longer in the future when recording, select valid future dates and recheck the resulting totals before narrating them.
- Sample verified hotel: **Dbrooks**, record 42, ₹1,300 per night; two nights plus taxes totaled **₹3,068**. Sample verified flight: **IndiGo, Delhi → Mumbai**, ₹5,999 per traveler; two travelers totaled **₹11,998**.
- The activities page was verified with 54 records; selecting Delhi and searching for Lotus returned one result. This is a short optional interaction in the catalog segment.
- Reuse only intended demonstration data. For an admin create/edit example, use a clearly labeled disposable flight. The original verification added QA Demo Air at ₹4,500 and changed it to ₹4,200; the clean seed does not contain that local addition.
- Have the report and actual final validation results ready. The local suite passed **61 tests in 14 suites** and the final CI-mode production build passed with no application warnings. The nonfatal Browserslist-data notice is not an application failure.
- Test a short recording for readable text, clear audio if used, and appropriate framing. Keep the display at a readable zoom and close notifications.

## Timed script

| Time | On-screen actions and evidence | Suggested narration or captions |
| --- | --- | --- |
| **0:00–0:35** — Introduction | Show the home page, then briefly show the report's attribution. | “This is Chalo Ghume, an educational travel-booking application inspired by Expedia. This revision builds on work credited to Kumkum, Ashish, Amit, Sagar Balsaraf, and Sarim. The SE3290 changes repair the application workflows, add demonstration bookings and Trips, and improve setup and validation. These are sample reservations, not real travel purchases.” |
| **0:35–1:15** — Architecture | Show the report's diagram and the two running terminals, then return to the application. | “React and React Router provide the interface. Redux and Thunk manage shared state, and Axios accesses the local JSON API. React runs on port 3000 and JSON Server on 8080. Firebase handles phone authentication. The clean seed is shareable, while local accounts and bookings stay in the ignored database.” |
| **1:15–2:05** — Hotel search | Search Bangalore using the rehearsed dates. Show that the dates remain in the query. Select ascending price and minimum rating 4; point to the four results and Dbrooks. | “The hotel search carries its destination and dates into the results. I will sort by increasing price and apply a minimum rating of four. The verified sample query returns four hotels. Dbrooks is ₹1,300 per night. City information was added only where supported; unmapped properties were not assigned guessed locations.” |
| **2:05–3:10** — Sign-in and session | Show the login screen; keep private phone/code entry out of frame. Complete the real configured Firebase flow. Show Account, Admin, and Trips navigation, then reload. | “This account uses the normal Firebase phone-verification flow with a privately configured fictional number. There is no development login bypass. After verification, the account navigation appears. Reloading retains the session in this browser tab. Administrator navigation is available because this account was explicitly assigned the local admin role.” |
| **3:10–4:00** — Flight search | Open flight search for Delhi → Mumbai, the rehearsed date, and two travelers. Apply the ₹5,000–₹6,000 filter and show the ₹5,999 IndiGo result. Briefly show the activity view if time permits. | “Flight search uses the selected route and supported filters. This price range returns the ₹5,999 IndiGo option for the verified sample route. Two travelers will total ₹11,998. The activity section provides a separate destination and text search. All of this inventory is sample catalog data rather than a live supplier quote.” |
| **4:00–5:00** — Saved bookings and Trips | Select the rehearsed hotel. Show two nights, ₹2,600 subtotal, ₹468 taxes, and ₹3,068 total. Enter synthetic traveler details and confirm. Show its UUID confirmation in Trips and reload. Show the previously rehearsed flight booking alongside it, or create it during rehearsal before this segment. | “Checkout loads the selected record and calculates the price from the booking details. This hotel costs ₹3,068 for two nights including taxes. Confirmation appears only after the API saves the UUID booking. Trips shows the saved hotel and flight reservations, and the records remain after reload. No payment or provider reservation is made.” |
| **5:00–6:00** — Admin create and edit | Open `/admin`, show catalog counts, and add the disposable flight at ₹4,500. Find it through admin search, edit it to ₹4,200, then show the updated result in public flight search. | “The admin dashboard reads catalog counts from the same API. I will add a temporary flight, find it through search, and edit its price. The update is saved to the existing record and appears in customer search. Create and edit were verified in the browser. Deletion has automated coverage, but its live UI mutation was not verified in this run.” |
| **6:00–6:40** — Validation and limits | Show the deliverables table and actual test/build output. Point to cancellation and live deletion as pending checks. | “The final local run passed 61 tests across 14 suites, and the CI-mode production build passed without application warnings. Tests cover accounts, route guards, catalogs, booking rules, and administration. Cancellation is implemented, but its live check was blocked pending user approval. The JSON service remains local and does not enforce server-side authentication.” |
| **6:40–7:00** — Delivery and next steps | Show the report links and local runtime address. End on the home page. | “This revision has been verified locally and has not been publicly deployed. The deliverables record identifies the final source publication and viewing links. Future work includes a secure persistent backend, real inventory integrations, broader end-to-end checks, and accessibility improvements. The report preserves attribution and lists the evidence and remaining items.” |

These nine intervals are contiguous and total **420 seconds**. Rehearse once with a timer. Leave time for visible interactions rather than reading continuously over fast page changes.

## Keep the recording consistent with the evidence

- Demonstrate real application results. Do not stage a success screen, bypass sign-in, or describe a local booking as a supplier confirmation.
- Keep fixed phone-verification credentials private while showing the actual sign-in outcome. Do not use a real phone number merely to recover from a recording problem.
- The script does not require a live cancellation or deletion. Cancellation verification is pending user approval; both live outcomes remain unclaimed. Any later authorized test should be recorded in the deliverables before narrating it as verified.
- If the temporary flight remains after recording, keep it only as intentional local demo data or remove it through an explicitly authorized cleanup. It is absent from the clean seed.
- If the API or Firebase fails during a take, show the limitation or resolve it and re-record. Do not narrate the prior successful verification as though it happened in the failed take.
- Do not substitute the original project's historical deployment or repository for publication of this revised code.

## Recording and submission checklist

- [ ] Student metadata completed in the report.
- [ ] Recording format chosen: personal narration or captions.
- [ ] Actual video recorded and saved.
- [ ] Entire video reviewed; duration is between 5 and 10 minutes.
- [ ] Text, actions, and audio/captions are clear.
- [ ] Private test credentials and unrelated personal data are absent.
- [ ] Original contributors and the current revision's contribution are described accurately.
- [ ] Confirmation totals and completed actions match the actual take.
- [ ] Final filename, measured duration, and viewing link entered in `DELIVERABLES.md`.
- [ ] Viewing access checked for the intended reviewer.
- [ ] Repository/report/video submission completed in the course's required channel.
