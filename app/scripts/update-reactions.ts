import fs from 'fs';
import path from 'path';

const filePath = './src/lib/data/reactions.json';
async function main() {
  try {
    const raw = fs.readFileSync(path, 'utf-8')

    //TODO: update

    fs.writeFileSync(filePath, raw);
  } catch (error) {
    fs.writeFileSync(filePath, {});
  }



  console.log('done');
}

main();
