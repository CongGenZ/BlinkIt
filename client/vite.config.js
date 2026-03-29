import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // 👉 đổi port FE ở đây
    open: true,       // tự mở trình duyệt
    strictPort: true, // nếu port bận → báo lỗi
  },
})
