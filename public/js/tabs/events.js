// Tab 4: Events — adverse events, coding, seriousness criteria, assessment.

import { h, section, fieldGrid, inputField, selectField, textareaField, checkboxField } from '../components.js';
import * as CL from '../codelists.js';

export function renderEventsTab(model) {
  const list = h('div');

  function eventCard(ev, idx) {
    const head = h('div', { class: 'product-head' },
      h('span', {}, `Event ${idx + 1}${ev.pt_term ? '  \u2014  ' + ev.pt_term : ''}`),
      h('button', {
        class: 'icon-btn', type: 'button', title: 'Remove event',
        onclick: () => { model.events.splice(idx, 1); renderList(); },
      }, '\u2715'));

    const description = fieldGrid(
      textareaField(ev, 'description_reported', { label: 'Event Description (as reported / verbatim)', rows: 2, required: true }));

    const coding = fieldGrid(
      inputField(ev, 'pt_term', { label: 'MedDRA Preferred Term (PT)' }),
      inputField(ev, 'llt_term', { label: 'MedDRA Lowest Level Term (LLT)' }),
      inputField(ev, 'soc', { label: 'System Organ Class (SOC)' }),
      inputField(ev, 'onset_date', { label: 'Onset Date', type: 'date' }),
      inputField(ev, 'stop_date', { label: 'Stop / Resolution Date', type: 'date' }),
      inputField(ev, 'duration', { label: 'Duration' }),
      selectField(ev, 'duration_unit', { label: 'Duration Unit', options: CL.DURATION_UNITS }),
      selectField(ev, 'outcome', { label: 'Outcome', options: CL.OUTCOMES }),
      selectField(ev, 'severity', { label: 'Severity', options: CL.SEVERITIES }),
      selectField(ev, 'causality', { label: 'Causality (Reporter)', options: CL.CAUSALITIES })
    );

    const criteriaTitle = h('div', { class: 'subsection-title' }, 'Seriousness Criteria');
    const criteria = h('div', { class: 'criteria-grid' },
      checkboxField(ev, 'is_serious', { label: 'Serious' }),
      checkboxField(ev, 'ser_death', { label: 'Results in Death' }),
      checkboxField(ev, 'ser_life_threatening', { label: 'Life-Threatening' }),
      checkboxField(ev, 'ser_hospitalization', { label: 'Hospitalization / Prolonged' }),
      checkboxField(ev, 'ser_disability', { label: 'Disability / Incapacity' }),
      checkboxField(ev, 'ser_congenital_anomaly', { label: 'Congenital Anomaly / Birth Defect' }),
      checkboxField(ev, 'ser_other_medically_imp', { label: 'Other Medically Important Condition' }));

    return h('div', { class: 'product-card' }, head,
      h('div', { class: 'product-body' }, description, coding, criteriaTitle, criteria));
  }

  function renderList() {
    list.innerHTML = '';
    if (!model.events.length) {
      list.appendChild(h('div', { class: 'repeat-empty', style: 'border:1px dashed var(--border); border-radius:3px;' },
        'No events added. Use "Add Event" to record an adverse event.'));
    } else {
      model.events.forEach((ev, i) => list.appendChild(eventCard(ev, i)));
    }
  }

  renderList();

  const addBtn = h('button', {
    class: 'btn', type: 'button',
    onclick: () => {
      model.events.push({ description_reported: '', pt_term: '', llt_term: '', soc: '', onset_date: '', stop_date: '', duration: '', duration_unit: '', outcome: '', severity: '', causality: '', is_serious: 0, ser_death: 0, ser_life_threatening: 0, ser_hospitalization: 0, ser_disability: 0, ser_congenital_anomaly: 0, ser_other_medically_imp: 0 });
      renderList();
    },
  }, '+ Add Event');

  return section('Adverse Events', h('div', {}, list, h('div', { class: 'add-row-bar' }, addBtn)));
}
