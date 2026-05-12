/**
 * middleware/validators/authValidator.js
 * Aturan validasi express-validator untuk endpoint Auth (register, login).
 */

const { body } = require('express-validator');

const rules = {
  /** Digunakan pada POST /auth/register */
  register: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email wajib diisi')
      .isEmail()
      .withMessage('Format email tidak valid'),
    body('password')
      .notEmpty()
      .withMessage('Password wajib diisi')
      .isLength({ min: 8 })
      .withMessage('Password minimal 8 karakter')
      .isLength({ max: 128 })
      .withMessage('Password maksimal 128 karakter'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Nama maksimal 100 karakter'),
  ],

  /** Digunakan pada POST /auth/login */
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email wajib diisi')
      .isEmail()
      .withMessage('Format email tidak valid'),
    body('password').notEmpty().withMessage('Password wajib diisi'),
  ],
};

module.exports = rules;
