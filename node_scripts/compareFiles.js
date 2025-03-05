import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function getFileMD5(filePath) {
  const hash = crypto.createHash('md5');
  const fileData = fs.readFileSync(filePath);
  hash.update(fileData);
  return hash.digest('hex');
}

function compareAll(dir1, dir2) {
  const files1 = fs.readdirSync(dir1).filter(f => f.endsWith('.aac'));
  const files2 = fs.readdirSync(dir2).filter(f => f.endsWith('.aac'));

  const matches = [];

  // Двойной цикл: берем каждый файл из dir1 и сравниваем с каждым из dir2
  for (const fileA of files1) {
    const fullPathA = path.join(dir1, fileA);
    const md5A = getFileMD5(fullPathA);

    for (const fileB of files2) {
      const fullPathB = path.join(dir2, fileB);
      const md5B = getFileMD5(fullPathB);

      if (md5A === md5B) {
        matches.push({ fileA, fileB });
      }
    }
  }

  if (matches.length === 0) {
    console.log('Совпадений не найдено');
  } else {
    console.log('Найдены совпадения (побитово идентичные):');
    matches.forEach(m => {
      console.log(`${m.fileA} (в ${dir1}) == ${m.fileB} (в ${dir2})`);
    });
    console.log(`Всего совпадений: ${matches.length}`);
  }
}

const [,, folder1, folder2] = process.argv;
if (!folder1 || !folder2) {
  console.error('Укажите пути к двум папкам. Пример:\n  node compareAll.js "C:\\Users\\user\\muz\\focus_8" "C:\\Users\\user\\muz\\focus_9"');
  process.exit(1);
}

compareAll(folder1, folder2);
