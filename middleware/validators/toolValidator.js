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
            .notEmpty().withMessage('Nama peralatan wajib diisi'),
    ],

    /** Digunakan pada PUT /tools/:id */
    update: [
        body('name')
            .trim()
            .notEmpty().withMessage('Nama peralatan wajib diisi'),
    ],
};

module.exports = rules;
