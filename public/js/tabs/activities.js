// Tab 6: Activities — workflow/routing, action items, contact log.

import { h, section, fieldGrid, inputField, selectField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderActivitiesTab(model) {
  const workflow = section('Case Routing & Workflow',
    fieldGrid(
      selectField(model, 'workflow_state', { label: 'Workflow State', options: CL.WORKFLOW_STATES }),
      selectField(model, 'case_priority', { label: 'Case Priority', options: CL.PRIORITIES }),
      inputField(model, 'assigned_user', { label: 'Assigned User' }),
      inputField(model, 'assigned_group', { label: 'Assigned Group / Site' }),
      inputField(model, 'date_locked', { label: 'Date Locked', type: 'date' }),
      inputField(model, 'date_closed', { label: 'Date Closed', type: 'date' })
    ));

  const actionItems = section('Action Items',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.action_items,
        addLabel: 'Add Action Item',
        emptyText: 'No action items. Add follow-up tasks, queries or to-dos for this case.',
        newRow: () => ({ code: '', description: '', assigned_to: '', due_date: '', completed_date: '', status: 'Open', notes: '' }),
        columns: [
          { key: 'code', label: 'Code', width: '90px' },
          { key: 'description', label: 'Description', width: '240px' },
          { key: 'assigned_to', label: 'Assigned To', width: '140px' },
          { key: 'due_date', label: 'Due Date', type: 'date', width: '140px' },
          { key: 'completed_date', label: 'Completed', type: 'date', width: '140px' },
          { key: 'status', label: 'Status', type: 'select', options: CL.ACTION_STATUSES, width: '120px' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
      })));

  const contactLog = section('Contact Log',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.contact_log,
        addLabel: 'Add Contact',
        emptyText: 'No contact log entries.',
        newRow: () => ({ contact_date: '', contact_person: '', method: '', description: '' }),
        columns: [
          { key: 'contact_date', label: 'Date', type: 'date', width: '150px' },
          { key: 'contact_person', label: 'Contact Person', width: '180px' },
          { key: 'method', label: 'Method', type: 'select', options: CL.CONTACT_METHODS, width: '130px' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      })));

  return h('div', {}, workflow, actionItems, contactLog);
}
