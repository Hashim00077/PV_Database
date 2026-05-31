'use strict';

/**
 * REST API routes for cases.
 *
 *   GET    /api/cases          list (summary rows for the worklist)
 *   POST   /api/cases          create a new case
 *   GET    /api/cases/:id      fetch a full nested case
 *   PUT    /api/cases/:id      replace a case (all tabs + child rows)
 *   DELETE /api/cases/:id      delete a case
 *   GET    /api/next-case-number   preview the next auto case number
 */

const express = require('express');
const repo = require('./repository');

const router = express.Router();

router.get('/cases', (req, res) => {
  res.json(repo.listCases());
});

router.get('/next-case-number', (req, res) => {
  res.json({ case_number: repo.nextCaseNumber() });
});

router.post('/cases', (req, res) => {
  try {
    const created = repo.createCase(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error('Create case failed:', err);
    res.status(400).json({ error: err.message });
  }
});

router.get('/cases/:id', (req, res) => {
  const found = repo.getCase(Number(req.params.id));
  if (!found) return res.status(404).json({ error: 'Case not found' });
  res.json(found);
});

router.put('/cases/:id', (req, res) => {
  try {
    const updated = repo.updateCase(Number(req.params.id), req.body || {});
    if (!updated) return res.status(404).json({ error: 'Case not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update case failed:', err);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/cases/:id', (req, res) => {
  const ok = repo.deleteCase(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: 'Case not found' });
  res.status(204).end();
});

module.exports = router;
