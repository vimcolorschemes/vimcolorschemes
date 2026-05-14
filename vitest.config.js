import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: ['**/.wt/**', '**/node_modules/**', '**/.git/**'],
    setupFiles: ['src/__tests__/setup.ts'],
  },
  resolve: { alias: { '@': '/src' } },
});
