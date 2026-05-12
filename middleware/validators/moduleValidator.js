/**
 * middleware/validators/moduleValidator.js
 * Aturan validasi express-validator untuk endpoint Module Konstruksi.
 */

const { body } = require('express-validator');

const rules = {
  /** Digunakan pada POST /modules */
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Judul modul konstruksi wajib diisi')
      .isLength({ max: 200 })
      .withMessage('Judul modul maksimal 200 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Deskripsi maksimal 2000 karakter'),
  ],

  /** Digunakan pada PUT /modules/:id */
  update: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Judul modul konstruksi wajib diisi')
      .isLength({ max: 200 })
      .withMessage('Judul modul maksimal 200 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Deskripsi maksimal 2000 karakter'),
  ],
};

module.exports = rules;
