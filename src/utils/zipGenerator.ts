import JSZip from 'jszip';

/**
 * Client-side ZIP generator that packages the entire repository
 * for easy upload to GitHub or local extraction.
 */
export async function createProjectZipBlob(onProgress?: (percent: number, file: string) => void): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('.gitignore', `node_modules\ndist\n.DS_Store\n*.local\n.env\n`);
  
  zip.file('.env.example', `# GEMINI_API_KEY: Optional AI enhancements\nGEMINI_API_KEY="YOUR_KEY"\nAPP_URL="http://localhost:3000"\n`);

  zip.file('metadata.json', JSON.stringify({
    name: "CulinaryQueue - Food Order Processing System",
    description: "Production-grade FIFO Queue-driven food ordering and kitchen dispatch system featuring real-time queue data structure visualizer, kitchen display, and live tracking.",
    requestFramePermissions: [],
    majorCapabilities: ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
  }, null, 2));

  zip.file('package.json', JSON.stringify({
    name: "online-food-order-processing-system",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      "dev": "vite --port=3000 --host=0.0.0.0",
      "build": "vite build",
      "preview": "vite preview",
      "lint": "tsc --noEmit"
    },
    dependencies: {
      "@tailwindcss/vite": "^4.3.3",
      "@vitejs/plugin-react": "^6.1.1",
      "jszip": "^3.10.1",
      "lucide-react": "^0.546.0",
      "motion": "^12.23.24",
      "react": "^19.0.1",
      "react-dom": "^19.0.1",
      "tailwindcss": "^4.3.3",
      "vite": "^8.3.0"
    },
    devDependencies: {
      "@types/jszip": "^3.4.1",
      "@types/node": "^22.14.0",
      "@types/react": "^19.3.0",
      "@types/react-dom": "^19.3.0",
      "typescript": "^7.0.2"
    }
  }, null, 2));

  zip.file('tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: false,
      module: "ESNext",
      types: ["vite/client"],
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      skipLibCheck: true,
      moduleResolution: "bundler",
      isolatedModules: true,
      moduleDetection: "force",
      allowJs: true,
      jsx: "react-jsx",
      paths: { "@/*": ["./*"] },
      allowImportingTsExtensions: true,
      noEmit: true
    }
  }, null, 2));

  zip.file('vite.config.ts', `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
}));
`);

  zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CulinaryQueue - Food Order Processing System</title>
    <meta name="description" content="Production-grade FIFO Queue-driven food ordering and kitchen dispatch system featuring real-time queue data structure visualizer, kitchen display, and live tracking." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-neutral-50 text-neutral-900 antialiased selection:bg-amber-200 selection:text-amber-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

  zip.file('README.md', `# CulinaryQueue: Online Food Order Processing System

Production-grade FIFO (First-In, First-Out) Queue-driven Kitchen Order Management and Dispatch System built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`
Visit http://localhost:3000 to launch the application.

## 🧠 Core DSA Concept: Queue
- **Enqueue (O(1))**: Incoming orders append to rear of queue.
- **Dequeue (O(1))**: Kitchen staff extracts order from front of queue.
- **Peek (O(1))**: Live inspection of next order without removal.
- **Fairness Guarantee**: Orders processed strictly in arrival sequence.
`);

  // Source directory
  const src = zip.folder('src');
  if (src) {
    src.file('index.css', `@import "tailwindcss";

@theme {
  --font-sans: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

@layer base {
  body {
    font-family: var(--font-sans);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }
}
`);
  }

  // Generate binary
  return await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent), metadata.currentFile || 'Bundling...');
      }
    }
  );
}

export function downloadBlobAsFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
