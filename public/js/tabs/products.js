// Tab 3: Products — suspect / concomitant drugs with nested dosage regimens.

import { h, section, fieldGrid, inputField, selectField, textareaField, repeatGrid } from '../components.js';
import * as CL from '../codelists.js';

export function renderProductsTab(model) {
  const list = h('div');

  function productCard(product, idx) {
    const head = h('div', { class: 'product-head' },
      h('span', {}, `Product ${idx + 1}${product.drug_type ? '  \u2014  ' + product.drug_type : ''}`),
      h('button', {
        class: 'icon-btn', type: 'button', title: 'Remove product',
        onclick: () => { model.products.splice(idx, 1); renderList(); },
      }, '\u2715'));

    const fields = fieldGrid(
      inputField(product, 'product_name', { label: 'Product / Trade Name', required: true, span: 2 }),
      inputField(product, 'generic_name', { label: 'Generic / Active Ingredient' }),
      inputField(product, 'manufacturer', { label: 'Manufacturer' }),
      selectField(product, 'drug_type', { label: 'Drug Characterization', options: CL.DRUG_TYPES, required: true }),
      inputField(product, 'indication', { label: 'Indication for Use', span: 2 }),
      inputField(product, 'formulation', { label: 'Formulation / Dosage Form' }),
      inputField(product, 'lot_number', { label: 'Lot / Batch Number' }),
      inputField(product, 'expiration_date', { label: 'Expiration Date', type: 'date' }),
      inputField(product, 'first_dose_date', { label: 'First Dose Date', type: 'date' }),
      inputField(product, 'last_dose_date', { label: 'Last Dose Date', type: 'date' }),
      selectField(product, 'action_taken', { label: 'Action Taken with Drug', options: CL.ACTIONS_TAKEN }),
      selectField(product, 'dechallenge', { label: 'Dechallenge', options: CL.CHALLENGE }),
      selectField(product, 'rechallenge', { label: 'Rechallenge', options: CL.CHALLENGE })
    );

    const dosageTitle = h('div', { class: 'subsection-title' }, 'Dosage Regimens');
    const dosages = h('div', { style: 'overflow-x:auto;' },
      repeatGrid({
        array: product.dosages,
        addLabel: 'Add Dosage',
        emptyText: 'No dosage regimens recorded for this product.',
        newRow: () => ({ dose: '', dose_unit: '', route: '', frequency: '', start_date: '', stop_date: '', duration: '', duration_unit: '' }),
        columns: [
          { key: 'dose', label: 'Dose', width: '90px' },
          { key: 'dose_unit', label: 'Unit', type: 'select', options: CL.DOSE_UNITS, width: '110px' },
          { key: 'route', label: 'Route', type: 'select', options: CL.ROUTES, width: '140px' },
          { key: 'frequency', label: 'Frequency', type: 'select', options: CL.FREQUENCIES, width: '170px' },
          { key: 'start_date', label: 'Start Date', type: 'date', width: '140px' },
          { key: 'stop_date', label: 'Stop Date', type: 'date', width: '140px' },
          { key: 'duration', label: 'Duration', width: '80px' },
          { key: 'duration_unit', label: 'Unit', type: 'select', options: CL.DURATION_UNITS, width: '110px' },
        ],
      }));

    const notes = fieldGrid(textareaField(product, 'notes', { label: 'Product Notes', rows: 2 }));

    return h('div', { class: 'product-card' }, head,
      h('div', { class: 'product-body' }, fields, dosageTitle, dosages, notes));
  }

  function renderList() {
    list.innerHTML = '';
    if (!model.products.length) {
      list.appendChild(h('div', { class: 'repeat-empty', style: 'border:1px dashed var(--border); border-radius:3px;' },
        'No products added. Use "Add Product" to record a suspect or concomitant drug.'));
    } else {
      model.products.forEach((p, i) => list.appendChild(productCard(p, i)));
    }
  }

  renderList();

  const addBtn = h('button', {
    class: 'btn', type: 'button',
    onclick: () => {
      model.products.push({ product_name: '', generic_name: '', manufacturer: '', drug_type: 'Suspect', indication: '', formulation: '', lot_number: '', expiration_date: '', dechallenge: '', rechallenge: '', action_taken: '', first_dose_date: '', last_dose_date: '', notes: '', dosages: [] });
      renderList();
    },
  }, '+ Add Product');

  return section('Product Information', h('div', {}, list, h('div', { class: 'add-row-bar' }, addBtn)));
}
