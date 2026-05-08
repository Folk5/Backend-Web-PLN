/**
 * middleware/validateRequest.js
 * Middleware generik yang mengecek hasil validasi dari express-validator.
 * Dijalankan SETELAH validator chains di route, SEBELUM controller.
 */

const { validationResult } = require('express-validator');

/**
 * Jika ada error validasi → kembalikan 400 dengan daftar error.
 * Jika bersih → teruskan ke next() (controller).
 */
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validasi input gagal',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};
