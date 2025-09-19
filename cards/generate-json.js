// generate-json.js
const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname); // cards folder
const outputFile = path.join(__dirname, 'cards.json');

fs.readdir(cardsDir, (err, files) => {
  if (err) {
    console.error('Error reading cards directory:', err);
    process.exit(1);
  }

  // Filter only .html files
  const htmlFiles = files.filter(file => file.endsWith('.html'));

  // Generate JSON array
  const cardsJson = htmlFiles.map(file => ({
    name: path.basename(file, '.html'),
    file: `cards/${file}`
  }));

  fs.writeFile(outputFile, JSON.stringify(cardsJson, null, 2), (err) => {
    if (err) {
      console.error('Error writing cards.json:', err);
      process.exit(1);
    }
    console.log(`cards.json successfully generated with ${cardsJson.length} entries.`);
  });
});
