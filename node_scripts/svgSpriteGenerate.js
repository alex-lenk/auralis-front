import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, '../public/assets/img/icons');
const DEFAULT_OUTPUT_FILENAME = 'sprite.svg';
const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, '../src/assets/img');
const ICON_NAMES_OUTPUT_PATH = path.resolve(__dirname, '../src/shared/ui/Sprite/iconsList.ts');
const compressFile = false;

const outputPath = process.argv[2] || DEFAULT_OUTPUT_DIR;
const outputFilename = process.argv[3] || DEFAULT_OUTPUT_FILENAME;

/**
 * Преобразует строку из kebab-case в camelCase.
 *
 * @param {string} str - Строка в формате kebab-case.
 * @returns {string} - Строка, преобразованная в camelCase.
 */
function toCamelCase(str) {
  return str
    .split('-')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Обрабатывает SVG файл, извлекая его содержимое и создавая элемент символа для спрайта.
 *
 * @param {string} filePath - Путь к SVG файлу.
 * @returns {Object|null} - Объект с символом и идентификатором, либо null, если файл не является корректным SVG.
 */
function processSVG(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const svgTagMatch = content.match(/<svg\s+.*?>[\s\S]*<\/svg>/);
  if (!svgTagMatch) return null;

  const svgContent = svgTagMatch[0];
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';

  const id = path.basename(filePath, '.svg');

  return {
    symbol: `<symbol id="${id}" viewBox="${viewBox}">${svgContent.replace(/<svg.*?>|<\/svg>/g, '')}</symbol>`,
    id: id,
  };
}

/**
 * Создает SVG спрайт из всех SVG файлов в указанной директории и генерирует TypeScript файл с перечислением (enum).
 */
function createSVGSprite() {
  let symbols = '';
  let iconNames = [];

  const files = fs.readdirSync(SOURCE_DIR);

  files.forEach(file => {
    if (path.extname(file) === '.svg') {
      const result = processSVG(path.join(SOURCE_DIR, file));
      if (result) {
        symbols += result.symbol;
        iconNames.push(result.id);
      }
    }
  });

  // Создание спрайта
  const svgSpriteContent = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
${symbols}
</svg>`;

  const content = svgSpriteContent.replace(/\s+/g, ' ');

  fs.writeFileSync(path.join(outputPath, outputFilename), compressFile ? content : svgSpriteContent);
  console.log(`SVG Sprite created at ${path.join(outputPath, outputFilename)}`);

  // Создание TypeScript файла с перечислением (enum)
  const iconsEnumContent = `export enum Icons {
${iconNames.map(name => `  ${toCamelCase(name)} = '${name}'`).join(',\n')}
}

export type IconName = (typeof Icons)[keyof typeof Icons];
`;

  fs.writeFileSync(ICON_NAMES_OUTPUT_PATH, iconsEnumContent);
  console.log(`Icons enum created at ${ICON_NAMES_OUTPUT_PATH}`);
}

createSVGSprite();
