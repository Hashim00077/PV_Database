# Argus Safety Clone — Teaching Edition

A self-hosted, web-based replica of the **Oracle Argus Safety Case Form** built for learning and teaching pharmacovigilance (PV) case data entry concepts.

![License: MIT](https://img.shields.io/badge/license-MIT-blue)

---

## What is this?

Oracle Argus Safety is the industry-standard database for Individual Case Safety Reports (ICSRs). This project recreates its **Case Form** with all **8 data-entry tabs** fully functional:

| # | Tab | What it captures |
|---|-----|-----------------|
| 1 | **General** | Receipt dates, report type, case classification, reporter(s), study info, literature |
| 2 | **Patient** | Demographics, pregnancy, medical history, lab data, parent info |
| 3 | **Products** | Suspect/concomitant drugs, dosage regimens, dechallenge/rechallenge |
| 4 | **Events** | Adverse events, MedDRA coding, seriousness criteria, outcome, severity |
| 5 | **Analysis** | Narrative, company comment, causality assessment, regulatory assessment |
| 6 | **Activities** | Workflow/routing, action items, contact log |
| 7 | **Additional Info** | Notes & attachments, references, keywords |
| 8 | **Regulatory Reports** | Scheduled expedited/periodic reports, agencies, due dates |

The remaining top-level menus (Worklist, Reports, Code Lists, Utilities, Argus Console, Help) are present and clickable but **non-functional demonstration placeholders** — matching the real product's menu layout.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Hashim00077/PV_Database.git
cd PV_Database

# 2. Install dependencies
npm install

# 3. (Optional) Seed sample cases
npm run seed

# 4. Start the server
npm start
```

Open **http://localhost:3000** in your browser.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Backend | Node.js + Express | Simple, single-process server |
| Database | SQLite (via `better-sqlite3`) | Zero-config, single-file database |
| Frontend | Vanilla HTML/CSS/JS (ES modules) | No build step, readable source, easy to teach |

Everything runs on a single port with no external services. Just `npm install` and `npm start`.

---

## Project Structure

```
PV_Database/
├── server/
│   ├── index.js          # Express app entry point
│   ├── routes.js         # REST API: /api/cases CRUD
│   ├── repository.js     # Data access layer (SQL transactions)
│   ├── schema.sql        # SQLite table definitions
│   ├── db.js             # Database connection bootstrap
│   └── seed.js           # Sample data seeder
├── public/
│   ├── index.html        # Application shell
│   ├── css/styles.css    # Full stylesheet (enterprise look)
│   └── js/
│       ├── app.js        # Menu bar, router, worklist view
│       ├── api.js        # Fetch wrapper for the REST API
│       ├── caseForm.js   # Case form shell (8-tab container)
│       ├── codelists.js  # Configurable code list values
│       ├── components.js # Reusable UI components (DOM builder, forms, grids)
│       └── tabs/         # One module per tab
│           ├── general.js
│           ├── patient.js
│           ├── products.js
│           ├── events.js
│           ├── analysis.js
│           ├── activities.js
│           ├── additionalInfo.js
│           └── regulatory.js
├── data/                 # Auto-created; holds argus.db (gitignored)
├── package.json
└── .gitignore
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List all cases (summary) |
| POST | `/api/cases` | Create a new case |
| GET | `/api/cases/:id` | Get full case with all children |
| PUT | `/api/cases/:id` | Replace/update a case |
| DELETE | `/api/cases/:id` | Delete a case |
| GET | `/api/next-case-number` | Preview next auto-generated case number |

---

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `3000` | Server listen port |
| `ARGUS_DB_PATH` | `./data/argus.db` | Path to the SQLite database file |

---

## Disclaimer

This project is **not affiliated with or endorsed by Oracle Corporation**. It is an independent educational tool created to help pharmacovigilance professionals and students learn case data entry concepts in a hands-on environment.

---

## License

MIT
