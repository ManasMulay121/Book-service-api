import fs from 'fs';

export function readJSON(path: string) {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

export function writeJSON(path: string, data: any) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}