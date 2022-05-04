// @ts-check
import { defineConfig } from 'vite'
import path from 'path'

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'TruncatedContent',
      fileName: (format) => `truncated-content.${format}.js`,
    },
  }
})
