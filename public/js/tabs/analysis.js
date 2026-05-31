// Tab 5: Analysis — narrative, company comment, medical & regulatory assessment.

import { h, section, fieldGrid, selectField, textareaField } from '../components.js';
import * as CL from '../codelists.js';

export function renderAnalysisTab(model) {
  const narrative = section('Case Narrative',
    fieldGrid(textareaField(model, 'narrative', {
      label: 'Narrative',
      rows: 10,
      hint: 'A clear, chronological account of the case: patient, suspect product(s), event(s), treatment and outcome.',
    })));

  const companyComment = section('Company Comment',
    fieldGrid(textareaField(model, 'company_comment', { label: 'Sender / Company Comment', rows: 5 })));

  const medical = section('Medical Assessment',
    fieldGrid(
      textareaField(model, 'medical_assessment', { label: 'Medical Reviewer Assessment', rows: 5 }),
      selectField(model, 'causality_assessment', { label: 'Company Causality Assessment', options: CL.CAUSALITIES, span: 'full' })
    ));

  const regulatory = section('Regulatory Assessment',
    fieldGrid(
      selectField(model, 'medwatch_seriousness', { label: 'MedWatch (FDA) Seriousness', options: CL.MEDWATCH_SERIOUSNESS }),
      selectField(model, 'bfarm_report_type', { label: 'BfArM Report Type', options: CL.BFARM_REPORT_TYPES })
    ));

  const notes = section('Analysis Notes',
    fieldGrid(textareaField(model, 'analysis_notes', { label: 'Notes', rows: 3 })));

  return h('div', {}, narrative, companyComment, medical, regulatory, notes);
}
