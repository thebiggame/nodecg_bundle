import { createHead } from '@vueuse/head'
import { createApp } from 'vue'
import App from './stage/main.vue'

import '../scss/styles_graphics.scss'

const app = createApp(App)
const head = createHead()
app.use(head)
app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
