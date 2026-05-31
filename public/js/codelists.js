// Code lists used across the case form. In real Argus these are
// configurable lookups; here they are static arrays for teaching.

export const YES_NO_UNK = ['', 'Yes', 'No', 'Unknown'];

export const REPORT_TYPES = [
  '', 'Spontaneous', 'Report from study', 'Other', 'Not available to sender',
];

export const CASE_CLASSIFICATIONS = [
  '', 'Adverse Event', 'Adverse Event Following Immunization',
  'Medication Error', 'Product Quality Complaint', 'Pregnancy Report',
  'Lack of Efficacy', 'Off-label Use', 'Overdose', 'Misuse / Abuse',
];

export const STUDY_TYPES = [
  '', 'Interventional Clinical Trial', 'Non-interventional Study',
  'Individual Patient Use', 'Other Studies', 'Not Applicable',
];

export const REPORTER_TYPES = [
  '', 'Physician', 'Pharmacist', 'Other Health Professional',
  'Lawyer', 'Consumer / Non-Health Professional', 'Regulatory Authority',
];

export const GENDERS = ['', 'Male', 'Female', 'Unknown'];

export const AGE_UNITS = ['', 'Year', 'Month', 'Week', 'Day', 'Hour'];

export const AGE_GROUPS = [
  '', 'Neonate', 'Infant', 'Child', 'Adolescent', 'Adult', 'Elderly',
];

export const WEIGHT_UNITS = ['', 'kg', 'lb'];
export const HEIGHT_UNITS = ['', 'cm', 'in'];

export const RACES = [
  '', 'Asian', 'Black or African American', 'White',
  'American Indian or Alaska Native', 'Native Hawaiian or Pacific Islander',
  'Other', 'Unknown',
];

export const DRUG_TYPES = [
  '', 'Suspect', 'Concomitant', 'Treatment', 'Drug Not Administered',
];

export const ROUTES = [
  '', 'Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical',
  'Inhalation', 'Rectal', 'Ophthalmic', 'Transdermal', 'Other', 'Unknown',
];

export const DOSE_UNITS = [
  '', 'mg', 'g', 'mcg', 'mL', 'IU', 'tablet(s)', 'capsule(s)', 'drop(s)',
];

export const FREQUENCIES = [
  '', 'Once daily (QD)', 'Twice daily (BID)', 'Three times daily (TID)',
  'Four times daily (QID)', 'Every other day (QOD)', 'Weekly', 'As needed (PRN)',
  'Single dose', 'Continuous',
];

export const DURATION_UNITS = [
  '', 'Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)', 'Year(s)',
];

export const ACTIONS_TAKEN = [
  '', 'Drug withdrawn', 'Dose reduced', 'Dose increased', 'Dose not changed',
  'Unknown', 'Not applicable',
];

export const CHALLENGE = ['', 'Positive', 'Negative', 'Not done', 'Unknown'];

export const OUTCOMES = [
  '', 'Recovered / Resolved', 'Recovering / Resolving',
  'Not Recovered / Not Resolved', 'Recovered with Sequelae',
  'Fatal', 'Unknown',
];

export const SEVERITIES = ['', 'Mild', 'Moderate', 'Severe'];

export const CAUSALITIES = [
  '', 'Certain', 'Probable / Likely', 'Possible', 'Unlikely',
  'Conditional / Unclassified', 'Unassessable / Unclassifiable', 'Not Related',
];

export const WORKFLOW_STATES = [
  '', 'New', 'Data Entry', 'Medical Review', 'Quality Review',
  'Pending Submission', 'Submitted', 'Closed', 'Archived',
];

export const PRIORITIES = ['', '1 - Low', '2 - Medium', '3 - High', '4 - Urgent'];

export const ACTION_STATUSES = ['', 'Open', 'In Progress', 'Completed', 'Cancelled'];

export const CONTACT_METHODS = [
  '', 'Phone', 'Email', 'Fax', 'Letter', 'In Person', 'Portal',
];

export const NOTE_TYPES = [
  '', 'General Note', 'Attachment', 'Source Document', 'Email Correspondence',
  'Internal Comment',
];

export const REFERENCE_TYPES = [
  '', 'Literature', 'Regulatory', 'Duplicate Case', 'Linked Case', 'Other',
];

export const REPORT_FORMS = [
  '', 'CIOMS I', 'MedWatch 3500A (FDA)', 'E2B(R3)', 'EU CT',
  'PSUR / PBRER', 'PADER', 'Yellow Card (MHRA)',
];

export const AGENCIES = [
  '', 'FDA (US)', 'EMA (EU)', 'MHRA (UK)', 'PMDA (Japan)', 'Health Canada',
  'TGA (Australia)', 'BfArM (Germany)', 'CDSCO (India)',
];

export const SUBMISSION_TYPES = ['', 'Expedited', 'Periodic', 'Non-reportable'];

export const REPORT_STATUSES = [
  '', 'Scheduled', 'Generated', 'Pending Approval', 'Submitted',
  'Acknowledged', 'Not Required',
];

export const COUNTRIES = [
  '', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy',
  'Spain', 'Canada', 'Japan', 'Australia', 'India', 'Brazil', 'China',
  'Netherlands', 'Switzerland', 'Other',
];

export const MEDWATCH_SERIOUSNESS = [
  '', 'Serious', 'Non-Serious',
];

export const BFARM_REPORT_TYPES = [
  '', 'Initial', 'Follow-up', 'Nullification',
];

export const REPORT_MEDIA = [
  '', 'Telephone', 'Email', 'Fax', 'Letter', 'Publication', 'Internet', 'Consumer', 'Other',
];

export const LISTEDNESS = ['', 'Listed', 'Unlisted', 'Not Assessable'];

export const EXPECTEDNESS = ['', 'Expected', 'Unexpected', 'Not Assessable'];

export const SERIOUSNESS_ASSESSMENTS = ['', 'Serious', 'Non-Serious', 'Not Assessable'];
