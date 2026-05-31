// Tab 8: Regulatory Reports -- scheduled expedited / periodic submissions.

import { h, section, fieldGrid, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderRegulatoryTab(model) {
  const reports = section('Scheduled Reports',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.regulatory_reports,
        addLabel: 'Add Report',
        emptyText: 'No regulatory reports scheduled. Add expedited or periodic submissions here.',
        newRow: () => ({ report_form: '', agency: '', due_date: '', submission_date: '', status: 'Scheduled', submission_type: '' }),
        columns: [
          { key: 'report_form', label: 'Report Form', type: 'select', options: CL.REPORT_FORMS, width: '160px' },
          { key: 'agency', label: 'Destination/Agency', type: 'select', options: CL.AGENCIES, width: '140px' },
          { key: 'due_date', label: 'Due Date', type: 'date', width: '120px' },
          { key: 'submission_date', label: 'Date Submitted', type: 'date', width: '120px' },
          { key: 'status', label: 'Report Status', type: 'select', options: CL.REPORT_STATUSES, width: '130px' },
          { key: 'submission_type', label: 'Submission Type', type: 'select', options: CL.SUBMISSION_TYPES, width: '120px' },
        ],
      })));

  const details = section('Report Details',
    fieldGrid(textareaField(model, 'regulatory_notes', {
      label: 'Report Details',
      rows: 4,
      hint: 'Describe which events and products are included in regulatory submissions.',
    })));

  return h('div', {}, reports, details);
}
