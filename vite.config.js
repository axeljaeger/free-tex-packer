import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: './',
    publicDir: 'src/client/resources',
    plugins: [react()],
    define: {
        PLATFORM: JSON.stringify('web')
    },
    resolve: {
        alias: {
            platform: path.resolve(rootDir, 'src/client/platform/web')
        }
    },
    build: {
        outDir: 'dist/web',
        emptyOutDir: true
    }
});
