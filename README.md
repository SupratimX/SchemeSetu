# SchemeSetu: Government Scheme Discovery Platform

SchemeSetu is a lightweight, mobile-first web application enabling citizens across India to discover welfare schemes they qualify for without requiring account creation or transmitting personal data.

## Features

- **8-Step Smart Questionnaire**: Plain-language eligibility questions covering State, Area, Age, Gender, Income, Category, Occupation, and Special conditions.
- **Rules Engine with Transparent Explanations**: Schemes are sorted into Eligible, May Be Eligible, and Not Eligible with exact match or mismatch reasoning.
- **Combined Document Checklist**: Deduplicates and groups required certificates and papers across all qualified schemes, with one-click print functionality.
- **Client-Side Fuzzy Search**: Powered by MiniSearch for fast in-memory keyword matching and category filters.
- **Multilingual Support**: Available in English, Hindi, and Assamese.
- **Privacy by Design**: Runs 100% on-device; no backend database or tracking.

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Data Validation
```bash
node scripts/validate-data.js
```
