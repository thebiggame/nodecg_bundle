<script setup lang="ts">
import { ExampleType } from '@thebiggame/types'
import { Configschema } from '@thebiggame/types/schemas'
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import Alert from './alert/alert.vue'
import Slideshow from './slideshow/slideshow.vue'
import Databar from './databar/databar.vue'
import Schedulebar from './schedulebar/schedulebar.vue'
import Countdown from './countdown/countdown.vue'

// Set the title of this page.
useHead({ title: 'NodeCG Stage' })

const stageIsFaded = ref(false)

const setPageFadeState = (state: boolean) => {
  state ? (stageIsFaded.value = true) : (stageIsFaded.value = false)
}
</script>
<style scoped>
body {
  margin: 0;
  background-color: rgba(0, 0, 0, 0);
}

.app-container {
  position: absolute;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  font-family: 'Archivo Variable';
  /* #3c438c */
  color: #fff;
  /*background: url("http://i.imgur.com/EcIltyp.png");
  background: url("http://i.imgur.com/ivbkXt1.png");*/
}

#loop {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
}

#timer-outer {
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #fff;
  padding-right: 5px;
}

#timer-inner {
  position: relative;
  font-size: 32px;
  color: white;
  background-color: #3c438c;
  padding-left: 50px;
  padding-right: 50px;
}

#cdown-name {
  font-size: 25px;
  font-weight: 300;
}

#cdown-name:after {
  content: '';
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(147, 147, 147, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  display: block;
}

#cdown-time {
  font-size: 100px;
  font-weight: 700;
  margin-top: -10px;
}

#clock {
  font-weight: 500;
  font-size: 40px;
  display: inline;
}

#clock-period {
  font-size: 25px;
  color: #909090;
  display: inline;
  vertical-align: text-bottom;
}

#content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 150px;
  height: 100%;
  -webkit-filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
}

#darkener {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  opacity: 0;
  z-index: 5000;
}

#logo {
  height: 280px;
}

#flavor {
  font-size: 42px;
  margin-top: 12px;
}

#time {
  font-size: 192px;
  -webkit-font-feature-settings: 'tnum';
  font-weight: 600;
  transition: opacity 333ms ease;
  opacity: 0;
}

tbg-alert {
  z-index: 9001;
}

#cdown-time {
  font-family: Consolas, monospace;
}

#current_data {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #fff;
  padding-right: 5px;
  padding-left: 5px;
}

#music > .img-fluid {
  max-height: 40px;
}
</style>
<template>
  <div class="app-container">
    <Alert @alert-darkener="setPageFadeState" />
    <Slideshow />
    <Schedulebar />
    <Databar />
    <Countdown />
    <div
      class="page-fader modal-backdrop fade"
      v-bind:class="{ show: stageIsFaded }"
    ></div>
  </div>
</template>
