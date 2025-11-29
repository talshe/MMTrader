import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [react(), nxViteTsPaths()],
  server: {
    port: 4200
  },
  preview: {
    port: 4300
  },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true
  }
});

