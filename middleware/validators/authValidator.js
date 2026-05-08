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
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 karakter'),
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
