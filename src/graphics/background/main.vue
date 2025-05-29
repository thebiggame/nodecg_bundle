<script setup lang="ts">
import { ExampleType } from '@thebiggame/types'
import { Configschema } from '@thebiggame/types/schemas'
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

// Set the title of this page.
useHead({ title: 'NodeCG Background Animations' })

const stageIsFaded = ref(false)

const setPageFadeState = (state: boolean) => {
  state ? (stageIsFaded.value = true) : (stageIsFaded.value = false)
}
</script>
<style scoped lang="scss">
html {
  height: 100%;
  width: 100%;
}

body {
  margin: 0;
  background-color: rgba(0, 0, 0, 0);
}

.app-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Archivo Variable';
  /* #3c438c */
  color: #fff;
  /*background: url("http://i.imgur.com/EcIltyp.png");
  background: url("http://i.imgur.com/ivbkXt1.png");*/
  background: linear-gradient(
    -45deg,
    $color-tbg-primary,
    $color-tbg-dark,
    $color-tbg-primary,
    $color-tbg-secondary
  );
  background-size: 300% 300%;
  animation: gradient 30s ease-in-out infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
<template>
  <div class="app-container"></div>
</template>
