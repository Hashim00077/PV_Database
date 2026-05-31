// Application shell: top menu bar, hash routing, and the case worklist.

import { api } from './api.js';
import { h, toast } from './components.js';
import { renderCaseForm } from './caseForm.js';

const view = document.getElementById('view');
const menubar = document.getElementById('menubar');

// ---------------------------------------------------------------------
// Menu definition. `action: 'nav'` items are functional; everything
// flagged `dummy: true` is a non-functional placeholder that mirrors the
// real Argus menu layout.
// ---------------------------------------------------------------------
const MENUS = [
  {
    label: 'File',
    items: [
      { label: 'New', go: '#/case/new' },
      { label: 'Open', go: '#/worklist' },
      { sep: true },
      { label: 'Close', dummy: true },
      { label: 'Save', dummy: true },
      { sep: true },
      { label: 'Print', dummy: true },
      { sep: true },
      { label: 'Exit', dummy: true },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Worklist', go: '#/worklist' },
      { label: 'Case Form', dummy: true },
      { label: 'Bookin', dummy: true },
      { label: 'Letters', dummy: true },
    ],
  },
  {
    label: 'Case Actions',
    items: [
      { label: 'Accept', dummy: true },
      { label: 'Route', dummy: true },
      { sep: true },
      { label: 'Archive', dummy: true },
      { label: 'Unarchive', dummy: true },
      { sep: true },
      { label: 'Medical Review', dummy: true },
      { sep: true },
      { label: 'Lock', dummy: true },
      { label: 'Unlock', dummy: true },
      { sep: true },
      { label: 'Print', dummy: true },
      { label: 'Reopen', dummy: true },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Expedited Reports', dummy: true },
      { label: 'Periodic Reports', dummy: true },
      { label: 'Ad-Hoc Reports', dummy: true },
    ],
  },
  {
    label: 'Utilities',
    items: [
      { label: 'End of Study Unblinding', dummy: true },
      { label: 'Data Lock Point', dummy: true },
      { label: 'Duplicate Search', dummy: true },
    ],
  },
  {
    label: 'Code Lists',
    items: [
      { label: 'MedDRA Browser', dummy: true },
      { label: 'WHO Drug Dictionary', dummy: true },
      { label: 'Routes', dummy: true },
      { label: 'Dosage Forms', dummy: true },
    ],
  },
  {
    label: 'Argus Console',
    items: [
      { label: 'Access Management', dummy: true },
      { label: 'Business Configuration', dummy: true },
      { label: 'System Configuration', dummy: true },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Contents', dummy: true },
      { sep: true },
      { label: 'About', action: 'about' },
    ],
  },
];

// ---------------------------------------------------------------------
// Menu bar rendering
// ---------------------------------------------------------------------
function buildMenubar() {
  menubar.innerHTML = '';
  MENUS.forEach((menu) => {
    const dropdown = h('div', { class: 'menu-dropdown' });
    menu.items.forEach((item) => {
      if (item.sep) {
        dropdown.appendChild(h('div', { class: 'menu-sep' }));
        return;
      }
      const btn = h('button', {
        type: 'button',
        class: item.dummy ? 'disabled' : '',
        onclick: (e) => {
          e.stopPropagation();
          closeAllMenus();
          handleMenuItem(item);
        },
      }, h('span', {}, item.label));
      if (item.dummy) btn.appendChild(h('span', { class: 'dummy-tag' }, 'demo'));
      dropdown.appendChild(btn);
    });

    const top = h('div', { class: 'menu-item' },
      h('button', {
        type: 'button',
        onclick: (e) => { e.stopPropagation(); toggleMenu(top); },
      }, menu.label),
      dropdown);
    menubar.appendChild(top);
  });
}

function toggleMenu(item) {
  const wasOpen = item.classList.contains('open');
  closeAllMenus();
  if (!wasOpen) item.classList.add('open');
}
function closeAllMenus() {
  document.querySelectorAll('.menu-item.open').forEach((m) => m.classList.remove('open'));
}
document.addEventListener('click', closeAllMenus);

function handleMenuItem(item) {
  if (item.go) { location.hash = item.go; return; }
  if (item.action === 'about') { showAbout(); return; }
  if (item.dummy) {
    toast(`"${item.label}" is a demonstration placeholder in this teaching edition.`, 'info');
  }
}

function showAbout() {
  view.innerHTML = '';
  view.appendChild(h('div', { class: 'panel', style: 'padding:22px; max-width:640px; margin:24px auto;' },
    h('h2', { style: 'color:var(--argus-blue); margin-top:0;' }, 'Argus Safety \u2014 Teaching Edition'),
    h('p', {}, 'A self-hosted, open clone of the Oracle Argus Safety Case Form, built for learning and teaching pharmacovigilance case data entry.'),
    h('p', {}, 'The eight Case Form tabs (General, Patient, Products, Events, Analysis, Activities, Additional Info and Regulatory Reports) are fully functional and persist data to a local SQLite database. The remaining menus mirror the real product layout but are non-functional demonstrations.'),
    h('p', { class: 'muted' }, 'This project is not affiliated with or endorsed by Oracle. For educational use only.'),
    h('button', { class: 'btn', onclick: () => { location.hash = '#/worklist'; } }, 'Go to Worklist')
  ));
}

