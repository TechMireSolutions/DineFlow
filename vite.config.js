import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM does not have __dirname — derive it from import.meta.url instead
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Maps '@/' to the 'src/' directory so imports can be written as:
      //   import Foo from '@/components/Foo'
      // instead of relative paths like '../../components/Foo'
      '@': path.resolve(__dirname, './src'),
    },
  },
});
