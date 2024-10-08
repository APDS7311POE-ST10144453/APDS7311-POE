import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import checkEnvPlugin from './checkEnv';

// Get the directory name in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checkEnvPlugin()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'keys','privatekey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'keys','certificate.pem')),
    },
    port: 5173,
  },
})
