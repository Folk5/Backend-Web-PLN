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
            .notEmpty().withMessage('Judul modul konstruksi wajib diisi'),
    ],

    /** Digunakan pada PUT /modules/:id */
    update: [
        body('title')
            .trim()
            .notEmpty().withMessage('Judul modul konstruksi wajib diisi'),
    ],
};

module.exports = rules;
