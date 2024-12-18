import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import FullReload from 'vite-plugin-full-reload'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),
      FullReload(['**/*.ts'])],
    resolve: {
        alias: {'@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'}
    },
    define: {global: 'window'},
    server: {
        port: 3010
    }
})
