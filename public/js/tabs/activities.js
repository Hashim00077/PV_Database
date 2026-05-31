// Tab 6: Activities -- workflow/routing, action items, contact log.

import { h, section, fieldGrid, inputField, selectField, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderActivitiesTab(model) {
  const workflow = section('Case Routing',
    fieldGrid(
      selectField(model, 'workflow_state', { label: 'Workflow State', options: CL.WORKFLOW_STATES }),
      inputField(model, 'assigned_user', { label: 'Assigned To - User' }),
      inputField(model, 'assigned_group', { label: 'Assigned To - Group/Site' }),
      inputField(model, 'date_locked', { label: 'Lock Date', type: 'date' }),
      inputField(model, 'date_closed', { label: 'Close Date', type: 'date' }),
      selectField(model, 'case_priority', { label: 'Priority', options: CL.PRIORITIES })
    ));

  const actionItems = section('Action Items',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.action_items,
        addLabel: 'Add Action Item',
        emptyText: 'No action items. Add follow-up tasks, queries or to-dos for this case.',
        newRow: () => ({ code: '', description: '', assigned_to: '', due_date: '', completed_date: '', status: 'Open' }),
        columns: [
          { key: 'code', label: 'Code', width: '90px' },
          { key: 'description', label: 'Action Item Description', width: '220px' },
          { key: 'assigned_to', label: 'Assigned To', width: '130px' },
          { key: 'due_date', label: 'Due Date', type: 'date', width: '120px' },
          { key: 'completed_date', label: 'Date Completed', type: 'date', width: '120px' },
          { key: 'status', label: 'Status', type: 'select', options: CL.ACTION_STATUSES, width: '110px' },
        ],
      })));

  const contactLog = section('Contact Log',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.contact_log,
        addLabel: 'Add Contact',
        emptyText: 'No contact log entries.',
        newRow: () => ({ contact_date: '', user: '', contact_person: '', method: '', description: '' }),
        columns: [
          { key: 'contact_date', label: 'Date', type: 'date', width: '120px' },
          { key: 'user', label: 'User', width: '120px' },
          { key: 'contact_person', label: 'Contact Person', width: '150px' },
          { key: 'method', label: 'Method', type: 'select', options: CL.CONTACT_METHODS, width: '110px' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      })));

  return h('div', {}, workflow, actionItems, contactLog);
}
