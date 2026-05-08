/**
 * middleware/validators/materialValidator.js
 * Aturan validasi express-validator untuk endpoint Material.
 */

const { body } = require('express-validator');

const rules = {
  /** Digunakan pada POST /materials */
  create: [
    body('name').trim().notEmpty().withMessage('Nama material wajib diisi'),
    body('code').trim().notEmpty().withMessage('Kode material wajib diisi'),
  ],

  /** Digunakan pada PUT /materials/:id */
  update: [
    body('name').trim().notEmpty().withMessage('Nama material wajib diisi'),
    body('code').trim().notEmpty().withMessage('Kode material wajib diisi'),
  ],
};

module.exports = rules;
