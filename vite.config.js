import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/Sistema---DATA/', // Cambia esto a la ruta de tu proyecto
    define: {
      'process.env': env,
    },
    plugins: [react()],
  };
});