// ---------------------------------------------------------------------
// Worklist view
// ---------------------------------------------------------------------
async function renderWorklist() {
  view.innerHTML = '';
  view.appendChild(h('div', { class: 'loading' }, 'Loading cases\u2026'));

  let cases = [];
  try {
    cases = await api.listCases();
  } catch (err) {
    view.innerHTML = '';
    view.appendChild(h('div', { class: 'panel', style: 'padding:20px;' }, `Error loading cases: ${err.message}`));
    return;
  }

  const search = h('input', { class: 'search-box', type: 'search', placeholder: 'Filter by case #, product, event, initials\u2026' });

  const header = h('div', { class: 'worklist-header' },
    h('div', { class: 'worklist-title' }, 'Case Worklist'),
    h('div', { class: 'worklist-tools' },
      search,
      h('button', { class: 'btn', onclick: () => { location.hash = '#/case/new'; } }, '+ New Case'),
      h('button', { class: 'btn btn-secondary', onclick: renderWorklist }, 'Refresh')
    ));

  const tbody = h('tbody');
  const table = h('table', { class: 'grid' },
    h('thead', {}, h('tr', {},
      h('th', {}, 'Case Number'),
      h('th', {}, 'Initial Receipt'),
      h('th', {}, 'Country'),
      h('th', {}, 'Report Type'),
      h('th', {}, 'Patient'),
      h('th', {}, 'Suspect Product'),
      h('th', {}, 'Primary Event'),
      h('th', {}, 'Serious'),
      h('th', {}, 'Workflow'),
      h('th', {}, 'Last Updated'),
      h('th', {}, '')
    )),
    tbody);

  function paint(rows) {
    tbody.innerHTML = '';
    if (!rows.length) {
      tbody.appendChild(h('tr', { class: 'empty-row' },
        h('td', { colspan: 11 }, 'No cases found. Click "New Case" to create your first case.')));
      return;
    }
    rows.forEach((c) => {
      const open = () => { location.hash = `#/case/${c.id}`; };
      tbody.appendChild(h('tr', { class: 'clickable', onclick: open },
        h('td', {}, h('strong', {}, c.case_number)),
        h('td', {}, c.initial_receipt_date || '\u2014'),
        h('td', {}, c.country_of_incidence || '\u2014'),
        h('td', {}, c.report_type || '\u2014'),
        h('td', {}, c.patient_initials || '\u2014'),
        h('td', {}, c.suspect_product || '\u2014'),
        h('td', {}, c.primary_event || '\u2014'),
        h('td', {}, c.is_serious
          ? h('span', { class: 'badge badge-serious' }, 'Serious')
          : h('span', { class: 'badge badge-nonserious' }, 'Non-serious')),
        h('td', {}, c.workflow_state ? h('span', { class: 'badge badge-state' }, c.workflow_state) : '\u2014'),
        h('td', {}, formatDate(c.updated_at)),
        h('td', {},
          h('button', {
            class: 'icon-btn', title: 'Delete case', type: 'button',
            onclick: async (e) => {
              e.stopPropagation();
              if (!confirm(`Delete case ${c.case_number}? This cannot be undone.`)) return;
              try {
                await api.deleteCase(c.id);
                toast(`Case ${c.case_number} deleted.`, 'success');
                renderWorklist();
              } catch (err) { toast(err.message, 'error'); }
            },
          }, '\u{1F5D1}'))
      ));
    });
  }

  paint(cases);

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    if (!q) { paint(cases); return; }
    paint(cases.filter((c) =>
      [c.case_number, c.suspect_product, c.primary_event, c.patient_initials,
       c.country_of_incidence, c.report_type, c.workflow_state]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))));
  });

  view.innerHTML = '';
  view.appendChild(header);
  view.appendChild(h('div', { class: 'panel', style: 'max-height:70vh; overflow:auto;' }, table));
  view.appendChild(h('div', { class: 'required-note' },
    `${cases.length} case(s). The 8 case-entry tabs are fully functional; other menus are demonstration placeholders.`));
}

function formatDate(iso) {
  if (!iso) return '\u2014';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------
async function route() {
  const hash = location.hash || '#/worklist';
  const parts = hash.replace(/^#\//, '').split('/');

  if (parts[0] === 'worklist' || parts[0] === '') {
    return renderWorklist();
  }
  if (parts[0] === 'case') {
    if (parts[1] === 'new') return renderCaseForm(null, { onSaved: goWorklist, goWorklist });
    const id = Number(parts[1]);
    if (!Number.isNaN(id)) return renderCaseForm(id, { onSaved: goWorklist, goWorklist });
  }
  return renderWorklist();
}

function goWorklist() { location.hash = '#/worklist'; }

window.addEventListener('hashchange', route);

// ---------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------
buildMenubar();
route();
