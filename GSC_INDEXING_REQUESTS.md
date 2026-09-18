# Google Search Console Indexing Request Playbook & URL Prioritization Matrix
**Project:** Jaktra (`https://jaktra.site`)  
**Audit & Execution Date:** September 12, 2026  
**Auditor:** Senior SEO Engineer  
**Status:** All 38 Public Canonical Pages Prerendered, Validated, and Submission-Ready

---

## 1. Executive Summary & Google Indexing Realities

Before submitting URLs via Google Search Console (GSC), we must adhere to Google's real-world indexing mechanics:

1. **Crawlability $\neq$ Indexing:** Technical crawlability (HTTP 200, valid HTML, valid JSON-LD) is merely a prerequisite. Google's algorithmic systems (Helpful Content System, Quality Rater guidelines, Deduplication, and Doorway policies) assess whether a page provides substantial independent value before committing it to the index.
2. **"Discovered – currently not indexed":** Google found the URL (via sitemap or internal link) but postponed crawling it because domain quality or crawl budget priority did not justify scheduling the crawler.
3. **"Crawled – currently not indexed":** Google crawled the raw rendered DOM, but chose not to index it because the content was judged thin, duplicate, or lacking sufficient value compared to existing web corpus pages.
4. **Daily GSC Request Limits:** Google enforces a hard manual quota of **10–12 manual URL inspection requests per day per property**. Submitting in bulk triggers rate limits. Therefore, URLs must be queued into strict daily batches prioritized by business intent.
5. **Canonical Uniformity:** Exactly **38 public URLs** are canonicalized, self-referencing, and included in `sitemap.xml`. Legacy alias `/compare/highradius-alternative` has been permanently consolidated via HTTP 301 into `/compare/highradius-vs-jaktra` and removed from the sitemap.

---

## 2. Complete Inventory of 38 Public Canonical URLs

| # | Canonical URL | Primary Search Intent | HTML Words | Tier | Indexing Verdict |
|---|---|---|---|---|---|
| 1 | `https://jaktra.site` | Brand / Commercial Homepage | ~1,650 | Tier 1 | Ready |
| 2 | `https://jaktra.site/pricing` | High Commercial Intent | ~1,120 | Tier 1 | Ready |
| 3 | `https://jaktra.site/features` | Product Architecture Hub | ~1,240 | Tier 1 | Ready |
| 4 | `https://jaktra.site/features/5-stage-escalation` | Core Feature Deep Dive | ~2,100 | Tier 1 | Ready |
| 5 | `https://jaktra.site/features/dispute-triage` | Core Feature Deep Dive | ~1,250 | Tier 1 | Ready |
| 6 | `https://jaktra.site/features/zero-login-portal` | Core Feature Deep Dive | ~1,200 | Tier 1 | Ready |
| 7 | `https://jaktra.site/features/installment-plans` | Feature Deep Dive | ~1,380 | Tier 1 | Ready |
| 8 | `https://jaktra.site/features/email-deliverability` | Feature / Technical Trust | ~1,560 | Tier 1 | Ready |
| 9 | `https://jaktra.site/features/risk-scoring` | Feature Deep Dive | ~1,190 | Tier 1 | Ready |
| 10 | `https://jaktra.site/compare` | Comparison Cluster Hub | ~2,480 | Tier 1 | Ready |
| 11 | `https://jaktra.site/use-cases` | Industry Solutions Hub | ~2,650 | Tier 1 | Ready |
| 12 | `https://jaktra.site/resources` | Knowledge Base Hub | ~1,820 | Tier 1 | Ready |
| 13 | `https://jaktra.site/resources/how-to-reduce-dso` | High-Volume Informational Guide | ~2,050 | Tier 1 | Ready |
| 14 | `https://jaktra.site/resources/ar-automation-roi-calculator` | Interactive Utility Tool | ~2,020 | Tier 1 | Ready |
| 15 | `https://jaktra.site/resources/5-stage-ar-tone-escalation` | Tactical Strategy Guide | ~2,240 | Tier 1 | Ready |
| 16 | `https://jaktra.site/resources/b2b-dunning-email-templates` | Template Library | ~1,570 | Tier 1 | Ready |
| 17 | `https://jaktra.site/resources/best-b2b-finance-automation-tools` | Category Authority Roundup | ~3,180 | Tier 1 | Ready |
| 18 | `https://jaktra.site/compare/upflow-alternative` | High Commercial Comparison | ~1,410 | Tier 1 | Ready |
| 19 | `https://jaktra.site/compare/paidnice-alternative` | High Commercial Comparison | ~1,630 | Tier 1 | Ready |
| 20 | `https://jaktra.site/compare/kolleno-alternative` | High Commercial Comparison | ~1,710 | Tier 1 | Ready |
| 21 | `https://jaktra.site/use-cases/saas` | Vertical Industry Guide | ~1,680 | Tier 1 | Ready |
| 22 | `https://jaktra.site/use-cases/manufacturing` | Vertical Industry Guide | ~1,980 | Tier 1 | Ready |
| 23 | `https://jaktra.site/use-cases/construction` | Vertical Industry Guide | ~1,910 | Tier 1 | Ready |
| 24 | `https://jaktra.site/use-cases/logistics-freight` | Vertical Industry Guide | ~1,890 | Tier 1 | Ready |
| 25 | `https://jaktra.site/use-cases/agencies` | Vertical Industry Guide | ~2,140 | Tier 1 | Ready |
| 26 | `https://jaktra.site/use-cases/staffing-recruiting` | Vertical Industry Guide | ~1,890 | Tier 1 | Ready |
| 27 | `https://jaktra.site/use-cases/wholesale-distribution` | Vertical Industry Guide | ~2,160 | Tier 1 | Ready |
| 28 | `https://jaktra.site/use-cases/professional-services` | Vertical Industry Guide | ~1,940 | Tier 1 | Ready |
| 29 | `https://jaktra.site/resources/invoice-dispute-response-templates` | Tactical Problem Guide | ~1,620 | Tier 1 | Ready |
| 30 | `https://jaktra.site/resources/accounts-receivable-query-management` | Process Framework Guide | ~1,510 | Tier 1 | Ready |
| 31 | `https://jaktra.site/resources/client-questioning-billable-hours` | Long-Tail Problem Guide | ~1,300 | Tier 1 | Ready |
| 32 | `https://jaktra.site/resources/client-disputed-invoice-what-to-do` | Long-Tail Problem Guide | ~1,210 | Tier 1 | Ready |
| 33 | `https://jaktra.site/privacy` | Legal / Trust Compliance | ~730 | Tier 1 | Ready |
| 34 | `https://jaktra.site/terms` | Legal / Trust Compliance | ~780 | Tier 1 | Ready |
| 35 | `https://jaktra.site/docs` | Developer / Technical Docs Hub | **1,877** | **Tier 2** | **Fixed & Ready** |
| 36 | `https://jaktra.site/compare/highradius-vs-jaktra` | Consolidated Comparison Page | **1,815** | **Tier 2** | **Fixed & Ready** |
| 37 | `https://jaktra.site/compare/chaser-alternative` | Differentiated Comparison Page | **1,970** | **Tier 2** | **Fixed & Ready** |
| 38 | `https://jaktra.site/resources/how-to-manage-accounts-receivable-emails` | Differentiated Shared Inbox Guide | **2,211** | **Tier 2** | **Fixed & Ready** |

