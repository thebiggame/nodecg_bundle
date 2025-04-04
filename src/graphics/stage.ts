import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './stage/main.vue';

import "bootstrap/dist/css/bootstrap.css";

const app = createApp(App);
const head = createHead();
app.use(head);
app.mount('#app');

import "bootstrap/dist/js/bootstrap.js";