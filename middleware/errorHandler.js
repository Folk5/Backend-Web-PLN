const isDev = process.env.NODE_ENV !== 'production';

const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}: ${err.message}`);
    if (isDev && err.stack) console.error(err.stack);

    res.status(status).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            ...(isDev && { stack: err.stack }),
        },
    });
};

module.exports = errorHandler;
