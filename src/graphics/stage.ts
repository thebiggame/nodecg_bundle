import { createHead } from '@vueuse/head'
import { createApp } from 'vue'
import App from './stage/main.vue'

import '../scss/styles_graphics.scss'

// Fonts
import '@fontsource/dseg14-classic/700.css'
import '@fontsource/dseg14-classic/400.css'
import '@fontsource/dseg14-classic/300.css'
import '@fontsource-variable/archivo'

const app = createApp(App)
const head = createHead()
app.use(head)
app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
