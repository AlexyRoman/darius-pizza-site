# Google Business Profile API — Hours & Closings Integration (v1 Implementation Plan)

## Project

**Darius Pizza** — Single Location (Cavalaire-sur-Mer, France)  
**Stack:** Next.js 15 (App Router), Server Routes, Redis/File storage  
**Source of truth:** Website mini-CMS (dashboard)

**See also:**

- **[Full implementation plan](./google-business-profile-implementation-plan.md)** — Tickboxes, checks, unit/e2e test plan, coverage, env vars, Sonner toasts, AlertDialog contexts.
- **[Google Business Profile setup guide](./google-business-profile-setup-guide.md)** — Step-by-step: Google Cloud project, API access request, OAuth consent, credentials, refresh token, location name.

---

# 1. Executive Summary

## Goal

Make the **website the single source of truth** for:

- Regular opening hours
- Exceptional closures (special hours)

Any edit in the dashboard should automatically synchronize the Google Business Profile (GBP) listing.

---

## Key Answers

| Question                            | Answer                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Can we update Google from our site? | Yes, using Google Business Profile APIs                                                                   |
| What can be updated?                | regularHours and specialHours                                                                             |
| Cost?                               | No per-request fee, but quotas apply                                                                      |
| OAuth required?                     | Yes (scope: business.manage)                                                                              |
| Temporarily closed banner?          | NOT supported via API                                                                                     |
| Long closures (>5 days)?            | Must be set manually in GBP (annual closure). When user saves a closing >5 days, show confirmation popup. |

---

# 2. Critical Prerequisite: API Access Approval

Google Business Profile APIs require:

- Google Cloud project
- OAuth consent screen
- OAuth credentials
- **API access approval (mandatory for many projects)**

Without approval, API calls may return 403 errors.

This step must be completed BEFORE implementation.

---

# 3. Architecture Overview

## Source of Truth

```
Website Dashboard
       ↓
Redis / data/opening-hours.json
Redis / data/closings.json
       ↓
Google Business Profile API (PATCH)
```

**One-way sync model:**

- CMS overwrites Google on save
- Google is not considered authoritative

**Optional future enhancement:**

- "Pull from Google" audit tool

---

# 4. Data Model Mapping

## 4.1 Regular Hours Mapping

**Our Model:**

- monday → sunday
- isOpen
- periods[] with open/close ("HH:mm")

**GBP Model:**

- regularHours.periods[]
- openDay / closeDay (MONDAY → SUNDAY)
- openTime / closeTime

**Transformation Rules:**

- Map lowercase day to enum
- Convert "HH:mm" to TimeOfDay
- Multiple intervals → multiple TimePeriod entries
- Closed days → omit period

---

## 4.2 Special Hours Mapping

**Our Model:**

- startDate (ISO)
- endDate (ISO)
- isActive

**GBP Model:**

- specialHours.specialHourPeriods[]
- startDate
- endDate
- closed: true

**Important Rule:**

- Maximum **5 consecutive closed days** allowed via specialHours for a single period.
- If closure **>5 days**:
  - Only generate first 5 days in specialHours (or split as per API limits).
  - **Trigger a context popup (confirmation dialog)** before or after save: inform the user that they will have to set **annual closure** (or “Temporarily closed”) on Google Business manually for the full period.
  - Operator must set annual closure / “Temporarily closed” manually in GBP and revert it when reopening.

---

# 5. Closure >5 Days: Confirmation Popup (UX)

When the user creates or edits a **scheduled closing** whose duration is **more than 5 days** (i.e. `endDate − startDate > 5 days`):

1. **Trigger the existing confirmation pattern** used elsewhere in the dashboard (the same **AlertDialog** component used in `ClosingsEditor` and `OpeningHoursEditor` — see `src/components/ui/alert-dialog.tsx`).
2. **Display a dedicated message** in that dialog, for example:
   - **Title:** e.g. “Google Business Profile – manual step required”
   - **Description:** “This closure is longer than 5 days. Google only allows up to 5 consecutive days via our sync. You will need to set **annual closure** (or ‘Temporarily closed’) on your Google Business Profile manually for this period, and remove it when you reopen.”
3. **Actions:** User acknowledges (e.g. “OK” / “I understand”) and can then proceed with save. Optionally, the normal “Save” confirmation can be combined with this message when the closure is >5 days.

**Implementation note:**

