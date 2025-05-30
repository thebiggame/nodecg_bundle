<script setup lang="ts">
import { useHead } from '@vueuse/head'

import Scoreboard from './scoreboard/scoreboard.vue'

// Set the title of this page.
useHead({ title: 'NodeCG GAMEPLAY' })
</script>
<style scoped lang="scss"></style>
<template>
  <div class="app-container">
    <Scoreboard />
  </div>
</template>
