/**
 * middleware/validators/materialValidator.js
 * Aturan validasi express-validator untuk endpoint Material.
 */

const { body } = require('express-validator');

const rules = {
  /** Digunakan pada POST /materials */
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nama material wajib diisi')
      .isLength({ max: 200 })
      .withMessage('Nama material maksimal 200 karakter'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Kode material wajib diisi')
      .isLength({ max: 50 })
      .withMessage('Kode material maksimal 50 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Deskripsi maksimal 2000 karakter'),
  ],

  /** Digunakan pada PUT /materials/:id */
  update: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nama material wajib diisi')
      .isLength({ max: 200 })
      .withMessage('Nama material maksimal 200 karakter'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Kode material wajib diisi')
      .isLength({ max: 50 })
      .withMessage('Kode material maksimal 50 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Deskripsi maksimal 2000 karakter'),
  ],
};

module.exports = rules;
