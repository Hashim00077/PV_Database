// Tab 1: General — case-level info, study info, reporters, literature.

import { h, section, fieldGrid, inputField, selectField, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderGeneralTab(model) {
  const generalInfo = section('General Information',
    fieldGrid(
      inputField(model, 'initial_receipt_date', { label: 'Initial Receipt Date', type: 'date', required: true }),
      inputField(model, 'central_receipt_date', { label: 'Central Receipt Date', type: 'date' }),
      inputField(model, 'awareness_date', { label: 'Awareness / Aware Date', type: 'date' }),
      selectField(model, 'report_type', { label: 'Report Type', options: CL.REPORT_TYPES, required: true }),
      selectField(model, 'case_classification', { label: 'Case Classification', options: CL.CASE_CLASSIFICATIONS }),
      selectField(model, 'country_of_incidence', { label: 'Country of Incidence', options: CL.COUNTRIES })
    ));

  const studyInfo = section('Study Information',
    fieldGrid(
      inputField(model, 'study_id', { label: 'Study ID' }),
      inputField(model, 'study_name', { label: 'Study Name', span: 2 }),
      selectField(model, 'study_type', { label: 'Study Type', options: CL.STUDY_TYPES }),
      inputField(model, 'center_id', { label: 'Center ID' }),
      inputField(model, 'center_name', { label: 'Center Name', span: 2 })
    ));

  const reporters = section('Reporter Information',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.reporters,
        addLabel: 'Add Reporter',
        emptyText: 'No reporters recorded. Add the primary reporter who notified you of the case.',
        newRow: () => ({ title: '', first_name: '', last_name: '', reporter_type: '', institution: '', department: '', address: '', city: '', state: '', postal_code: '', country: '', phone: '', email: '', is_primary: model.reporters.length === 0 ? 1 : 0, is_hcp: 0 }),
        columns: [
          { key: 'title', label: 'Title', width: '70px' },
          { key: 'first_name', label: 'First Name', width: '120px' },
          { key: 'last_name', label: 'Last Name', width: '120px' },
          { key: 'reporter_type', label: 'Reporter Type', type: 'select', options: CL.REPORTER_TYPES, width: '160px' },
          { key: 'institution', label: 'Institution', width: '150px' },
          { key: 'city', label: 'City', width: '110px' },
          { key: 'state', label: 'State', width: '90px' },
          { key: 'country', label: 'Country', type: 'select', options: CL.COUNTRIES, width: '140px' },
          { key: 'phone', label: 'Phone', width: '120px' },
          { key: 'email', label: 'Email', width: '160px' },
          { key: 'is_primary', label: 'Primary?', type: 'checkbox', width: '60px' },
          { key: 'is_hcp', label: 'HCP?', type: 'checkbox', width: '50px' },
        ],
      })));

  const literature = section('Literature Information',
    fieldGrid(
      inputField(model, 'literature_title', { label: 'Article Title', span: 'full' }),
      inputField(model, 'literature_author', { label: 'Author(s)' }),
      inputField(model, 'literature_journal', { label: 'Journal / Source' }),
      inputField(model, 'literature_reference', { label: 'Reference / Citation', span: 2 })
    ));

  const comment = section('General Comment',
    fieldGrid(textareaField(model, 'general_comment', { label: 'Comment', rows: 4 })));

  return h('div', {}, generalInfo, studyInfo, reporters, literature, comment);
}
