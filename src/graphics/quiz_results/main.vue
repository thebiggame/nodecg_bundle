<script setup lang="ts">
import { useHead } from '@vueuse/head'

import Board from './board/main.vue'

// Set the title of this page.
useHead({ title: 'NodeCG QUIZ RESULTS' })
</script>
<style scoped lang="scss"></style>
<template>
  <div class="app-container">
    <Board />
  </div>
</template>
