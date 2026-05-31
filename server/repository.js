'use strict';

/**
 * Case repository.
 *
 * Translates between the nested JSON case object used by the API/frontend
 * and the relational tables. Repeating sections are stored in child tables
 * and rewritten wholesale on update (delete + re-insert inside a single
 * transaction) which keeps the logic simple and predictable.
 *
 * This module exports an init() function that must be called once at startup
 * (awaiting the async database initialization), and then the synchronous
 * CRUD functions become available.
 */

const { getDb } = require('./db');

let db = null;

// ---------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------

const CASE_COLUMNS = [
  'initial_receipt_date', 'central_receipt_date', 'report_type',
  'case_classification', 'country_of_incidence', 'awareness_date',
  'study_id', 'study_name', 'study_type', 'center_id', 'center_name',
  'literature_reference', 'literature_title', 'literature_author',
  'literature_journal', 'general_comment',
  'patient_initials', 'patient_id', 'patient_dob', 'patient_age',
  'patient_age_unit', 'patient_age_group', 'patient_gender',
  'patient_weight', 'patient_weight_unit', 'patient_height',
  'patient_height_unit', 'patient_race', 'patient_ethnicity',
  'patient_pregnant', 'patient_gestation_period', 'patient_notes',
  'parent_initials', 'parent_dob', 'parent_age', 'parent_gender',
  'parent_weight', 'parent_height', 'parent_lmp_date',
  'narrative', 'company_comment', 'medical_assessment',
  'causality_assessment', 'medwatch_seriousness', 'bfarm_report_type',
  'analysis_notes',
  'workflow_state', 'assigned_user', 'assigned_group', 'case_priority',
  'date_locked', 'date_closed',
  'case_keywords',
];

const CASE_BOOLEANS = new Set(['patient_pregnant']);

const CHILD_TABLES = [
  {
    key: 'reporters', table: 'reporters',
    columns: ['title', 'first_name', 'last_name', 'reporter_type',
      'institution', 'department', 'address', 'city', 'state',
      'postal_code', 'country', 'phone', 'email', 'is_primary', 'is_hcp'],
    booleans: new Set(['is_primary', 'is_hcp']),
  },
  {
    key: 'medical_history', table: 'medical_history',
    columns: ['condition', 'start_date', 'continuing', 'end_date', 'notes'],
    booleans: new Set(['continuing']),
  },
  {
    key: 'lab_data', table: 'lab_data',
    columns: ['test_name', 'test_date', 'result', 'units', 'normal_low',
      'normal_high', 'assessment'],
    booleans: new Set(),
  },
  {
    key: 'events', table: 'events',
    columns: ['description_reported', 'pt_term', 'llt_term', 'soc',
      'onset_date', 'stop_date', 'duration', 'duration_unit', 'outcome',
      'severity', 'causality', 'is_serious', 'ser_death',
      'ser_life_threatening', 'ser_hospitalization', 'ser_disability',
      'ser_congenital_anomaly', 'ser_other_medically_imp'],
    booleans: new Set(['is_serious', 'ser_death', 'ser_life_threatening',
      'ser_hospitalization', 'ser_disability', 'ser_congenital_anomaly',
      'ser_other_medically_imp']),
  },
  {
    key: 'action_items', table: 'action_items',
    columns: ['code', 'description', 'assigned_to', 'due_date',
      'completed_date', 'status', 'notes'],
    booleans: new Set(),
  },
  {
    key: 'contact_log', table: 'contact_log',
    columns: ['contact_date', 'contact_person', 'method', 'description'],
    booleans: new Set(),
  },
  {
    key: 'case_notes', table: 'case_notes',
    columns: ['note_type', 'description', 'attachment_name'],
    booleans: new Set(),
  },
  {
    key: 'case_references', table: 'case_references',
    columns: ['ref_type', 'ref_id', 'description'],
    booleans: new Set(),
  },
  {
    key: 'regulatory_reports', table: 'regulatory_reports',
    columns: ['report_form', 'agency', 'destination', 'license_type',
      'submission_type', 'due_date', 'submission_date', 'status', 'notes'],
    booleans: new Set(),
  },
];

const PRODUCT_COLUMNS = ['product_name', 'generic_name', 'manufacturer',
  'drug_type', 'indication', 'formulation', 'lot_number', 'expiration_date',
  'dechallenge', 'rechallenge', 'action_taken', 'first_dose_date',
  'last_dose_date', 'notes'];

const DOSAGE_COLUMNS = ['dose', 'dose_unit', 'route', 'frequency',
  'start_date', 'stop_date', 'duration', 'duration_unit'];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function coerce(value, isBoolean) {
  if (isBoolean) return value ? 1 : 0;
  if (value === undefined || value === '') return null;
  return value;
}

function rowFromObject(obj, columns, booleans) {
  const row = {};
  for (const col of columns) {
    row[col] = coerce(obj ? obj[col] : null, booleans.has(col));
  }
  return row;
}

function runInsert(table, columns, row) {
  const cols = Object.keys(row);
  const placeholders = cols.map(c => `@${c}`).join(', ');
  return db.prepare(
    `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`
  ).run(row);
}

