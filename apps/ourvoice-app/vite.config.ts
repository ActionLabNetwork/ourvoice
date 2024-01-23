import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import ViteYaml from '@modyfi/vite-plugin-yaml'
import Markdown from 'vite-plugin-vue-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        compilerOptions: {
          // i am ignorning my custom '<TransitionRoot>' tag
          isCustomElement: (tag) => ['TransitionRoot'].includes(tag)
        }
      }
    }),
    ViteYaml(),
    Markdown({ headEnabled: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      // '@': path.resolve(__dirname, 'src')
    }
  }
})
