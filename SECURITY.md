# Security Policy & Architecture

SchemeSetu (স্কিমসেতু / स्कीमसेतु) is built on a **Zero-Knowledge, Client-Side Privacy Architecture** designed specifically for Indian public welfare discovery.

---

## 1. Core Security & Privacy Principles

1. **Zero-Knowledge Processing**: All eligibility evaluation, profile ranking, and document checklist matching execute 100% locally in the citizen's browser using Preact and `@preact/signals`.
2. **No Data Collection**: No Aadhaar numbers, phone numbers, names, or financial documents are ever collected, transmitted, or logged to remote servers.
3. **Data Isolation**: Application state in `localStorage` is scoped exclusively under `schemesetu_*` and strictly validated on load against a hardened schema parser.
4. **User-Controlled Privacy Purge**: Citizens can purge all stored responses, saved bookmarks, and checklist marks at any time via the "Clear My Saved Data" button in the About page.

---

## 2. Threat Vector Mitigations

| Threat Vector | Mitigation Strategy | Implementation |
|---|---|---|
| **Cross-Site Scripting (XSS)** | Dynamic values interpolated into printable documents or DOM elements are strictly escaped. | `escapeHtml` in `src/utils/security.js` converts special characters (`&`, `<`, `>`, `"`, `'`, `/`) to safe HTML entities. |
| **Window Opener Hijacking** | Printable windows opened via `window.open` have `opener` set to `null`. | `printWindow.opener = null` in `src/utils/pdf.js`. |
| **Reverse Tabnabbing** | All outbound links targeting external government portals enforce `rel="noopener noreferrer"`. | `rel="noopener noreferrer"` across `SchemeDetail.jsx`, `Footer.jsx`, `About.jsx`. |
| **Malicious Link Injection** | URLs are validated against permitted protocols (`https:`, `http:`, `tel:`). | `sanitizeUrl` in `src/utils/security.js` blocks `javascript:`, `data:`, and malformed URIs. |
| **Query Parameter Injection** | Search queries and category hash parameters are sanitized and bounded. | `sanitizeSearchInput` limits length to 100 characters, strips control characters, and regex-validates route slugs. |
| **State Tampering** | LocalStorage reads pass through type and boundary checks. | `validateStorageData` validates age bounds (1–120), state codes, and ID patterns. |
| **Clickjacking & MIME-Sniffing** | HTTP security headers configured in Vite and meta tags. | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Content-Security-Policy`. |

---

## 3. Content Security Policy (CSP)

```http
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
```

---

## 4. Reporting a Security Vulnerability

If you discover a security issue or vulnerability in SchemeSetu:
1. Please **do not** open a public GitHub issue.
2. Report vulnerabilities securely via [GitHub Security Advisories](https://github.com/schemesetu/schemesetu/security/advisories) or contact maintainers directly.
3. Maintainers acknowledge receipt within 48 hours and coordinate a coordinated disclosure timeline.
