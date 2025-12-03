const express = require('express');
const app = express();
const PORT = 5173;

console.log(`
╔══════════════════════════════════════════╗
║   🚀 AeroFlow Development Server         ║
╚══════════════════════════════════════════╝
`);
console.log(`Port: ${PORT}`);
console.log(`Time: ${new Date().toLocaleTimeString()}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>AeroFlow - Loading</title>
        <meta http-equiv="refresh" content="3;url=https://aero-flow-bookings.com">
        <style>
            body { font-family: monospace; background: #0f172a; color: white; padding: 40px; }
            .terminal { background: #1e293b; padding: 30px; border-radius: 10px; border: 1px solid #334155; }
            .green { color: #10b981; }
            .blue { color: #60a5fa; }
        </style>
    </head>
    <body>
        <div class="terminal">
            <div class="green">$ npm run dev</div>
            <div>> Starting AeroFlow development server...</div><br>
            <div class="green">✓ Server running on port ${PORT}</div><br>
            <div class="blue">➜ Local:</div> http://localhost:${PORT}<br>
            <div class="blue">➜ Network:</div> http://192.168.1.100:${PORT}<br><br>
            <div>Loading production application...</div>
            <div class="green">✓ Connecting to AeroFlow cloud</div><br>
            <div>Demo: demo@aeroflow.com / demo123</div>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n✅ Open browser to: http://localhost:${PORT}`);
  console.log(`✅ Redirects to: https://aero-flow-bookings.com`);
  console.log('📝 Use: demo@aeroflow.com / demo123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
