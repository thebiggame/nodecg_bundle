import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import NodeCGPlugin from 'vite-plugin-nodecg'

// Getting __dirname with ES Modules.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ autoImportComponentCase: 'pascal' }),
    checker({ vueTsc: { tsconfigPath: 'tsconfig.browser.json' } }),
    NodeCGPlugin(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@thebiggame/scss/_fonts.scss";
          @import "@thebiggame/scss/_variables.scss";
          @import "@thebiggame/scss/_mixins.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@thebiggame': `${__dirname}/src/`,
      '~bootstrap': `${__dirname}/node_modules/bootstrap`,
      '~fontsource': `${__dirname}/node_modules/@fontsource`,
      '~fontsource-variable': `${__dirname}/node_modules/@fontsource-variable`,
    },
  },
})