---

## 3. Tier Classification

### Tier 1 — Submit Immediately (Core Architecture & High Commercial Value)
These 34 URLs have passed all technical, content density, and entity differentiation audits without modification. They represent Jaktra's primary commercial conversion funnel, hub architecture, and industry solutions.

### Tier 2 — Fixed & Ready (Remediated Pages)
These 4 URLs were previously at risk of "Crawled – currently not indexed" or duplicate cannibalization, but have been thoroughly remediated:
1. **`https://jaktra.site/docs`**: Expanded from a 32-word construction notice into a 1,877-word comprehensive Technical Documentation Hub with quickstart architecture, DNS deliverability records (SPF/DKIM/DMARC), HMAC-SHA256 signature verification code (Node.js & Python), CSV schema tables, and circuit breaker retry equations ($T = 2^n \times 60\text{s}$).
2. **`https://jaktra.site/compare/highradius-vs-jaktra`**: Fully consolidated as the single canonical URL for HighRadius comparisons.
3. **`https://jaktra.site/compare/chaser-alternative`**: FAQs #3 and #4 rewritten to focus specifically on Chaser's "Chase Feed" activity log and Stripe redirect limitations, eliminating identical entity-swapping boilerplate with Upflow.
4. **`https://jaktra.site/resources/how-to-manage-accounts-receivable-emails`**: Repositioned as an operational IT & finance Shared Mailbox setup guide (Gmail Collaborative Inbox vs. Microsoft 365 Shared Mailbox, 4-tier label taxonomy, and 4-hour SLA response matrix), eliminating template overlap with `accounts-receivable-query-management`.

### Tier 3 — Hold / Do Not Submit
- **`https://jaktra.site/compare/highradius-alternative`**: **DO NOT SUBMIT**. This URL now serves a permanent 301 redirect to `/compare/highradius-vs-jaktra`. Requesting indexing for a redirected URL wastes crawl quota and generates "Page with redirect" warnings in GSC.
- **Internal Application Routes** (`/login`, `/register`, `/forgot-password`, `/dashboard`, `/invoices/*`): Excluded from sitemap and tagged `noindex` by design.

---

## 4. Daily GSC Submission Schedule (10 URLs / Day)

