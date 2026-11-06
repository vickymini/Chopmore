import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accountlogin: resolve(__dirname, 'accountlogin.html'),
        accoutnlogin: resolve(__dirname, 'accoutnlogin.html'),
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
