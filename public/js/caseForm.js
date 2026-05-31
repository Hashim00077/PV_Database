// Case Form: the 8-tab data-entry surface. Loads an existing case (or starts
// a blank one), renders the active tab, and saves the whole model at once.

import { api } from './api.js';
import { h, toast } from './components.js';
import { renderGeneralTab } from './tabs/general.js';
import { renderPatientTab } from './tabs/patient.js';
import { renderProductsTab } from './tabs/products.js';
import { renderEventsTab } from './tabs/events.js';
import { renderAnalysisTab } from './tabs/analysis.js';
import { renderActivitiesTab } from './tabs/activities.js';
import { renderAdditionalInfoTab } from './tabs/additionalInfo.js';
import { renderRegulatoryTab } from './tabs/regulatory.js';

const TABS = [
  { id: 'general', label: 'General', render: renderGeneralTab },
  { id: 'patient', label: 'Patient', render: renderPatientTab },
  { id: 'products', label: 'Products', render: renderProductsTab },
  { id: 'events', label: 'Events', render: renderEventsTab },
  { id: 'analysis', label: 'Analysis', render: renderAnalysisTab },
  { id: 'activities', label: 'Activities', render: renderActivitiesTab },
  { id: 'additional', label: 'Additional Info', render: renderAdditionalInfoTab },
  { id: 'regulatory', label: 'Regulatory Reports', render: renderRegulatoryTab },
];

// A fresh, fully-shaped case model so every tab can bind safely.
function emptyCase() {
  return {
    id: null,
    case_number: '',
    // General
    initial_receipt_date: '', central_receipt_date: '', report_type: '',
    case_classification: '', country_of_incidence: '', awareness_date: '',
    study_id: '', study_name: '', study_type: '', center_id: '', center_name: '',
    literature_reference: '', literature_title: '', literature_author: '',
    literature_journal: '', general_comment: '',
    // Patient
    patient_initials: '', patient_id: '', patient_dob: '', patient_age: '',
    patient_age_unit: '', patient_age_group: '', patient_gender: '',
    patient_weight: '', patient_weight_unit: '', patient_height: '',
    patient_height_unit: '', patient_race: '', patient_ethnicity: '',
    patient_pregnant: 0, patient_gestation_period: '', patient_notes: '',
    parent_initials: '', parent_dob: '', parent_age: '', parent_gender: '',
    parent_weight: '', parent_height: '', parent_lmp_date: '',
    // Analysis
    narrative: '', company_comment: '', medical_assessment: '',
    causality_assessment: '', medwatch_seriousness: '', bfarm_report_type: '',
    analysis_notes: '',
    // Activities (singleton)
    workflow_state: '', assigned_user: '', assigned_group: '',
    case_priority: '', date_locked: '', date_closed: '',
    // Additional Info
    case_keywords: '',
    // Child collections
    reporters: [], medical_history: [], lab_data: [], products: [],
    events: [], action_items: [], contact_log: [], case_notes: [],
    case_references: [], regulatory_reports: [],
  };
}

