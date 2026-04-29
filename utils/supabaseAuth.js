const supabase = require('../config/supabase');

function isNetworkError(err) {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const code = err.cause?.code || err.code || '';
    return (
        msg.includes('fetch failed') ||
        msg.includes('network') ||
        msg.includes('timeout') ||
        code === 'ECONNRESET' ||
        code === 'ECONNREFUSED' ||
        code === 'ETIMEDOUT' ||
        code === 'UND_ERR_CONNECT_TIMEOUT'
    );
}

async function verifyTokenWithRetry(token, maxRetries = 2) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        let caughtErr = null;
        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error) {
                if (isNetworkError(error)) caughtErr = error;
                else return { user, error };
            } else {
                return { user, error };
            }
        } catch (err) {
            caughtErr = err;
        }

        if (caughtErr) {
            if (isNetworkError(caughtErr) && attempt < maxRetries) {
                console.warn(`[supabaseAuth] Koneksi Supabase gagal (attempt ${attempt}/${maxRetries}), mencoba lagi...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                continue;
            }
            throw caughtErr;
        }
    }
}

module.exports = { isNetworkError, verifyTokenWithRetry };