To stay strictly within Google's daily URL inspection quota and maximize initial indexing velocity, execute submissions according to the following 4-day calendar:

```
                      GSC SUBMISSION TIMELINE
========================================================================
 DAY 1: Brand & Core Conversion Architecture (10 URLs)
 ├── https://jaktra.site
 ├── https://jaktra.site/pricing
 ├── https://jaktra.site/features
 ├── https://jaktra.site/features/zero-login-portal
 ├── https://jaktra.site/features/5-stage-escalation
 ├── https://jaktra.site/compare
 ├── https://jaktra.site/use-cases
 ├── https://jaktra.site/resources
 ├── https://jaktra.site/docs (Fixed Tier 2)
 └── https://jaktra.site/resources/how-to-reduce-dso

 DAY 2: High-Intent Competitor Comparisons & Flagship Tools (10 URLs)
 ├── https://jaktra.site/compare/highradius-vs-jaktra (Fixed Tier 2)
 ├── https://jaktra.site/compare/chaser-alternative (Fixed Tier 2)
 ├── https://jaktra.site/compare/upflow-alternative
 ├── https://jaktra.site/compare/paidnice-alternative
 ├── https://jaktra.site/compare/kolleno-alternative
 ├── https://jaktra.site/resources/ar-automation-roi-calculator
 ├── https://jaktra.site/resources/best-b2b-finance-automation-tools
 ├── https://jaktra.site/resources/5-stage-ar-tone-escalation
 ├── https://jaktra.site/resources/how-to-manage-accounts-receivable-emails (Fixed Tier 2)
 └── https://jaktra.site/features/dispute-triage

 DAY 3: Industry Solutions Cluster (10 URLs)
 ├── https://jaktra.site/use-cases/saas
 ├── https://jaktra.site/use-cases/manufacturing
 ├── https://jaktra.site/use-cases/construction
 ├── https://jaktra.site/use-cases/logistics-freight
 ├── https://jaktra.site/use-cases/agencies
 ├── https://jaktra.site/use-cases/staffing-recruiting
 ├── https://jaktra.site/use-cases/wholesale-distribution
 ├── https://jaktra.site/use-cases/professional-services
 ├── https://jaktra.site/features/installment-plans
 └── https://jaktra.site/features/email-deliverability

 DAY 4: Tactical Problem Guides & Legal Foundation (8 URLs)
 ├── https://jaktra.site/resources/b2b-dunning-email-templates
 ├── https://jaktra.site/resources/invoice-dispute-response-templates
 ├── https://jaktra.site/resources/accounts-receivable-query-management
 ├── https://jaktra.site/resources/client-questioning-billable-hours
 ├── https://jaktra.site/resources/client-disputed-invoice-what-to-do
 ├── https://jaktra.site/features/risk-scoring
 ├── https://jaktra.site/privacy
 └── https://jaktra.site/terms
========================================================================
```

---

## 5. Step-by-Step Operator Protocol in Google Search Console

When executing each daily batch in the [Google Search Console Dashboard](https://search.google.com/search-console):

### Step A: Verify Sitemap Submission
1. In the left navigation, click **Indexing** &gt; **Sitemaps**.
2. Confirm that `https://jaktra.site/sitemap.xml` is submitted and shows status **Success** with **38 discovered pages**.
3. If not yet submitted, enter `sitemap.xml` into "Add a new sitemap" and click **Submit**.

### Step B: Manual URL Inspection & Request Indexing
For each URL in the daily batch:
1. Paste the exact URL into the top search bar (**"Inspect any URL in 'jaktra.site'"**).
2. Wait for GSC to retrieve data from Google Index.
3. Click the **TEST LIVE URL** button in the top right.
   - *Verification:* Ensure Google returns **"URL is available to Google"** with a green checkmark.
   - *Render Check:* Click **View Tested Page** &gt; **Screenshot** to ensure the hero section, navigation, and text are completely rendered (no scramble or blank screen).
4. Click **REQUEST INDEXING**.
5. Wait for the popup confirming: *"Indexing requested — URL was added to a priority crawl queue."*
6. If GSC displays a **"Quota exceeded"** warning, stop immediately and resume 24 hours later.

### Step C: Post-Submission Monitoring (Days 7–14)
1. Navigate to **Indexing** &gt; **Pages**.
2. Monitor the ratio of **Indexed** vs. **Not Indexed**.
3. Check the **Why pages aren’t indexed** breakdown:
   - **Crawled – currently not indexed:** Should approach zero. If any URL lands here, review its internal link count from high-authority hubs (`/features`, `/compare`, `/resources`).
   - **Discovered – currently not indexed:** Usually transient during new site evaluation. Allow Google's queue up to 10 days to transition these to Crawled.
   - **Page with redirect:** Verify that only `/compare/highradius-alternative` (and any trailing-slash variations) appear here.
