import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accountlogin: resolve(__dirname, 'accountlogin.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        if (fs.existsSync('images')) {
          fs.cpSync('images', 'dist/images', { recursive: true });
        }
      },
    },
  ],
});
