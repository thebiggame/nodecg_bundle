<script setup lang="ts">
import {
  CountdownActive,
  CountdownData,
  CountdownName,
} from '@thebiggame/types/schemas'
import { useReplicant } from 'nodecg-vue-composable'
import { watch, toValue, useTemplateRef, computed } from 'vue'
import { gsap, Quart } from 'gsap'

const tl = gsap.timeline({ autoRemoveChildren: true })

const gActive = useReplicant<CountdownActive>('countdown:active', 'thebiggame')

const repCountdownData = useReplicant<CountdownData>(
  'countdown:data',
  'thebiggame',
)
const repCountdownName = useReplicant<CountdownName>(
  'countdown:name',
  'thebiggame',
)

const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')

function pad(num: number, size: number): string {
  // This is way easier in ECMAScript 2017.
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

const countdownFormatted = computed(() => {
  const minutes = Math.floor((repCountdownData?.data as number) / 60)
  const seconds = (repCountdownData?.data as number) % 60
  return pad(minutes, 2) + ':' + pad(seconds, 2)
})

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
        ease: Quart.easeOut,
      },
      'in+=0.5',
    )
    tl.to(
      innerNode,
      1,
      {
        marginRight: '0px',
        ease: Quart.easeOut,
      },
      'in+=1.0',
    )
    tl.to(
      outerNode,
      1,
      {
        borderRadius: '0px 150px 150px 0px',
        ease: Quart.easeOut,
      },
      'in+=1.0',
    )
    tl.play('in')
  } else {
    tl.clear().add('out')
    tl.to(
      innerNode,
      1,
      {
        marginRight: '100%',
        ease: Quart.easeInOut,
      },
      'out',
    )
    tl.to(
      outerNode,
      0.75,
      {
        borderRadius: '0px 0px 0px 0px',
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
      'out+=1.5',
    )
    tl.play('out')
  }
}

watch(
  () => (gActive !== undefined ? gActive.data : null),
  (e) => {
    if (e !== null) {
      const fieldValue = toValue(e) as CountdownActive
      handleWipe(fieldValue)
    }
  },
)
</script>

<style scoped>
:host {
  position: absolute;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  /* #3c438c */
  color: #fff;
}

@keyframes tilt-shaking {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(1px, 1px) rotate(5deg);
  }
  50% {
    transform: translate(0, 0) rotate(0deg);
  }
  75% {
    transform: translate(-1px, 1px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes wobble {
  0% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(-5deg);
  }
}

.timer-outer {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  top: 10px;
  left: 1425px;
  right: 10px;
  bottom: 875px;
  background-color: #fff;
  border-top: solid #fff 5px;
  border-bottom: solid #fff 5px;
  border-left: solid #fff 20px;
  border-right: solid #fff 5px;
  border-radius: 0 150px 150px 0;
}

.timer-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 35px;
  color: white;
  background-color: #3c438c;
  overflow: hidden;
}

.timer-name {
  font-size: 30px;
  font-weight: 300;
}

.timer-name:after {
  content: '';
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(147, 147, 147, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  display: block;
}

.timer-duration {
  font-family: 'DSEG14 Classic', 'Archivo Variable', sans-serif;
  font-size: 100px;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
  font-variation-settings: 'ROND' 0;
  margin-top: -10px;
}

.timer-duration.timer-duration-expiring {
  color: red;
  transition: color 2s ease-in-out;
}
</style>

<template>
  <div>
    <div ref="wipe-outer" class="timer-outer">
      <div
        ref="wipe-inner"
        class="timer-inner container-fluid d-flex flex-column"
      >
        <div class="row timer-name mr-5 align-self-center">
          {{ repCountdownName?.data }}
        </div>
        <div
          class="timer-duration"
          v-bind:class="{
            'timer-duration-expiring': repCountdownData?.data! < 60,
          }"
        >
          {{ countdownFormatted }}
        </div>
      </div>
    </div>
  </div>
</template>
