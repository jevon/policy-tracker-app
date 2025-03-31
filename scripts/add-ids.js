import fs from 'fs';
import path from 'path';

// Read the promise files
const carneyPromises = JSON.parse(fs.readFileSync(path.resolve('src/data/carneyPromises.json'), 'utf8'));
const poilievrePromises = JSON.parse(fs.readFileSync(path.resolve('src/data/poilievrePromises.json'), 'utf8'));

// Add IDs to Carney promises
carneyPromises.forEach((promise, index) => {
  promise.id = `carney-${index + 1}`;
});

// Add IDs to Poilievre promises
poilievrePromises.forEach((promise, index) => {
  promise.id = `poilievre-${index + 1}`;
});

// Write the updated files back
fs.writeFileSync(
  path.resolve('src/data/carneyPromises.json'),
  JSON.stringify(carneyPromises, null, 2)
);

fs.writeFileSync(
  path.resolve('src/data/poilievrePromises.json'),
  JSON.stringify(poilievrePromises, null, 2)
);

console.log('Successfully added IDs to all promises'); 