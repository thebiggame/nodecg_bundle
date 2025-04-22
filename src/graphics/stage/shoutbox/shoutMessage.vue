<script setup lang="ts">
import { ShoutboxShout } from '@thebiggame/types/schemas'
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable'
import { gsap, Quart } from 'gsap'
import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import { RiDiscordFill, RiInformationFill } from '@remixicon/vue'

const props = defineProps<{ shout: ShoutboxShout }>()

function _formatTime(timestamp: string): string {
  var time = new Date(timestamp)
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function _eventIsToday(timestamp: string): boolean {
  var time = new Date(timestamp)
  if (time.getDate() == new Date().getDate()) {
    return true
  } else {
    return false
  }
}

function _formatDay(timestamp: string): string {
  var time = new Date(timestamp)
  if (!_eventIsToday(timestamp)) {
    // The event isn't today - prepend the day.
    switch (time.getDay()) {
      case 1:
        return 'Day -3'
      case 2:
        return 'Day -2'
      case 3:
        return 'Day -1'
      case 4:
        return 'Day 0'
      case 5:
        return 'Day 1'
      case 6:
        return 'Day 2'
      case 0:
        return 'Day 3'
      default:
        return 'Day ?'
    }
  } else {
    return 'Today'
  }
}
</script>

<template>
  <div class="w-100 rounded-0 p-0 card text-dark bg-light">
    <div class="card-header d-flex align-items-center p-2">
      <img
        class="img-fluid rounded avatar"
        :src="props.shout?.user.avatar_url"
        alt="duck."
      />
      <RiDiscordFill
        v-if="props.shout?.id?.startsWith('DISC-')"
        class="ms-1"
      ></RiDiscordFill>
      <div class="ps-2 text-muted">{{ props.shout?.user.name }}</div>
      <div class="ms-auto"></div>
      <span
        v-if="!_eventIsToday(props.shout?.timestamp!)"
        class="day-pill badge rounded-pill text-bg-warning"
      >
        {{ _formatDay(props.shout?.timestamp!) }}
      </span>
      <div class="text-muted text-time">
        {{ _formatTime(props.shout?.timestamp!) }}
      </div>
    </div>
    <div
      class="card-body card-text p-2 d-block text-break shout-message"
      v-html="props.shout?.message"
    ></div>
  </div>
</template>

<style scoped lang="scss">
img.avatar {
  height: 40px;
  width: 40px;
}

.text-time {
  font-family: 'DSEG14 Classic', 'Archivo Variable', sans-serif;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}

.day-pill {
  font-family: 'Archivo Variable', sans-serif;
  font-size: 1rem;
}

.shout-message {
  white-space: pre-line;
  overflow: hidden;
  margin-block-end: 0;
  max-height: 200px;
}
</style>
