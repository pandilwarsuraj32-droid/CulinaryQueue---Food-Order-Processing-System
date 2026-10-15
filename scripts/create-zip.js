import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addDirectoryToZip(dirPath, zipFolder) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (item === 'node_modules' || item === 'dist' || item === '.git' || item.endsWith('.zip')) {
      continue;
    }
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(item);
      addDirectoryToZip(fullPath, subFolder);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

async function buildZip() {
  const rootDir = process.cwd();
  console.log('Packaging project from:', rootDir);

  const filesToAdd = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'metadata.json',
    'README.md',
    '.env.example',
    '.gitignore'
  ];

  for (const file of filesToAdd) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      zip.file(file, fs.readFileSync(filePath));
    }
  }

  // Add src directory
  const srcPath = path.join(rootDir, 'src');
  if (fs.existsSync(srcPath)) {
    const srcFolder = zip.folder('src');
    addDirectoryToZip(srcPath, srcFolder);
  }

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'culinaryqueue-food-order-processing-system.zip');
  console.log('Writing zip to:', outputPath);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  fs.writeFileSync(outputPath, content);
  console.log('ZIP file created successfully! Size:', (content.length / 1024).toFixed(1), 'KB');
}

buildZip().catch(err => {
  console.error('Error creating zip:', err);
  process.exit(1);
});
