// Tab 7: Additional Info — keywords, notes & attachments, references.

import { h, section, fieldGrid, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderAdditionalInfoTab(model) {
  const keywords = section('Case Keywords',
    fieldGrid(textareaField(model, 'case_keywords', {
      label: 'Keywords / Tags',
      rows: 2,
      hint: 'Comma-separated keywords used for searching and categorising the case.',
    })));

  const notes = section('Notes & Attachments',
    repeatGrid({
      array: model.case_notes,
      addLabel: 'Add Note / Attachment',
      emptyText: 'No notes or attachments recorded.',
      newRow: () => ({ note_type: '', description: '', attachment_name: '' }),
      columns: [
        { key: 'note_type', label: 'Type', type: 'select', options: CL.NOTE_TYPES, width: '180px' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'attachment_name', label: 'Attachment / File Name', width: '220px' },
      ],
    }));

  const references = section('References',
    repeatGrid({
      array: model.case_references,
      addLabel: 'Add Reference',
      emptyText: 'No references recorded.',
      newRow: () => ({ ref_type: '', ref_id: '', description: '' }),
      columns: [
        { key: 'ref_type', label: 'Reference Type', type: 'select', options: CL.REFERENCE_TYPES, width: '180px' },
        { key: 'ref_id', label: 'Reference ID', width: '160px' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
    }));

  return h('div', {}, keywords, notes, references);
}
