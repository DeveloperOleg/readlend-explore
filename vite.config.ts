
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: false, // Отключаем CORS для сервера разработки, чтобы минимизировать уязвимость esbuild
    hmr: {
      // Настройка безопасности для HMR (Hot Module Replacement)
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
    },
    headers: {
      // Добавляем заголовки безопасности для защиты от атак
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
    fs: {
      // Add strict security to prevent path traversal attacks
      strict: true,
      // Define allowed paths explicitly
      allow: [path.resolve(__dirname, ".")],
      // Deny access to sensitive directories
      deny: ['.git', '.github', 'node_modules/.cache'],
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Улучшаем настройки сборки для повышения производительности
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в production сборке
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем код на чанки для улучшения загрузки
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
        },
      },
    },
  },
}));
