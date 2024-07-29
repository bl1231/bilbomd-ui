import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

console.log('Starting Vite configuration...')
// console.log(process.env)
export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx'
    }),
    visualizer({ gzipSize: true, brotliSize: true, template: 'sunburst' }),
    tsconfigPaths()
  ],
  server: {
    host: 'localhost',
    port: 3002,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3501',
        changeOrigin: true,
        secure: false
      },
      '/admin/bullmq': {
        target: 'http://localhost:3501',
        changeOrigin: true,
        secure: false
      },
      '/sfapi': {
        target: 'http://localhost:3501',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        }
      }
    }
  }
})
