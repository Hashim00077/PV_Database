// Tab 2: Patient — demographics, pregnancy, medical history, lab data, parent.

import { h, section, fieldGrid, inputField, selectField, textareaField, checkboxField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderPatientTab(model) {
  const demographics = section('Patient Information',
    fieldGrid(
      inputField(model, 'patient_initials', { label: 'Patient Initials' }),
      inputField(model, 'patient_id', { label: 'Patient ID / Number' }),
      inputField(model, 'patient_dob', { label: 'Date of Birth', type: 'date' }),
      inputField(model, 'patient_age', { label: 'Age', type: 'number' }),
      selectField(model, 'patient_age_unit', { label: 'Age Unit', options: CL.AGE_UNITS }),
      selectField(model, 'patient_age_group', { label: 'Age Group', options: CL.AGE_GROUPS }),
      selectField(model, 'patient_gender', { label: 'Gender / Sex', options: CL.GENDERS }),
      inputField(model, 'patient_weight', { label: 'Weight', type: 'number' }),
      selectField(model, 'patient_weight_unit', { label: 'Weight Unit', options: CL.WEIGHT_UNITS }),
      inputField(model, 'patient_height', { label: 'Height', type: 'number' }),
      selectField(model, 'patient_height_unit', { label: 'Height Unit', options: CL.HEIGHT_UNITS }),
      selectField(model, 'patient_race', { label: 'Race', options: CL.RACES }),
      inputField(model, 'patient_ethnicity', { label: 'Ethnicity' })
    ));

  const pregnancy = section('Pregnancy Information',
    fieldGrid(
      checkboxField(model, 'patient_pregnant', { label: 'Patient is / was pregnant' }),
      inputField(model, 'patient_gestation_period', { label: 'Gestation Period at Exposure' })
    ));

  const medHistory = section('Relevant Medical History & Concurrent Conditions',
    repeatGrid({
      array: model.medical_history,
      addLabel: 'Add Condition',
      emptyText: 'No medical history recorded.',
      newRow: () => ({ condition: '', start_date: '', continuing: 0, end_date: '', notes: '' }),
      columns: [
        { key: 'condition', label: 'Condition / Disease', width: '240px' },
        { key: 'start_date', label: 'Start Date', type: 'date', width: '140px' },
        { key: 'continuing', label: 'Continuing?', type: 'checkbox', width: '80px' },
        { key: 'end_date', label: 'End Date', type: 'date', width: '140px' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ],
    }));

  const labData = section('Relevant Test & Laboratory Data',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.lab_data,
        addLabel: 'Add Lab Result',
        emptyText: 'No laboratory data recorded.',
        newRow: () => ({ test_name: '', test_date: '', result: '', units: '', normal_low: '', normal_high: '', assessment: '' }),
        columns: [
          { key: 'test_name', label: 'Test Name', width: '200px' },
          { key: 'test_date', label: 'Date', type: 'date', width: '140px' },
          { key: 'result', label: 'Result', width: '110px' },
          { key: 'units', label: 'Units', width: '90px' },
          { key: 'normal_low', label: 'Normal Low', width: '100px' },
          { key: 'normal_high', label: 'Normal High', width: '100px' },
          { key: 'assessment', label: 'Assessment', type: 'select', options: ['', 'Normal', 'Abnormal', 'High', 'Low', 'Borderline'], width: '120px' },
        ],
      })));

  const parent = section('Parent Information (for Parent-Child / Foetus cases)',
    fieldGrid(
      inputField(model, 'parent_initials', { label: 'Parent Initials' }),
      inputField(model, 'parent_dob', { label: 'Parent Date of Birth', type: 'date' }),
      inputField(model, 'parent_age', { label: 'Parent Age', type: 'number' }),
      selectField(model, 'parent_gender', { label: 'Parent Gender', options: CL.GENDERS }),
      inputField(model, 'parent_weight', { label: 'Parent Weight', type: 'number' }),
      inputField(model, 'parent_height', { label: 'Parent Height', type: 'number' }),
      inputField(model, 'parent_lmp_date', { label: 'Last Menstrual Period', type: 'date' })
    ));

  const notes = section('Patient Notes',
    fieldGrid(textareaField(model, 'patient_notes', { label: 'Additional patient details', rows: 3 })));

  return h('div', {}, demographics, pregnancy, medHistory, labData, parent, notes);
}
