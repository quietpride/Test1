import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // ⚠️ 注意：這裡的 /Test1/ 要換成你 GitHub Repository 的名字
  // 如果你的 Repository 叫 japan-trip，這裡就改成 /japan-trip/
  base: '/Test1/', 
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'index.html'), // 強制指定：就在當前目錄找 index.html
      },
    },
  },
})