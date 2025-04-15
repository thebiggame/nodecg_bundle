<script setup lang="ts">
import {
  Configschema,
  ShoutboxShouts,
  ProjectorActive,
} from '@thebiggame/types/schemas'
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable'
import { gsap, Quart } from 'gsap'
import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import { RiDiscordFill, RiInformationFill } from '@remixicon/vue'
import ShoutMessage from './shoutMessage.vue'

const config = nodecg.bundleConfig as Configschema

const tl = gsap.timeline({ autoRemoveChildren: true })

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repShoutboxMessages = useReplicant<ShoutboxShouts>(
  'shoutbox:messages',
  'thebiggame',
  {
    defaultValue: <ShoutboxShouts>{
      shouts: [],
    },
  },
)

nodecg.listenFor('shoutbox:message', (data) => {
  console.log(data)
})

const refElemOuter = useTemplateRef('shoutbox-outer')
const refElemInner = useTemplateRef('shoutbox-inner')

function handleWipe(newVal: boolean) {
  const outerNode = refElemOuter.value
  const innerNode = refElemInner.value
  if (newVal) {
    tl.clear().add('in')
    tl.to(
      outerNode,
      0.5,
      {
        y: '0%',
        // marginRight: "0px",
        ease: Quart.easeOut,
      },
      'in',
    )
    tl.to(
      outerNode,
      1,
      {
        marginRight: '0px',
        borderRadius: '0px 15px 15px 0px',
        ease: Quart.easeOut,
      },
      'in+=0.2',
    )
    tl.to(
      innerNode,
      1,
      {
        x: '0%',
        ease: Quart.easeOut,
      },
      'in+=0.75',
    )
    tl.play('in')
  } else {
    tl.clear().add('out')
    tl.to(
      innerNode,
      1,
      {
        x: '-100%',
        ease: Quart.easeInOut,
      },
      'out',
    )
    tl.to(
      outerNode,
      1,
      {
        marginRight: '1900px',
        borderRadius: '0px 0px 0px 0px',
        ease: Quart.easeInOut,
      },
      'out+=0.5',
    )
    tl.to(
      outerNode,
      1,
      {
        y: '-120%',
        ease: Quart.easeInOut,
      },
      'out+=0.75',
    )
    tl.play('out')
  }
}

watch(
  () => (gActive !== undefined ? gActive.data : null),
  (e) => {
    if (e !== null) {
      const fieldValue = toValue(e) as ProjectorActive
      handleWipe(fieldValue)
    }
  },
)

nodecg.listenFor('shoutbox:chime', (data) => {
  setTimeout(() => {
    nodecg.playSound('shoutCue')
  }, 0)
})

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
  <div>
    <div ref="shoutbox-outer" class="shoutbox-outer" id="shoutbox">
      <div class="shoutbox-inner" ref="shoutbox-inner">
        <!-- weird flex but ok -->
        <TransitionGroup
          tag="div"
          ref="shoutbox-data"
          class="shoutbox-inner ps-0 pe-0 container-fluid d-flex flex-column-reverse justify-content-start align-items-end"
          name="list-join"
        >
          <template
            v-for="shout in repShoutboxMessages?.data?.shouts"
            :key="shout.id"
          >
            <ShoutMessage :shout="shout"></ShoutMessage>
          </template>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.shoutbox-outer {
  @include tbg-bar-outer(10px, 5px, 15px);
  top: 10px;
  left: 1350px;
  right: 10px;
  bottom: 240px;
}

.shoutbox-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 24px;
  color: white;
  background-color: $color-tbg-dark;
  overflow: hidden;
}

.list-join-move,
.list-join-enter-active,
.list-join-leave-active {
  transition: all 0.5s ease;
}

.list-join-enter-from,
.list-join-leave-to {
  opacity: 0;
  transform: translate(0px, 75px);
}

/* ensure leaving items are taken out of layout flow so that moving animations can be calculated correctly */
.list-join-leave-active {
  position: absolute;
}
</style>
