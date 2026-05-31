// Reusable UI helpers: a tiny DOM builder, data-bound form fields, and a
// repeating-row grid for the one-to-many sections of the case form.
//
// All field helpers bind directly to a plain JS "model" object: reading the
// initial value from model[key] and writing edits back to it. Because objects
// are passed by reference, editing nested rows mutates the working case in
// place, so saving just serializes the model.

// ---------------------------------------------------------------------
// DOM builder
// ---------------------------------------------------------------------
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style') el.setAttribute('style', v);
    else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  appendChildren(el, children);
  return el;
}

function appendChildren(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.appendChild(
      child instanceof Node ? child : document.createTextNode(String(child))
    );
  }
}

let uid = 0;
const nextId = () => `f${++uid}`;

// ---------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------
function wrapField(id, opts, control) {
  const classes = ['field'];
  if (opts.span === 2) classes.push('col-span-2');
  if (opts.span === 'full') classes.push('col-span-full');
  const label = h('label', { for: id }, opts.label || '');
  if (opts.required) label.appendChild(h('span', { class: 'req' }, '*'));
  const parts = [label, control];
  if (opts.hint) parts.push(h('div', { class: 'inline-hint' }, opts.hint));
  return h('div', { class: classes.join(' ') }, ...parts);
}

// ---------------------------------------------------------------------
// Bound fields
// ---------------------------------------------------------------------
export function inputField(model, key, opts = {}) {
  const id = nextId();
  const input = h('input', {
    id,
    type: opts.type || 'text',
    placeholder: opts.placeholder || '',
  });
  input.value = model[key] ?? '';
  if (opts.readonly) {
    input.readOnly = true;
    input.classList.add('readonly');
  }
  input.addEventListener('input', () => { model[key] = input.value; });
  return wrapField(id, opts, input);
}

export function selectField(model, key, opts = {}) {
  const id = nextId();
  const select = h('select', { id });
  for (const o of opts.options || []) {
    const value = typeof o === 'object' ? o.value : o;
    const text =
      typeof o === 'object' ? o.label : value === '' ? '-- Select --' : value;
    select.appendChild(h('option', { value }, text));
  }
  select.value = model[key] ?? '';
  select.addEventListener('change', () => { model[key] = select.value; });
  return wrapField(id, opts, select);
}

export function textareaField(model, key, opts = {}) {
  const id = nextId();
  const ta = h('textarea', { id, rows: opts.rows || 4, placeholder: opts.placeholder || '' });
  ta.value = model[key] ?? '';
  ta.addEventListener('input', () => { model[key] = ta.value; });
  const fld = wrapField(id, { ...opts, span: opts.span || 'full' }, ta);
  return fld;
}

export function checkboxField(model, key, opts = {}) {
  const id = nextId();
  const input = h('input', { id, type: 'checkbox' });
  input.checked = !!model[key];
  input.addEventListener('change', () => { model[key] = input.checked ? 1 : 0; });
  return h('div', { class: 'field checkbox-field' }, input, h('label', { for: id }, opts.label || ''));
}

// ---------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------
export function section(title, content, actions) {
  const head = h('div', { class: 'section-head' }, h('span', {}, title));
  if (actions) head.appendChild(actions);
  return h('div', { class: 'section' }, head, h('div', { class: 'section-body' }, content));
}

export function fieldGrid(...fields) {
  return h('div', { class: 'field-grid' }, ...fields.flat(Infinity));
}

// ---------------------------------------------------------------------
// Repeating-row grid for one-to-many sections
//   opts = { array, columns, newRow, addLabel, emptyText, onChange }
//   columns = [{ key, label, type, options, width, placeholder, rows }]
// ---------------------------------------------------------------------
export function repeatGrid(opts) {
  const columns = opts.columns;
  const table = h('table', { class: 'repeat-grid' });
  const headRow = h('tr');
  for (const col of columns) {
    headRow.appendChild(h('th', col.width ? { style: `width:${col.width}` } : {}, col.label));
  }
  headRow.appendChild(h('th', { class: 'row-actions' }, ''));
  const tbody = h('tbody');
  table.appendChild(h('thead', {}, headRow));
  table.appendChild(tbody);

  function cellControl(row, col) {
    if (col.type === 'select') {
      const select = h('select');
      for (const o of col.options || []) {
        const value = typeof o === 'object' ? o.value : o;
        const text =
          typeof o === 'object' ? o.label : value === '' ? '--' : value;
        select.appendChild(h('option', { value }, text));
      }
      select.value = row[col.key] ?? '';
      select.addEventListener('change', () => { row[col.key] = select.value; });
      return select;
    }
    if (col.type === 'checkbox') {
      const input = h('input', { type: 'checkbox' });
      input.checked = !!row[col.key];
      input.addEventListener('change', () => { row[col.key] = input.checked ? 1 : 0; });
      return input;
    }
    if (col.type === 'textarea') {
      const ta = h('textarea', { rows: col.rows || 2 });
      ta.value = row[col.key] ?? '';
      ta.addEventListener('input', () => { row[col.key] = ta.value; });
      return ta;
    }
    const input = h('input', { type: col.type || 'text', placeholder: col.placeholder || '' });
    input.value = row[col.key] ?? '';
    input.addEventListener('input', () => { row[col.key] = input.value; });
    return input;
  }

  function renderBody() {
    tbody.innerHTML = '';
    if (!opts.array.length) {
      tbody.appendChild(
        h('tr', {}, h('td', { colspan: columns.length + 1, class: 'repeat-empty' },
          opts.emptyText || 'No entries. Use the button below to add one.'))
      );
      return;
    }
    opts.array.forEach((row, idx) => {
      const tr = h('tr');
      for (const col of columns) {
        tr.appendChild(h('td', {}, cellControl(row, col)));
      }
      tr.appendChild(
        h('td', { class: 'row-actions' },
          h('button', {
            class: 'icon-btn', type: 'button', title: 'Remove row',
            onclick: () => { opts.array.splice(idx, 1); renderBody(); if (opts.onChange) opts.onChange(); },
          }, '\u2715'))
      );
      tbody.appendChild(tr);
    });
  }

  renderBody();

  const addBtn = h('button', {
    class: 'btn btn-secondary btn-sm', type: 'button',
    onclick: () => {
      opts.array.push(opts.newRow ? opts.newRow() : {});
      renderBody();
      if (opts.onChange) opts.onChange();
    },
  }, `+ ${opts.addLabel || 'Add Row'}`);

  return h('div', {}, table, h('div', { class: 'add-row-bar' }, addBtn));
}

// ---------------------------------------------------------------------
// Toast notifications
// ---------------------------------------------------------------------
let toastTimer = null;
export function toast(message, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast'; }, 3200);
}
