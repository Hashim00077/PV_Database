// Tab 5: Analysis -- narrative, company comment, case assessment, medical assessment, regulatory.

import { h, section, fieldGrid, selectField, textareaField } from '../components.js';
import * as CL from '../codelists.js';

export function renderAnalysisTab(model) {
  const narrative = section('Case Narrative',
    fieldGrid(textareaField(model, 'narrative', {
      label: 'Narrative',
      rows: 10,
      hint: 'A clear, chronological account of the case: patient, suspect product(s), event(s), treatment and outcome.',
    })));

  const companyComment = section('Case Comment / Company Comment',
    fieldGrid(textareaField(model, 'company_comment', { label: 'Company Comment', rows: 5 })));

  const caseAssessment = section('Case Assessment',
    fieldGrid(
      selectField(model, 'listedness', { label: 'Listedness', options: CL.LISTEDNESS }),
      selectField(model, 'expectedness', { label: 'Expectedness', options: CL.EXPECTEDNESS }),
      selectField(model, 'causality_assessment', { label: 'Causality', options: CL.CAUSALITIES })
    ));

  const medical = section('Medical Assessment',
    fieldGrid(
      textareaField(model, 'medical_assessment', { label: 'Medical Assessment', rows: 4 }),
      selectField(model, 'seriousness_assessment', { label: 'Seriousness Assessment', options: CL.SERIOUSNESS_ASSESSMENTS }),
      selectField(model, 'listedness_assessment', { label: 'Listedness Assessment', options: CL.LISTEDNESS })
    ));

  const regulatory = section('Regulatory Information',
    fieldGrid(
      selectField(model, 'medwatch_seriousness', { label: 'MedWatch Seriousness', options: CL.MEDWATCH_SERIOUSNESS }),
      selectField(model, 'bfarm_report_type', { label: 'BfArM Report Type', options: CL.BFARM_REPORT_TYPES })
    ));

  return h('div', {}, narrative, companyComment, caseAssessment, medical, regulatory);
}
