# Contributing to SchemeSetu

Thank you for your interest in contributing to **SchemeSetu**! This project is dedicated to helping Indian citizens discover welfare schemes through a fast, transparent, and privacy-preserving platform.

---

## 🏛️ Contribution Guidelines

We welcome contributions in the following areas:
1. **Adding & Updating Schemes**: Adding new Central and State government schemes or updating existing ones when guidelines change.
2. **Translation & Localisation**: Enhancing translations in Assamese, Hindi, English, or adding new Indian languages.
3. **Engine & Accessibility Enhancements**: Improving rule operators, WCAG compliance, and offline PWA reliability.

---

## 📋 Adding or Updating a Scheme

Scheme records are stored as structured JSON files:
- Central schemes: `src/data/schemes/central.json`
- State schemes: `src/data/schemes/assam.json` (or new state files)

### Schema Requirements
Every scheme must satisfy the validation rules in `src/data/schema.json`:
- **Unique `id`**: Kebab-case identifier (e.g. `pm-kisan`).
- **Trilingual Metadata**: `name` and `summary` must provide translations in `en`, `hi`, and `as`.
- **Eligibility Rules**: Deterministic rules structured under `all`, `any`, and `none` blocks using supported operators (`eq`, `gte`, `lte`, `in`, `between`, `contains`).
- **Verification Audit**: Official notifications must be referenced under `source`, with `lastVerified` and `verifiedBy`.

---

## 🧪 Testing Your Changes

Before submitting a Pull Request, run the local verification suite:

```bash
# Run the complete test suite (data audits, security checks, and engine tests)
npm test
```

All contributions must pass:
1. **Data Integrity**: Zero duplicate IDs and schema conformity.
2. **Security**: Safe protocol enforcement and XSS sanitization.
3. **Engine Tests**: Unit tests across rule operators and citizen personas.
4. **Accessibility**: Form input labeling and contrast standards.

---

## 🤝 Code of Conduct

Please engage respectfully with the community. SchemeSetu is maintained for public welfare and civic empowerment.
