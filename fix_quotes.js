import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src/components/ui');
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('\\"')) {
      content = content.replace(/\\"/g, '"');
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
    }
  }
});

console.log(`Fixed ${count} files.`);
process.exit(0);
