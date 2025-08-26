import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Default base is '/'. For GitHub Pages, edit this to '/<REPO_NAME>/' when deploying.
export default defineConfig({
  plugins: [react()],
  base: '/',
}); 