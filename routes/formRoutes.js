'use strict';
const express = require('express');
const form = require('../controllers/formController');
const router = express.Router();

router.get('/api/v1/form', form.index);
router.post('/api/v1/form', form.store);
router.get('/api/v1/form/:id', form.show);
router.put('/api/v1/form/:id', form.update);
router.delete('/api/v1/form/:id', form.destroy);

module.exports = router;
