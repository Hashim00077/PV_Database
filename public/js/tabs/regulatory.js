// Tab 8: Regulatory Reports — scheduled expedited / periodic submissions.

import { h, section, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderRegulatoryTab(model) {
  const reports = section('Scheduled Regulatory Reports',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.regulatory_reports,
        addLabel: 'Add Report',
        emptyText: 'No regulatory reports scheduled. Add expedited or periodic submissions here.',
        newRow: () => ({ report_form: '', agency: '', destination: '', license_type: '', submission_type: '', due_date: '', submission_date: '', status: 'Scheduled', notes: '' }),
        columns: [
          { key: 'report_form', label: 'Report Form', type: 'select', options: CL.REPORT_FORMS, width: '180px' },
          { key: 'agency', label: 'Agency', type: 'select', options: CL.AGENCIES, width: '160px' },
          { key: 'destination', label: 'Destination', width: '150px' },
          { key: 'license_type', label: 'License Type', width: '130px' },
          { key: 'submission_type', label: 'Type', type: 'select', options: CL.SUBMISSION_TYPES, width: '130px' },
          { key: 'due_date', label: 'Due Date', type: 'date', width: '140px' },
          { key: 'submission_date', label: 'Submitted', type: 'date', width: '140px' },
          { key: 'status', label: 'Status', type: 'select', options: CL.REPORT_STATUSES, width: '140px' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
      })));

  const helpNote = h('div', { class: 'required-note' },
    'In production Argus these schedules are generated automatically from reporting rules. Here they are entered manually for teaching the reporting concepts (expedited 7/15-day, periodic PBRER/PSUR, PADER, etc.).');

  return h('div', {}, reports, helpNote);
}