export async function renderCaseForm(id, opts) {
  const view = document.getElementById('view');
  view.innerHTML = '';
  view.appendChild(h('div', { class: 'loading' }, 'Loading case\u2026'));

  let model;
  let isNew = id == null;
  if (isNew) {
    model = emptyCase();
  } else {
    try {
      const loaded = await api.getCase(id);
      model = { ...emptyCase(), ...loaded };
      // Ensure arrays exist even if backend returned nothing.
      for (const k of ['reporters', 'medical_history', 'lab_data', 'products',
        'events', 'action_items', 'contact_log', 'case_notes',
        'case_references', 'regulatory_reports']) {
        if (!Array.isArray(model[k])) model[k] = [];
      }
      model.products.forEach((p) => { if (!Array.isArray(p.dosages)) p.dosages = []; });
    } catch (err) {
      view.innerHTML = '';
      view.appendChild(h('div', { class: 'panel', style: 'padding:20px;' },
        `Could not load case: ${err.message}`,
        h('div', { style: 'margin-top:12px;' },
          h('button', { class: 'btn btn-secondary', onclick: opts.goWorklist }, 'Back to Worklist'))));
      return;
    }
  }

  let activeTab = 'general';

  // ---- Toolbar -------------------------------------------------------
  const caseNoEl = h('span', { class: 'case-no' }, model.case_number || 'New Case (unsaved)');
  const statusEl = h('span', { class: 'case-status-badge' }, model.workflow_state || (isNew ? 'New' : 'Open'));
  function refreshStatus() {
    statusEl.textContent = model.workflow_state || (isNew ? 'New' : 'Open');
  }

  const metaEl = h('span', { class: 'case-meta' });
  function refreshMeta() {
    metaEl.textContent = isNew
      ? 'Not yet saved \u2014 a case number will be assigned on save'
      : `Case ID ${model.id}  \u2022  ${model.events.length} event(s)  \u2022  ${model.products.length} product(s)`;
  }
  refreshMeta();

  const saveBtn = h('button', { class: 'btn toolbar-btn', onclick: () => save(false), title: 'Save' }, 'Save');
  const saveCloseBtn = h('button', { class: 'btn toolbar-btn', onclick: () => save(true), title: 'Save & Close' }, 'Save & Close');
  const closeBtn = h('button', { class: 'btn btn-secondary toolbar-btn', onclick: opts.goWorklist, title: 'Close' }, 'Close');

  function dummyAction(label) {
    return h('button', {
      class: 'btn toolbar-btn',
      title: label,
      onclick: () => toast(`"${label}" is a demonstration placeholder in this teaching edition.`, 'info'),
    }, label);
  }

  const acceptBtn = dummyAction('Accept');
  const routeBtn = dummyAction('Route');
  const medReviewBtn = dummyAction('Medical Review');
  const lockBtn = dummyAction('Lock');
  const unlockBtn = dummyAction('Unlock');

  const deleteBtn = h('button', {
    class: 'btn btn-danger toolbar-btn',
    title: 'Delete',
    onclick: async () => {
      if (isNew) return;
      if (!confirm(`Delete case ${model.case_number}? This cannot be undone.`)) return;
      try {
        await api.deleteCase(model.id);
        toast(`Case ${model.case_number} deleted.`, 'success');
        opts.goWorklist();
      } catch (err) { toast(err.message, 'error'); }
    },
  }, 'Delete');

  const toolbarLeft = h('div', { class: 'case-id-block' },
    caseNoEl,
    statusEl,
    metaEl);

  const toolbarActions = h('div', { class: 'case-toolbar-actions' },
    saveBtn, saveCloseBtn, closeBtn,
    h('span', { class: 'toolbar-separator' }),
    acceptBtn, routeBtn, medReviewBtn, lockBtn, unlockBtn);
  if (!isNew) {
    toolbarActions.appendChild(h('span', { class: 'toolbar-separator' }));
    toolbarActions.appendChild(deleteBtn);
  }

  const toolbar = h('div', { class: 'case-toolbar' }, toolbarLeft, toolbarActions);

  // ---- Tab strip -----------------------------------------------------
  const tabBody = h('div', { class: 'tab-body' });
  const tabStrip = h('div', { class: 'tab-strip' });

  function renderTabButtons() {
    tabStrip.innerHTML = '';
    TABS.forEach((tab, i) => {
      tabStrip.appendChild(h('button', {
        class: `tab-btn ${tab.id === activeTab ? 'active' : ''}`,
        type: 'button',
        onclick: () => { activeTab = tab.id; renderTabButtons(); renderActiveTab(); },
      }, h('span', { class: 'tab-num' }, i + 1), tab.label));
    });
  }

  function renderActiveTab() {
    const tab = TABS.find((t) => t.id === activeTab);
    tabBody.innerHTML = '';
    tabBody.appendChild(tab.render(model));
    refreshMeta();
    refreshStatus();
  }

  // ---- Save ----------------------------------------------------------
  async function save(thenClose) {
    saveBtn.disabled = true; saveCloseBtn.disabled = true;
    try {
      if (isNew) {
        const created = await api.createCase(model);
        toast(`Case ${created.case_number} created.`, 'success');
        if (thenClose) { opts.goWorklist(); return; }
        location.hash = `#/case/${created.id}`; // reload as existing case
      } else {
        const updated = await api.updateCase(model.id, model);
        model = { ...emptyCase(), ...updated };
        model.products.forEach((p) => { if (!Array.isArray(p.dosages)) p.dosages = []; });
        toast(`Case ${updated.case_number} saved.`, 'success');
        if (thenClose) { opts.goWorklist(); return; }
        renderActiveTab();
      }
    } catch (err) {
      toast(`Save failed: ${err.message}`, 'error');
    } finally {
      saveBtn.disabled = false; saveCloseBtn.disabled = false;
    }
  }

  // ---- Mount ---------------------------------------------------------
  const breadcrumb = h('div', { class: 'breadcrumb' },
    h('a', { onclick: opts.goWorklist }, 'Worklist'),
    ' / ',
    isNew ? 'New Case' : model.case_number);

  view.innerHTML = '';
  view.appendChild(breadcrumb);
  view.appendChild(toolbar);
  view.appendChild(tabStrip);
  view.appendChild(tabBody);

  renderTabButtons();
  renderActiveTab();
}
