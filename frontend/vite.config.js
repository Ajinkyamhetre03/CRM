import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(), react()],
//   server: {
//     port: 3005,
//     open: true,
//   },
// })



export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        secure: false,
        // rewrite path if backend expects different prefix: optional
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

