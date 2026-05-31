// Tab 2: Patient -- demographics, medical history, lab data, parent info.

import { h, section, fieldGrid, inputField, selectField, textareaField, checkboxField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderPatientTab(model) {
  const demographics = section('Patient Information',
    fieldGrid(
      inputField(model, 'patient_last_name', { label: 'Last Name' }),
      inputField(model, 'patient_first_name', { label: 'First Name' }),
      inputField(model, 'patient_mi', { label: 'MI' }),
      inputField(model, 'patient_id', { label: 'Patient ID' }),
      inputField(model, 'patient_dob', { label: 'Date of Birth', type: 'date' }),
      inputField(model, 'patient_age', { label: 'Age', type: 'number' }),
      selectField(model, 'patient_age_unit', { label: 'Age Unit', options: CL.AGE_UNITS }),
      selectField(model, 'patient_age_group', { label: 'Age Group', options: CL.AGE_GROUPS }),
      selectField(model, 'patient_gender', { label: 'Gender', options: CL.GENDERS }),
      inputField(model, 'patient_ethnicity', { label: 'Ethnicity' }),
      inputField(model, 'patient_weight', { label: 'Weight', type: 'number' }),
      selectField(model, 'patient_weight_unit', { label: 'Weight Unit', options: CL.WEIGHT_UNITS }),
      inputField(model, 'patient_height', { label: 'Height', type: 'number' }),
      selectField(model, 'patient_height_unit', { label: 'Height Unit', options: CL.HEIGHT_UNITS })
    ));

  const medHistory = section('Relevant Medical History',
    repeatGrid({
      array: model.medical_history,
      addLabel: 'Add Condition',
      emptyText: 'No medical history recorded.',
      newRow: () => ({ condition: '', start_date: '', end_date: '', continuing: 0, notes: '', cause_of_death: '' }),
      columns: [
        { key: 'condition', label: 'Condition/Procedure', width: '220px' },
        { key: 'start_date', label: 'Start Date', type: 'date', width: '120px' },
        { key: 'end_date', label: 'Stop Date', type: 'date', width: '120px' },
        { key: 'continuing', label: 'Continuing?', type: 'checkbox', width: '70px' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
        { key: 'cause_of_death', label: 'Reported Cause of Death', width: '160px' },
      ],
    }));

  const labData = section('Lab Data',
    h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: model.lab_data,
        addLabel: 'Add Lab Result',
        emptyText: 'No laboratory data recorded.',
        newRow: () => ({ test_name: '', test_date: '', result: '', units: '', normal_low: '', normal_high: '', assessment: '' }),
        columns: [
          { key: 'test_name', label: 'Test Name', width: '180px' },
          { key: 'test_date', label: 'Date', type: 'date', width: '120px' },
          { key: 'result', label: 'Result', width: '100px' },
          { key: 'units', label: 'Units', width: '80px' },
          { key: 'normal_low', label: 'Normal Low', width: '90px' },
          { key: 'normal_high', label: 'Normal High', width: '90px' },
          { key: 'assessment', label: 'Assessment', type: 'select', options: ['', 'Normal', 'Abnormal', 'High', 'Low', 'Borderline'], width: '110px' },
        ],
      })));

  const otherHistory = section('Other Relevant History',
    fieldGrid(textareaField(model, 'patient_notes', { label: 'Other Relevant History', rows: 4 })));

  const parent = section('Parent Information',
    fieldGrid(
      inputField(model, 'parent_initials', { label: 'Parent Initials' }),
      inputField(model, 'parent_dob', { label: 'DOB', type: 'date' }),
      inputField(model, 'parent_age', { label: 'Age', type: 'number' }),
      inputField(model, 'parent_weight', { label: 'Weight', type: 'number' }),
      inputField(model, 'parent_height', { label: 'Height', type: 'number' }),
      selectField(model, 'parent_gender', { label: 'Gender', options: CL.GENDERS }),
      inputField(model, 'parent_lmp_date', { label: 'LMP Date', type: 'date' })
    ));

  return h('div', {}, demographics, medHistory, labData, otherHistory, parent);
}
