/**
 * middleware/validators/toolValidator.js
 * Aturan validasi express-validator untuk endpoint Tool/Peralatan.
 */

const { body } = require('express-validator');

const rules = {
  /** Digunakan pada POST /tools */
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nama peralatan wajib diisi')
      .isLength({ max: 200 })
      .withMessage('Nama peralatan maksimal 200 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Deskripsi maksimal 2000 karakter'),
  ],

  /** Digunakan pada PUT /tools/:id */
  update: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nama peralatan wajib diisi')
      .isLength({ max: 200 })
      .withMessage('Nama peralatan maksimal 200 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Deskripsi maksimal 2000 karakter'),
  ],
};

module.exports = rules;
