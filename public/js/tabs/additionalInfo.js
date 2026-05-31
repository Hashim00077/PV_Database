// Tab 7: Additional Info -- notes & attachments, references, keywords, case lock/close.

import { h, section, fieldGrid, inputField, selectField, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderAdditionalInfoTab(model) {
  const notes = section('Notes & Attachments',
    repeatGrid({
      array: model.case_notes,
      addLabel: 'Add Note / Attachment',
      emptyText: 'No notes or attachments recorded.',
      newRow: () => ({ note_type: '', note_date: '', description: '', attachment_name: '' }),
      columns: [
        { key: 'note_type', label: 'Type', type: 'select', options: CL.NOTE_TYPES, width: '150px' },
        { key: 'note_date', label: 'Date', type: 'date', width: '120px' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'attachment_name', label: 'File Name', width: '180px' },
      ],
    }));

  const references = section('References',
    repeatGrid({
      array: model.case_references,
      addLabel: 'Add Reference',
      emptyText: 'No references recorded.',
      newRow: () => ({ ref_type: '', ref_id: '', description: '' }),
      columns: [
        { key: 'ref_type', label: 'Type', type: 'select', options: CL.REFERENCE_TYPES, width: '150px' },
        { key: 'ref_id', label: 'Reference ID', width: '140px' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
    }));

  const keywords = section('Keywords',
    fieldGrid(textareaField(model, 'case_keywords', {
      label: 'Keywords',
      rows: 2,
      hint: 'Comma-separated keywords',
    })));

  const lockClose = section('Case Lock/Close',
    fieldGrid(
      inputField(model, 'date_locked', { label: 'Lock Date', type: 'date', readonly: true }),
      inputField(model, 'lock_user', { label: 'Lock User' }),
      inputField(model, 'date_closed', { label: 'Close Date', type: 'date', readonly: true }),
      inputField(model, 'close_user', { label: 'Close User' }),
      inputField(model, 'reason_for_close', { label: 'Reason for Close', span: 2 })
    ));

  return h('div', {}, notes, references, keywords, lockClose);
}
