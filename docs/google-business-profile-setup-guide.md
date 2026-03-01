# Google Business Profile — Full Setup Guide

This guide walks through **what to set up and how** in Google Cloud and Google Business Profile so that **dariuspizza.fr** can sync opening hours and closings to the business’s Google listing.

**Your site URLs:**

| Purpose                     | URL                                                 |
| --------------------------- | --------------------------------------------------- |
| Public site                 | https://www.dariuspizza.fr                          |
| Dashboard (FR)              | https://www.dariuspizza.fr/fr/dashboard             |
| Dashboard (EN)              | https://www.dariuspizza.fr/en/dashboard             |
| OAuth callback (production) | https://www.dariuspizza.fr/api/auth/google/callback |

**Time required:** ~30–60 minutes (plus waiting for API access approval, which can take days).

---

## Prerequisites

Before starting:

- [ ] You have a **Google Account** that is **owner or manager** of the Darius Pizza Google Business Profile (GBP).
- [ ] The **business listing is verified** and has been **active for at least 60 days** (Google’s requirement for API access).
- [ ] The business website **https://www.dariuspizza.fr** is live and represents the business (required for API access approval).
- [ ] You are familiar with [Google Business Profile](https://business.google.com/) (you’ve used the web interface at least once).

If any of the above is missing, complete it first. Without verified ownership and 60+ days active, API access may be denied.

---

## Step 1 — Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with the **same Google Account** that owns or manages the Darius Pizza GBP.
3. Open the **project** dropdown at the top (next to “Google Cloud”).
4. Click **“New Project”**.
5. **Project name:** e.g. `Darius Pizza` or `dariuspizza.fr`.
6. **Organization:** Leave default unless you use an organization.
7. Click **“Create”**.
8. Wait for the project to be created, then **select it** from the project dropdown.

- [ ] Project created and selected.

**Note:** On the project **Dashboard**, note the **Project number** (numeric). You will need it when requesting API access.

---

## Step 2 — Request access to the Business Profile APIs

Google restricts access to Business Profile APIs. You must request approval **before** the APIs will work (otherwise you may get 403 or **quota 0**).

### If your quota is 0 (My Business Account Management / Business Information)

**Quota 0 means your project is not approved yet.** You cannot “increase” it in the Cloud Console — Google sets quota to **300 QPM** only after they approve your **Basic API Access** request. Do the following:

**Important — use the right form:**  
If you see a message like _“I understand that I can only submit this request if my API access has already been approved. I have verified that my quota is not currently set to zero”_ (or in French: _“Je comprends que je ne peux envoyer cette demande que si mon accès à l’API a déjà été approuvé. J’ai vérifié que mon quota n’est pas actuellement défini sur zéro”_), you are on the **Quota Increase** form. That form is only for people who already have 300 QPM. **Do not use it.** Go back and choose the option for **first-time / basic API access** (e.g. **“Application for Basic API Access”**). In a French dropdown it may be named like _“Candidature pour l’accès de base à l’API”_ or _“Demande d’accès de base”_. The basic-access form does **not** ask you to confirm that your quota is not zero.

1. Go to the [GBP API contact form](https://support.google.com/business/contact/api_default). Alternatively, Google sometimes provides a direct form for basic access: [Application form for Basic API Access](https://docs.google.com/forms/d/e/1FAIpQLSfC_FKSWzbSae_5rOpgwFeIUzXUF1JCQnlsZM_gC1I2UHjA3w/viewform) (if that link works for your region).
2. In the **drop-down**, select **“Application for Basic API Access”** (or the French equivalent for _first-time_ access). Do **not** choose “Quota Increase Request” / _“Demande d’augmentation de quota”_.
3. Fill in all requested information:
   - Use an **email that is listed as owner/manager** on the Darius Pizza GBP.
   - **Project number:** the numeric Project number from your Google Cloud project (Dashboard → Project info card).
   - Mention that you are the **business owner** of **Darius Pizza (Cavalaire-sur-Mer)** and want to **sync opening hours and special hours** from **https://www.dariuspizza.fr** to your single GBP listing.
4. Submit the form.
5. Wait for the follow-up email. Approval can take **several days** (often up to 14 days). After approval, your quota will change from **0** to **300** QPM — no separate “quota increase” step needed.

**Checking approval:** In Cloud Console → APIs & Services → **Quotas**, find “My Business Account Management API” or “My Business Business Information API”. If “Queries per minute” shows **300**, you are approved; if **0**, you are still waiting.

- [ ] Request submitted (Application for Basic API Access).
- [ ] Approval received (quotas show 300 QPM).

---

## Step 3 — Enable the required APIs

1. In [Google Cloud Console](https://console.cloud.google.com/), ensure your project is selected.
2. Open **“APIs & Services”** → **“Library”** (or go to [API Library](https://console.cloud.google.com/apis/library)).
3. Enable these APIs (search by name, then click **“Enable”**):

   | API name                                 | Purpose                                                                                |
   | ---------------------------------------- | -------------------------------------------------------------------------------------- |
   | **My Business Account Management API**   | List accounts and manage which account owns the location.                              |
   | **My Business Business Information API** | List locations, get/patch location data (including `regularHours` and `specialHours`). |

   Optional (only if you use other GBP features later):
   - My Business Business Information API (already above)
   - Others from the [Basic setup list](https://developers.google.com/my-business/content/basic-setup) if needed.

4. If prompted, accept Terms of Service or enable billing. **Billing** may be required to enable APIs; you can set up a free-tier account; the Business Profile APIs themselves do not charge per request.

- [ ] My Business Account Management API — Enabled.
- [ ] My Business Business Information API — Enabled.

---

## Step 4 — Configure the OAuth consent screen

OAuth allows your app to act on behalf of the business owner (you) to update the GBP listing.

1. Go to **“APIs & Services”** → **“OAuth consent screen”** ([direct link](https://console.cloud.google.com/apis/credentials/consent)).
2. Choose **“External”** (unless you use Google Workspace and want “Internal” only). Click **“Create”**.
3. **App information**
   - App name: `Darius Pizza` or `dariuspizza.fr Dashboard`.
   - User support email: your email (e.g. contact@dariuspizza.com).
   - Developer contact: your email.
4. Click **“Save and Continue”**.
5. **Scopes**
   - Click **“Add or Remove Scopes”**.
   - In “Filter”, search for `business.manage` or paste: `https://www.googleapis.com/auth/business.manage`.
   - Check the scope **“.../auth/business.manage”** (Manage your Business Profile).
   - Click **“Update”**, then **“Save and Continue”**.
6. **Test users** (if app is in “Testing”)
   - Add the Google account email that owns the GBP as a **Test user** so you can sign in during development.
   - Click **“Save and Continue”**.
7. **Summary** — Review and click **“Back to Dashboard”**.

- [ ] OAuth consent screen configured.
- [ ] Scope `https://www.googleapis.com/auth/business.manage` added.
- [ ] Test user added (if in Testing mode).

---

## Step 5 — Create OAuth 2.0 credentials (Web application)

1. Go to **“APIs & Services”** → **“Credentials”** ([direct link](https://console.cloud.google.com/apis/credentials)).
2. Click **“Create Credentials”** → **“OAuth client ID”**.
3. **Application type:** **“Web application”**.
4. **Name:** `Darius Pizza GBP Sync` or `dariuspizza.fr — Google sync`.
5. **Authorized redirect URIs:** Add the URL where you will complete the OAuth flow to get the refresh token. Options:
   - **Local dev:** `http://localhost:3000/api/auth/google/callback` (or the callback route you implement).
   - **OAuth Playground (for getting refresh token manually):** `https://developers.google.com/oauthplayground`
   - **Production (if you add a “Link Google Business” page in the dashboard):** `https://www.dariuspizza.fr/api/auth/google/callback` (one callback URL without locale is enough; your app can redirect to e.g. `/fr/dashboard` after).
6. **Authorized JavaScript origins** (if required): `http://localhost:3000` and `https://www.dariuspizza.fr`.
7. Click **“Create”**.
8. In the popup, copy the **Client ID** and **Client secret**. Store them securely and **do not paste the real values into this document or commit them to git**.
   - **GOOGLE_CLIENT_ID** = your Client ID (format similar to `xxxxx.apps.googleusercontent.com`).
   - **GOOGLE_CLIENT_SECRET** = your Client secret (keep secret; server-only, stored only in env or a password manager).

- [ ] OAuth client created (Web application).
- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET saved in a secure place (e.g. password manager or env template).

---

## Step 6 — Obtain refresh token

You need a **refresh token** so the server can get new access tokens without the user being present (offline access).

### Option A — Using OAuth 2.0 Playground (quickest for first time)

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Click the **gear icon** (top right) and check **“Use your own OAuth credentials”**. Enter your **Client ID** and **Client secret**.
3. In **Step 1 — Select & authorize APIs**, in “Input your own scopes” paste:
   ```text
   https://www.googleapis.com/auth/business.manage
   ```
   Click **“Authorize APIs”**. Sign in with the **Google account that owns the Darius Pizza GBP** and grant access.
4. In **Step 2 — Exchange authorization code for tokens**, click **“Exchange authorization code for tokens”**.
5. In the response, copy the **refresh_token** (long string). Store it as **GOOGLE_REFRESH_TOKEN** (server-only; never expose to client or commit to git).

**Important:** If you do not see a `refresh_token` in the response, you may need to add `access_type=offline` and `prompt=consent` to the authorization URL. In Playground, try revoking access at [myaccount.google.com/permissions](https://myaccount.google.com/permissions) and re-authorizing, or use Option B.

### Option B — Using a small local script or dashboard page

Implement a one-time OAuth flow in your app:

1. Redirect the user to Google’s authorization URL with:
   - `client_id`, `redirect_uri` (e.g. `https://www.dariuspizza.fr/api/auth/google/callback` for production or `http://localhost:3000/api/auth/google/callback` for local), `response_type=code`, `scope=https://www.googleapis.com/auth/business.manage`, `access_type=offline`, `prompt=consent`.
2. On the callback, exchange the `code` for tokens (POST to `https://oauth2.googleapis.com/token` with `grant_type=authorization_code`, `code`, `client_id`, `client_secret`, `redirect_uri`).
3. From the response, store the **refresh_token** securely (e.g. show it once for the operator to copy into env, or save to server-side config if you have a secure way to do that).

- [ ] Refresh token obtained and stored as **GOOGLE_REFRESH_TOKEN** (server-only).

---

## Step 7 — Get location name (GOOGLE_LOCATION_NAME)

The API uses a **location resource name** in the form `locations/{locationId}`. You get it by listing locations for the authenticated account.

### Using OAuth Playground (after you have a refresh token or access token)

1. In [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/), use the same scope and credentials.
2. After **Step 2 — Exchange authorization code for tokens**, copy the **access_token**.
3. **List accounts:**
   - Request URI: `GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts`
   - Click **“Send the request”**. In the response, note the **name** of the account (e.g. `accounts/1234567890123456789`). Use the first account if you have only one.
     accounts/117189554499707928719
4. **List locations:**
   - Request URI: `GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations`  
     Replace `{accountId}` with the numeric part of the account name (e.g. `1234567890123456789`).  
     Or use `accounts/-/locations` to include group-managed locations.
   - Add header: `Authorization: Bearer YOUR_ACCESS_TOKEN` (use the token from Step 2).
   - Click **“Send the request”**.
5. In the response, find the location for **Darius Pizza** in Cavalaire-sur-Mer (match by `title` or address). Copy the **name** field (e.g. `locations/9876543210987654321`). This is **GOOGLE_LOCATION_NAME**.

### Using your app (once sync module exists)

If you implement a “Link Google Business” or “Fetch location” page under **https://www.dariuspizza.fr/fr/dashboard** (or `/en/dashboard`) that uses `refreshAccessToken()` and then calls the List locations API, you can display the list in the dashboard and let the operator select the location; then store the chosen `name` as **GOOGLE_LOCATION_NAME** in env or in a config store.

- [ ] **GOOGLE_LOCATION_NAME** obtained (e.g. `locations/9876543210987654321`) and stored in server env.

---

## Step 8 — Add variables to your app

Add these to your server-side environment (e.g. `.env.local` for local dev; deployment secrets for production):

```env
# Google Business Profile sync (all server-only)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REFRESH_TOKEN=1//xxxxx
GOOGLE_LOCATION_NAME=locations/9876543210987654321
```

Optional:

```env
# Set to "true" to enable sync; omit or "false" to disable (e.g. before credentials are ready)
GOOGLE_SYNC_ENABLED=true
```

- [ ] All four required variables set in `.env.local` (or equivalent).
- [ ] Variables added to production/staging secrets.
- [ ] Confirmed **GOOGLE_CLIENT_SECRET** and **GOOGLE_REFRESH_TOKEN** are never exposed to the client or committed to version control.

---

## Summary checklist

| Step          | Task                                                                             | Done |
| ------------- | -------------------------------------------------------------------------------- | ---- |
| Prerequisites | GBP verified, 60+ days active, owner/manager account                             | [ ]  |
| 1             | Create Google Cloud project                                                      | [ ]  |
| 2             | Request API access (contact form); wait for approval                             | [ ]  |
| 3             | Enable My Business Account Management API & My Business Business Information API | [ ]  |
| 4             | Configure OAuth consent screen (External, scope business.manage)                 | [ ]  |
| 5             | Create OAuth Web application credentials; save Client ID & Secret                | [ ]  |
| 6             | Obtain refresh token (Playground or app flow); save as GOOGLE_REFRESH_TOKEN      | [ ]  |
| 7             | List accounts & locations; copy location name → GOOGLE_LOCATION_NAME             | [ ]  |
| 8             | Add all four env vars to app (server-only) and deployment                        | [ ]  |

---

## References

- [Business Profile APIs — Basic setup](https://developers.google.com/my-business/content/basic-setup)
- [Business Profile APIs — Prerequisites](https://developers.google.com/my-business/content/prereqs)
- [Business Profile APIs — Implement OAuth](https://developers.google.com/my-business/content/implement-oauth)
- [Work with location data](https://developers.google.com/my-business/content/location-data)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [GBP API contact form (request access)](https://support.google.com/business/contact/api_default)
