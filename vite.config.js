import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
            return 'vendor-libs';
          }
          if (id.includes('src/data/uehActivities.json')) {
            return 'data-activities';
          }
          if (id.includes('src/data/drlCriteria.json')) {
            return 'data-criteria';
          }
          if (id.includes('src/data/uehFaculties')) {
            return 'data-faculties';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