- Reuse the same `AlertDialog` + `AlertDialogTitle` + `AlertDialogDescription` + `AlertDialogFooter` pattern already used in `ClosingsEditor` (e.g. the save confirmation at lines 684–709).
- Add a check when building or saving a closing: if the date range spans **>5 days**, open this context popup (either before submitting save, or as a second step after “Save” is clicked). Do not block saving locally; the popup is informational so the user knows to update GBP manually.

---

# 6. Google Cloud Setup

## Step 1 — Create Project

- Create Google Cloud Project

## Step 2 — Enable APIs

- Business Profile API
- Business Information API
- Account Management API

## Step 3 — OAuth Consent Screen

- External app
- Add scope: `https://www.googleapis.com/auth/business.manage`

## Step 4 — Create OAuth Credentials

- Web Application
- Store: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

## Step 5 — Obtain Refresh Token

- Perform one-time OAuth flow
- Request offline access
- Store: GOOGLE_REFRESH_TOKEN (server-side only)

## Step 6 — Store Location Name

After listing locations, store: **GOOGLE_LOCATION_NAME** = `locations/{locationId}`

---

# 7. Environment Variables

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REFRESH_TOKEN
- GOOGLE_LOCATION_NAME

All must be **server-only**.

---

# 8. Sync Flow

## 8.1 On Saving Regular Hours

`PUT /api/hours` → Save locally → Call `syncRegularHours()` → PATCH location with `updateMask=regularHours`

## 8.2 On Saving Closings

`PUT /api/closings` → Save locally → Call `syncSpecialHours()` → PATCH location with `updateMask=specialHours`

- If any saved closing has duration **>5 days**, show the confirmation popup (see §5) so the user knows to set annual closure on Google Business manually.

---

# 9. API Endpoints Used

- **List accounts:**  
  `GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts`

- **List locations:**  
  `GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations`

- **Patch location (regular hours):**  
  `PATCH https://mybusinessbusinessinformation.googleapis.com/v1/locations/{locationId}?updateMask=regularHours`

- **Patch location (special hours):**  
  `PATCH https://mybusinessbusinessinformation.googleapis.com/v1/locations/{locationId}?updateMask=specialHours`

---

# 10. Implementation Module Structure

**`src/lib/google-business-profile.ts`**

**Exports:**

- `refreshAccessToken()`
- `syncRegularHours(hoursConfig)`
- `syncSpecialHours(closingsConfig)`

**Responsibilities:**

- Refresh access token via refresh_token grant
- Build payloads
- Call PATCH endpoint
- Handle errors safely

---

# 11. Error Handling Strategy

**Rules:**

- Never block local save
- Log API errors
- Store: lastGoogleSyncAt, lastGoogleSyncStatus, lastGoogleSyncError

**Optional:**

- Dashboard badge (Synced / Failed)

**Debug tips:**

- Use `validateOnly=true` for testing
- Use header `X-GOOG-API-FORMAT-VERSION: 2` for rich errors

---

# 12. Quota & Idempotency

**Best practices:**

- Only sync after actual changes
- Use updateMask correctly
- Avoid listing locations on every request
- Store location name once

---

# 13. Operational Policy

**Long closures (>5 days):**

- Operator must manually set **annual closure** / “Temporarily closed” in GBP.
- When user saves a closing >5 days, show the **context popup** (AlertDialog) informing them of this requirement.
- System may push first 5 days as special hours; manual step required for the full period.
- Manual revert in GBP when reopening.

**Drift policy:**

- Website overwrites Google on save.
- Optional future “pull” audit tool.

---

# 14. Final Checklist

- [ ] Create Google Cloud project
- [ ] Enable Business Profile APIs
- [ ] Request API access approval
- [ ] Configure OAuth consent screen
- [ ] Create OAuth credentials
- [ ] Implement OAuth linking flow
- [ ] Store refresh token securely
- [ ] Store location resource name
- [ ] Implement `google-business-profile.ts`
- [ ] Map HoursConfig → regularHours
- [ ] Map ClosingsConfig → specialHours
- [ ] **When closure >5 days: trigger context popup (AlertDialog) telling user to set annual closure on Google Business**
- [ ] Implement error logging
- [ ] Add dashboard sync indicator
- [ ] Document manual temporary-closure / annual-closure process

---

# Conclusion

This architecture provides:

- Single source of truth (website)
- Automatic synchronization to Google
- **Clear user guidance when a closure is >5 days** (confirmation popup → set annual closure on GBP manually)
- Safe error handling
- Minimal quota usage
- Clear operational boundaries

The integration is free in monetary cost but requires OAuth setup, API approval, and correct handling of special-hours constraints (**5 consecutive days** via API; longer closures require manual annual closure / “Temporarily closed” in GBP).
