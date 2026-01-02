import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import Svgr from 'vite-plugin-svgr';
import TsconfigPaths from 'vite-tsconfig-paths';
import dns from 'dns';
dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    Svgr({
      svgrOptions: { exportType: 'default' },
    }),
    react(),
    TsconfigPaths(),
  ],
  build: {
    outDir: 'build',
  },
});
