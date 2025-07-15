import { readdir, stat, writeFile } from 'fs/promises';
import { resolve, basename } from 'path';

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build'];
const OUTPUT_FILE = 'folder-structure.txt';

/**
 * Рекурсивно строит дерево папок.
 * @param {string} dir - Абсолютный путь к директории.
 * @param {string} prefix - Отступы для визуализации.
 * @returns {Promise<string>}
 */
async function buildTree(dir, prefix = '') {
  const items = await readdir(dir, { withFileTypes: true });

  const folders = items.filter(item =>
    item.isDirectory() && !IGNORE_DIRS.includes(item.name),
  );

  let tree = '';

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const isLast = i === folders.length - 1;
    const line = `${ prefix }${ isLast ? '└── ' : '├── ' }${ folder.name }\n`;
    tree += line;

    const subTree = await buildTree(resolve(dir, folder.name), prefix + (isLast ? '    ' : '│   '));
    tree += subTree;
  }

  return tree;
}

const startPath = process.argv[2] || process.cwd();

console.log(`🔍 Строим дерево папок от: ${ startPath }`);
buildTree(startPath)
  .then(tree => {
    const rootName = basename(startPath);
    const output = `${ rootName }/\n${ tree }`;
    return writeFile(OUTPUT_FILE, output, 'utf8');
  })
  .then(() => console.log(`✅ Структура сохранена в ${ OUTPUT_FILE }`))
  .catch(console.error);
