import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // port: 3000,
    // hmr: true,
    proxy: {
      '/api': {
        // http://shanhe.kim/api/wz/bing.php?rand=true
        target: 'https://shanhe.kim/api/wz/bing.php?rand=true',
        changeOrigin: true,
        // secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },


  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境时移除 console
        pure_funcs: ['console.log'],
      },
      output: {
        // 去掉注释内容
        comments: false,
      },
    },
  },
})
