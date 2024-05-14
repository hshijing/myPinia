import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  server:{
    hmr:true,
    port:8080,
  },
  resolve:{
   '@':path.resolve(__dirname,'./src') // 设置别名
  }
})
