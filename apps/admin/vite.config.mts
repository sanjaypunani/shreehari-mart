import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  server: {
    port: 4200,
    host: true,
  },
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@shreehari/types': resolve(__dirname, '../../libs/types/src/index.ts'),
      '@shreehari/ui': resolve(__dirname, '../../libs/ui/src/index.ts'),
      '@shreehari/design-system': resolve(
        __dirname,
        '../../libs/design-system/src/index.ts'
      ),
      '@shreehari/utils': resolve(__dirname, '../../libs/utils/src/index.ts'),
      '@shreehari/data-access': resolve(
        __dirname,
        '../../libs/data-access/src/index.ts'
      ),
    },
  },
  build: {
    outDir: '../../dist/apps/admin',
    emptyOutDir: true,
  },
});
