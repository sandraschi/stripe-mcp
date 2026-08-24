import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 11166,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:11165',
        changeOrigin: true,
      },
      '/mcp': {
        target: 'http://127.0.0.1:11165',
        changeOrigin: true,
      },
    },
  },
});
