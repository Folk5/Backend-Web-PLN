const app = require('./app');
const os = require('os');

const PORT = process.env.PORT || 4000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

const localIPs = [];
if (process.env.NODE_ENV !== 'production') {
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        localIPs.push(`http://${net.address}:${FRONTEND_PORT}`);
      }
    }
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend API Server running on port ${PORT}`);
  if (localIPs.length > 0) {
    localIPs.forEach((ip) =>
      console.log(`🌍 Akses jaringan lokal : ${ip.replace(`:${FRONTEND_PORT}`, `:${PORT}`)}`)
    );
  }
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const all = [...new Set([...allowedOrigins, ...localIPs])];
  console.log(`🔒 CORS diizinkan untuk: ${all.join(', ')}`);
});
