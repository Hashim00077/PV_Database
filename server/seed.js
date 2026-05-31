'use strict';

/**
 * Seed script: inserts a couple of realistic (but fictional) sample cases so
 * the worklist isn't empty on first run. Run with `npm run seed`.
 *
 * All names, products and identifiers below are invented for teaching.
 */

const repo = require('./repository');

const SAMPLES = [
  {
    initial_receipt_date: '2026-03-12',
    central_receipt_date: '2026-03-13',
    report_type: 'Spontaneous',
    case_classification: 'Adverse Event',
    country_of_incidence: 'United States',
    workflow_state: 'Medical Review',
    case_priority: '3 - High',
    patient_initials: 'J.D.',
    patient_id: 'PT-1001',
    patient_age: '54',
    patient_age_unit: 'Year',
    patient_age_group: 'Adult',
    patient_gender: 'Male',
    patient_weight: '82',
    patient_weight_unit: 'kg',
    narrative:
      'A 54-year-old male with a history of hypertension was started on Cardizoril 10 mg once daily for blood pressure control. Approximately five days later he developed a generalized maculopapular rash and pruritus. The suspect drug was withdrawn and the reaction resolved within one week. The reporting physician assessed the event as probably related to the suspect product.',
    company_comment: 'Consistent with the known safety profile of the product class.',
    causality_assessment: 'Probable / Likely',
    medwatch_seriousness: 'Non-Serious',
    reporters: [
      {
        title: 'Dr.', first_name: 'Alice', last_name: 'Morgan',
        reporter_type: 'Physician', institution: 'Riverside Medical Center',
        city: 'Boston', state: 'MA', country: 'United States',
        phone: '+1-555-0100', email: 'a.morgan@example.org',
        is_primary: 1, is_hcp: 1,
      },
    ],
    medical_history: [
      { condition: 'Hypertension', start_date: '2018-01-01', continuing: 1, end_date: '', notes: 'Well controlled' },
      { condition: 'Seasonal allergic rhinitis', start_date: '2015-04-01', continuing: 1, end_date: '', notes: '' },
    ],
    lab_data: [
      { test_name: 'Eosinophil count', test_date: '2026-03-12', result: '0.7', units: '10^9/L', normal_low: '0.0', normal_high: '0.5', assessment: 'High' },
    ],
    products: [
      {
        product_name: 'Cardizoril', generic_name: 'amlodipine besylate',
        manufacturer: 'Acme Pharma', drug_type: 'Suspect',
        indication: 'Hypertension', formulation: 'Tablet',
        lot_number: 'LOT-7782', action_taken: 'Drug withdrawn',
        dechallenge: 'Positive', rechallenge: 'Not done',
        first_dose_date: '2026-03-01', last_dose_date: '2026-03-06',
        dosages: [
          { dose: '10', dose_unit: 'mg', route: 'Oral', frequency: 'Once daily (QD)', start_date: '2026-03-01', stop_date: '2026-03-06', duration: '6', duration_unit: 'Day(s)' },
        ],
      },
      {
        product_name: 'Aspirin', generic_name: 'acetylsalicylic acid',
        manufacturer: 'Generic Co', drug_type: 'Concomitant',
        indication: 'Cardioprotection', formulation: 'Tablet',
        dosages: [
          { dose: '81', dose_unit: 'mg', route: 'Oral', frequency: 'Once daily (QD)' },
        ],
      },
    ],
    events: [
      {
        description_reported: 'Generalized maculopapular rash with itching',
        pt_term: 'Rash maculo-papular', llt_term: 'Maculopapular rash',
        soc: 'Skin and subcutaneous tissue disorders',
        onset_date: '2026-03-06', stop_date: '2026-03-13',
        outcome: 'Recovered / Resolved', severity: 'Moderate',
        causality: 'Probable / Likely', is_serious: 0,
      },
    ],
    action_items: [
      { code: 'FU01', description: 'Request follow-up on photographs of rash', assigned_to: 'pv.trainee', due_date: '2026-03-20', status: 'Open', notes: '' },
    ],
    contact_log: [
      { contact_date: '2026-03-13', contact_person: 'Dr. Alice Morgan', method: 'Phone', description: 'Initial intake call; clarified dechallenge outcome.' },
    ],
    case_notes: [
      { note_type: 'Source Document', description: 'Reporter email received 12-Mar', attachment_name: 'reporter_email.pdf' },
    ],
    case_references: [
      { ref_type: 'Literature', ref_id: 'PMID-000000', description: 'Class effect rash reference' },
    ],
    regulatory_reports: [
      { report_form: 'MedWatch 3500A (FDA)', agency: 'FDA (US)', submission_type: 'Non-reportable', status: 'Not Required', notes: 'Non-serious, listed event.' },
    ],
  },
  {
    initial_receipt_date: '2026-04-02',
    report_type: 'Report from study',
    case_classification: 'Adverse Event',
    country_of_incidence: 'Germany',
    study_id: 'STU-2026-07',
    study_name: 'Phase III Neurolex Efficacy Trial',
    study_type: 'Interventional Clinical Trial',
    center_id: 'DE-014',
    center_name: 'Universitätsklinikum München',
    workflow_state: 'Pending Submission',
    case_priority: '4 - Urgent',
    patient_initials: 'M.S.',
    patient_age: '67', patient_age_unit: 'Year', patient_age_group: 'Elderly',
    patient_gender: 'Female',
    narrative:
      'A 67-year-old female enrolled in study STU-2026-07 received Neurolex infusion and experienced anaphylaxis requiring hospitalization. The event was considered life-threatening and the patient was treated and recovered. The investigator assessed the event as possibly related to the investigational product.',
    causality_assessment: 'Possible',
    medwatch_seriousness: 'Serious',
    bfarm_report_type: 'Initial',
    reporters: [
      {
        title: 'Prof.', first_name: 'Hans', last_name: 'Keller',
        reporter_type: 'Physician', institution: 'Universitätsklinikum München',
        city: 'Munich', country: 'Germany', is_primary: 1, is_hcp: 1,
      },
    ],
    products: [
      {
        product_name: 'Neurolex', generic_name: 'investigational mAb NX-22',
        manufacturer: 'Acme Pharma', drug_type: 'Suspect',
        indication: 'Multiple sclerosis', formulation: 'Solution for infusion',
        action_taken: 'Drug withdrawn', dechallenge: 'Positive',
        dosages: [
          { dose: '300', dose_unit: 'mg', route: 'Intravenous', frequency: 'Single dose', start_date: '2026-04-01' },
        ],
      },
    ],
    events: [
      {
        description_reported: 'Anaphylactic reaction during infusion',
        pt_term: 'Anaphylactic reaction', soc: 'Immune system disorders',
        onset_date: '2026-04-01', outcome: 'Recovered / Resolved',
        severity: 'Severe', causality: 'Possible',
        is_serious: 1, ser_life_threatening: 1, ser_hospitalization: 1,
      },
    ],
    regulatory_reports: [
      { report_form: 'CIOMS I', agency: 'BfArM (Germany)', submission_type: 'Expedited', due_date: '2026-04-09', status: 'Scheduled', notes: '7-day initial report for fatal/life-threatening.' },
      { report_form: 'E2B(R3)', agency: 'EMA (EU)', submission_type: 'Expedited', due_date: '2026-04-16', status: 'Scheduled', notes: '15-day expedited.' },
    ],
  },
];

let count = 0;
for (const sample of SAMPLES) {
  const created = repo.createCase(sample);
  count += 1;
  console.log(`  Seeded ${created.case_number}`);
}
console.log(`\nDone. Inserted ${count} sample case(s).`);
