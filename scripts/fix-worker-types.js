const fs = require('fs');
const path = require('path');

const locales = ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'pa', 'or', 'as'];

locales.forEach(loc => {
  const filePath = path.join(__dirname, `../frontend/messages/${loc}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.WorkerTypes) {
    data.WorkerTypes = {};
  }

  const existingVal = data.WorkerTypes['HouseKeeper Supervisor'] || 'Housekeeper Supervisor';
  data.WorkerTypes['Housekeeper Supervisor'] = existingVal;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
  console.log(`✓ Added 'Housekeeper Supervisor' to ${loc}.json with value "${existingVal}"`);
});
