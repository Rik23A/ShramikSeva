const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../frontend/lib/worker-data.ts'), 'utf8');
const lines = content.split('\n');
const fileKeys = [];
for (const line of lines) {
  const m = line.match(/^\s*"([^"]+)":\s*\[/);
  if (m) fileKeys.push(m[1]);
}

const locales = ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'pa', 'or', 'as'];
locales.forEach(loc => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, `../frontend/messages/${loc}.json`), 'utf8'));
  const wt = data.WorkerTypes || {};
  const missing = fileKeys.filter(k => !wt[k]);
  console.log(`${loc}: missing keys ->`, missing);
});
