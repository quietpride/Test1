import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Test1/',  // ⚠️ 這裡一定要填你的 Repository 名，前後要有斜線
})