function nextCaseNumber() {
  const year = new Date().getFullYear();
  const prefix = `PV${year}-`;
  const row = db.prepare(
    `SELECT case_number FROM cases WHERE case_number LIKE ? ORDER BY id DESC LIMIT 1`
  ).get(`${prefix}%`);
  let seq = 1;
  if (row) {
    const parsed = parseInt(row.case_number.slice(prefix.length), 10);
    if (!Number.isNaN(parsed)) seq = parsed + 1;
  }
  return `${prefix}${String(seq).padStart(5, '0')}`;
}

// ---------------------------------------------------------------------
// Write children
// ---------------------------------------------------------------------

function insertChildren(caseId, data) {
  for (const child of CHILD_TABLES) {
    const rows = Array.isArray(data[child.key]) ? data[child.key] : [];
    rows.forEach((item, index) => {
      const row = rowFromObject(item, child.columns, child.booleans);
      row.case_id = caseId;
      row.sort_order = index;
      runInsert(child.table, child.columns, row);
    });
  }

  const products = Array.isArray(data.products) ? data.products : [];
  products.forEach((product, pIndex) => {
    const row = rowFromObject(product, PRODUCT_COLUMNS, new Set());
    row.case_id = caseId;
    row.sort_order = pIndex;
    const info = runInsert('products', PRODUCT_COLUMNS, row);
    const productId = info.lastInsertRowid;
    const dosages = Array.isArray(product.dosages) ? product.dosages : [];
    dosages.forEach((dosage, dIndex) => {
      const drow = rowFromObject(dosage, DOSAGE_COLUMNS, new Set());
      drow.product_id = productId;
      drow.sort_order = dIndex;
      runInsert('dosages', DOSAGE_COLUMNS, drow);
    });
  });
}

function deleteChildren(caseId) {
  for (const child of CHILD_TABLES) {
    db.prepare(`DELETE FROM ${child.table} WHERE case_id = ?`).run(caseId);
  }
  db.prepare('DELETE FROM products WHERE case_id = ?').run(caseId);
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

function listCases() {
  const cases = db.prepare(
    `SELECT id, case_number, initial_receipt_date, country_of_incidence,
            report_type, patient_initials, workflow_state, case_priority,
            study_id, updated_at
     FROM cases ORDER BY id DESC`
  ).all();

  return cases.map((c) => {
    const events = db.prepare(
      'SELECT pt_term, description_reported, is_serious FROM events WHERE case_id = ? ORDER BY sort_order'
    ).all(c.id);
    const products = db.prepare(
      "SELECT product_name FROM products WHERE case_id = ? AND drug_type = 'Suspect' ORDER BY sort_order"
    ).all(c.id);
    return {
      ...c,
      primary_event: events.length > 0
        ? (events[0].pt_term || events[0].description_reported || '')
        : '',
      is_serious: events.some((e) => e.is_serious) ? 1 : 0,
      suspect_product: products.length > 0 ? products[0].product_name : '',
    };
  });
}

function getCaseById(id) {
  const caseRow = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
  if (!caseRow) return null;

  for (const child of CHILD_TABLES) {
    caseRow[child.key] = db.prepare(
      `SELECT * FROM ${child.table} WHERE case_id = ? ORDER BY sort_order`
    ).all(id);
  }

  const products = db.prepare(
    'SELECT * FROM products WHERE case_id = ? ORDER BY sort_order'
  ).all(id);
  for (const product of products) {
    product.dosages = db.prepare(
      'SELECT * FROM dosages WHERE product_id = ? ORDER BY sort_order'
    ).all(product.id);
  }
  caseRow.products = products;

  return caseRow;
}

function createCase(data) {
  const txFn = db.transaction((d) => {
    const now = new Date().toISOString();
    const caseNumber =
      d.case_number && String(d.case_number).trim() !== ''
        ? d.case_number
        : nextCaseNumber();

    const row = {};
    for (const col of CASE_COLUMNS) {
      row[col] = coerce(d[col], CASE_BOOLEANS.has(col));
    }
    row.case_number = caseNumber;
    row.created_at = now;
    row.updated_at = now;

    const info = runInsert('cases', [...CASE_COLUMNS, 'case_number', 'created_at', 'updated_at'], row);
    const caseId = info.lastInsertRowid;
    insertChildren(caseId, d);
    return getCaseById(caseId);
  });
  return txFn(data);
}

function updateCase(id, data) {
  const txFn = db.transaction((caseId, d) => {
    const existing = db.prepare('SELECT id FROM cases WHERE id = ?').get(caseId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const row = {};
    for (const col of CASE_COLUMNS) {
      row[col] = coerce(d[col], CASE_BOOLEANS.has(col));
    }
    row.id = caseId;
    row.updated_at = now;

    const setClause = [...CASE_COLUMNS, 'updated_at']
      .map((c) => `${c} = @${c}`)
      .join(', ');
    db.prepare(`UPDATE cases SET ${setClause} WHERE id = @id`).run(row);

    deleteChildren(caseId);
    insertChildren(caseId, d);
    return getCaseById(caseId);
  });
  return txFn(id, data);
}

function deleteCase(id) {
  const info = db.prepare('DELETE FROM cases WHERE id = ?').run(id);
  return info.changes > 0;
}

// ---------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------

async function init() {
  db = await getDb();
}

module.exports = {
  init,
  listCases,
  getCase: getCaseById,
  createCase,
  updateCase,
  deleteCase,
  nextCaseNumber,
};
