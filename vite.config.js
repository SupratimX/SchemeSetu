import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()'
};

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    headers: securityHeaders
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    headers: securityHeaders
  }
})
