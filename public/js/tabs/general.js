// Tab 1: General -- case-level info, study info, reporters, literature.

import { h, section, fieldGrid, inputField, selectField, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderGeneralTab(model) {
  const caseInfo = section('Case Information',
    fieldGrid(
      inputField(model, 'case_number', { label: 'Case Number', readonly: true }),
      inputField(model, 'follow_up_number', { label: 'Follow-up Number' }),
      inputField(model, 'initial_receipt_date', { label: 'Initial Receipt Date', type: 'date', required: true }),
      inputField(model, 'central_receipt_date', { label: 'Central Receipt Date', type: 'date' }),
      inputField(model, 'safety_date', { label: 'Safety Date', type: 'date' }),
      inputField(model, 'awareness_date', { label: 'Aware Date', type: 'date' }),
      selectField(model, 'report_type', { label: 'Report Type', options: CL.REPORT_TYPES, required: true }),
      selectField(model, 'country_of_incidence', { label: 'Country of Incidence', options: CL.COUNTRIES }),
      selectField(model, 'case_classification', { label: 'Case Classification', options: CL.CASE_CLASSIFICATIONS })
    ));

  const studyInfo = section('Study Information',
    fieldGrid(
      inputField(model, 'study_id', { label: 'Study ID' }),
      inputField(model, 'study_name', { label: 'Study Title', span: 2 }),
      selectField(model, 'study_type', { label: 'Study Type', options: CL.STUDY_TYPES }),
      inputField(model, 'center_id', { label: 'Center ID' }),
      inputField(model, 'protocol_number', { label: 'Protocol Number' }),
      inputField(model, 'center_name', { label: 'Center Name', span: 2 })
    ));

  const reporters = section('Reporter Information',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.reporters,
        addLabel: 'Add Reporter',
        emptyText: 'No reporters recorded. Add the primary reporter who notified you of the case.',
        newRow: () => ({ title: '', first_name: '', middle_initial: '', last_name: '', suffix: '', reporter_type: '', is_hcp: 0, is_primary: model.reporters.length === 0 ? 1 : 0, report_media: '', institution: '', address: '', city: '', state: '', postal_code: '', country: '', phone: '', fax: '', email: '' }),
        columns: [
          { key: 'title', label: 'Prefix', width: '70px' },
          { key: 'first_name', label: 'First Name', width: '120px' },
          { key: 'middle_initial', label: 'MI', width: '50px' },
          { key: 'last_name', label: 'Last Name', width: '120px' },
          { key: 'suffix', label: 'Suffix', width: '60px' },
          { key: 'reporter_type', label: 'Reporter Type', type: 'select', options: CL.REPORTER_TYPES, width: '140px' },
          { key: 'is_hcp', label: 'HCP?', type: 'checkbox', width: '50px' },
          { key: 'is_primary', label: 'Primary?', type: 'checkbox', width: '55px' },
          { key: 'report_media', label: 'Report Media', type: 'select', options: CL.REPORT_MEDIA, width: '110px' },
          { key: 'institution', label: 'Institution', width: '140px' },
          { key: 'address', label: 'Address', width: '150px' },
          { key: 'city', label: 'City', width: '100px' },
          { key: 'state', label: 'State', width: '80px' },
          { key: 'postal_code', label: 'Postal Code', width: '80px' },
          { key: 'country', label: 'Country', type: 'select', options: CL.COUNTRIES, width: '120px' },
          { key: 'phone', label: 'Phone', width: '100px' },
          { key: 'fax', label: 'Fax', width: '100px' },
          { key: 'email', label: 'E-mail', width: '150px' },
        ],
      })));

  const literature = section('Literature Information',
    fieldGrid(
      inputField(model, 'literature_author', { label: 'Author' }),
      inputField(model, 'literature_title', { label: 'Title', span: 2 }),
      inputField(model, 'literature_journal', { label: 'Journal' }),
      inputField(model, 'literature_vol', { label: 'Vol' }),
      inputField(model, 'literature_year', { label: 'Year' }),
      inputField(model, 'literature_pages', { label: 'Pages' })
    ));

  return h('div', {}, caseInfo, studyInfo, reporters, literature);
}
