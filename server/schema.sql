-- =====================================================================
-- Argus Safety Clone - SQLite schema
-- A central `cases` table holds the singleton (one-per-case) fields for
-- every tab. Repeating sections (reporters, products, events, etc.) live
-- in child tables that reference the case via case_id with ON DELETE
-- CASCADE so deleting a case cleans up everything it owns.
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- Main case record + all singleton fields, grouped by tab
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cases (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  case_number              TEXT UNIQUE NOT NULL,

  -- General tab -------------------------------------------------------
  initial_receipt_date     TEXT,
  central_receipt_date     TEXT,
  report_type              TEXT,
  case_classification      TEXT,
  country_of_incidence     TEXT,
  awareness_date           TEXT,
  study_id                 TEXT,
  study_name               TEXT,
  study_type               TEXT,
  center_id                TEXT,
  center_name              TEXT,
  literature_reference     TEXT,
  literature_title         TEXT,
  literature_author        TEXT,
  literature_journal       TEXT,
  general_comment          TEXT,

  -- Patient tab -------------------------------------------------------
  patient_initials         TEXT,
  patient_id               TEXT,
  patient_dob              TEXT,
  patient_age              TEXT,
  patient_age_unit         TEXT,
  patient_age_group        TEXT,
  patient_gender           TEXT,
  patient_weight           TEXT,
  patient_weight_unit      TEXT,
  patient_height           TEXT,
  patient_height_unit      TEXT,
  patient_race             TEXT,
  patient_ethnicity        TEXT,
  patient_pregnant         INTEGER DEFAULT 0,
  patient_gestation_period TEXT,
  patient_notes            TEXT,
  parent_initials          TEXT,
  parent_dob               TEXT,
  parent_age               TEXT,
  parent_gender            TEXT,
  parent_weight            TEXT,
  parent_height            TEXT,
  parent_lmp_date          TEXT,

  -- Analysis tab ------------------------------------------------------
  narrative                TEXT,
  company_comment          TEXT,
  medical_assessment       TEXT,
  causality_assessment     TEXT,
  medwatch_seriousness     TEXT,
  bfarm_report_type        TEXT,
  analysis_notes           TEXT,

  -- Activities tab (singleton workflow fields) ------------------------
  workflow_state           TEXT,
  assigned_user            TEXT,
  assigned_group           TEXT,
  case_priority            TEXT,
  date_locked              TEXT,
  date_closed              TEXT,

  -- Additional Info tab ----------------------------------------------
  case_keywords            TEXT,

  -- Bookkeeping -------------------------------------------------------
  created_at               TEXT NOT NULL,
  updated_at               TEXT NOT NULL
);

-- ---------------------------------------------------------------------
-- General tab: reporters (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reporters (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id       INTEGER NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  title         TEXT,
  first_name    TEXT,
  last_name     TEXT,
  reporter_type TEXT,
  institution   TEXT,
  department    TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  postal_code   TEXT,
  country       TEXT,
  phone         TEXT,
  email         TEXT,
  is_primary    INTEGER DEFAULT 0,
  is_hcp        INTEGER DEFAULT 0,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Patient tab: medical history (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id     INTEGER NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  condition   TEXT,
  start_date  TEXT,
  continuing  INTEGER DEFAULT 0,
  end_date    TEXT,
  notes       TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Patient tab: lab data (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_data (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id     INTEGER NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  test_name   TEXT,
  test_date   TEXT,
  result      TEXT,
  units       TEXT,
  normal_low  TEXT,
  normal_high TEXT,
  assessment  TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Products tab: products (one-to-many) + dosages (child of product)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id         INTEGER NOT NULL,
  sort_order      INTEGER DEFAULT 0,
  product_name    TEXT,
  generic_name    TEXT,
  manufacturer    TEXT,
  drug_type       TEXT,
  indication      TEXT,
  formulation     TEXT,
  lot_number      TEXT,
  expiration_date TEXT,
  dechallenge     TEXT,
  rechallenge     TEXT,
  action_taken    TEXT,
  first_dose_date TEXT,
  last_dose_date  TEXT,
  notes           TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dosages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id    INTEGER NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  dose          TEXT,
  dose_unit     TEXT,
  route         TEXT,
  frequency     TEXT,
  start_date    TEXT,
  stop_date     TEXT,
  duration      TEXT,
  duration_unit TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Events tab: adverse events (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id                        INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id                   INTEGER NOT NULL,
  sort_order                INTEGER DEFAULT 0,
  description_reported      TEXT,
  pt_term                   TEXT,
  llt_term                  TEXT,
  soc                       TEXT,
  onset_date                TEXT,
  stop_date                 TEXT,
  duration                  TEXT,
  duration_unit             TEXT,
  outcome                   TEXT,
  severity                  TEXT,
  causality                 TEXT,
  is_serious                INTEGER DEFAULT 0,
  ser_death                 INTEGER DEFAULT 0,
  ser_life_threatening      INTEGER DEFAULT 0,
  ser_hospitalization       INTEGER DEFAULT 0,
  ser_disability            INTEGER DEFAULT 0,
  ser_congenital_anomaly    INTEGER DEFAULT 0,
  ser_other_medically_imp   INTEGER DEFAULT 0,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Activities tab: action items (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS action_items (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id        INTEGER NOT NULL,
  sort_order     INTEGER DEFAULT 0,
  code           TEXT,
  description    TEXT,
  assigned_to    TEXT,
  due_date       TEXT,
  completed_date TEXT,
  status         TEXT,
  notes          TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Activities tab: contact log (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id        INTEGER NOT NULL,
  sort_order     INTEGER DEFAULT 0,
  contact_date   TEXT,
  contact_person TEXT,
  method         TEXT,
  description    TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Additional Info tab: notes & attachments (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_notes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id         INTEGER NOT NULL,
  sort_order      INTEGER DEFAULT 0,
  note_type       TEXT,
  description     TEXT,
  attachment_name TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Additional Info tab: references (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_references (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id     INTEGER NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  ref_type    TEXT,
  ref_id      TEXT,
  description TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Regulatory Reports tab: scheduled reports (one-to-many)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regulatory_reports (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id         INTEGER NOT NULL,
  sort_order      INTEGER DEFAULT 0,
  report_form     TEXT,
  agency          TEXT,
  destination     TEXT,
  license_type    TEXT,
  submission_type TEXT,
  due_date        TEXT,
  submission_date TEXT,
  status          TEXT,
  notes           TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);
