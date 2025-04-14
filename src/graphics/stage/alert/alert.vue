<script setup lang="ts">
import { Configschema, AlertData, AlertActive } from '@thebiggame/types/schemas'
import { useReplicant } from 'nodecg-vue-composable'
import { watch, toValue, useTemplateRef } from 'vue'
import { gsap, Quart, Power2 } from 'gsap'

import { RiAlarmWarningLine } from '@remixicon/vue'

const tl = gsap.timeline({ autoRemoveChildren: true })

const repAlertData = useReplicant<AlertData>('notify:alert:data', 'thebiggame')

const repAlertActive = useReplicant<AlertActive>(
  'notify:alert:active',
  'thebiggame',
)

const emit = defineEmits(['alert-darkener'])
const sendAlertDarkenerEvent = (active: boolean) =>
  emit('alert-darkener', active)

const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')

// const refBwDown = useTemplateRef('alert-flair') ???
const refExclaimText = useTemplateRef('exclaim')

function handleAlert() {
  // const alertFlair = Polymer.dom(this.root).querySelector('#alert-flair')
  const flair = repAlertData?.data?.flair
  const delay = repAlertData?.data?.delay

  tl.clear().add('start', delay)

  if (flair) {
    tl.add('enter', 'start+=3')
    tl.call(
      () => {
        setTimeout(() => {
          nodecg.playSound('alertCue')
          // Fade out stuff
          sendAlertDarkenerEvent(true)
        }, 0)
      },
      undefined,
      'start',
    )
    tl.to(
      refExclaimText.value,
      {
        duration: 0.5,
        opacity: 1,
      },
      'start',
    )
    tl.to(
      refExclaimText.value,
      {
        duration: 3,
        y: 150,
        ease: 'elastic.out(1.2, 0.3)',
      },
      'start',
    )
  } else {
    tl.add('enter')
  }

  if (flair) {
    tl.to(
      refExclaimText.value,
      0.75,
      {
        opacity: 0.9,
        y: -150,
        ease: Power2.easeInOut,
      },
      'enter',
    )
  }

  tl.to(
    refElemOuter.value,
    0.25,
    {
      left: '100px',
      // marginRight: "0px",
      ease: Quart.easeOut,
    },
    'enter',
  )
  tl.to(
    refElemOuter.value,
    1,
    {
      marginRight: '0px',
      ease: Quart.easeOut,
    },
    'enter+=0.5',
  )
  tl.to(
    refElemInner.value,
    0.75,
    {
      marginRight: '0px',
      ease: Quart.easeOut,
    },
    'enter+=0.75',
  )
  tl.to(
    refElemOuter.value,
    1,
    {
      borderRadius: '0px 150px 150px 0px',
      ease: Quart.easeOut,
    },
    'enter+=0.75',
  )
}

watch(
  () => (repAlertActive !== undefined ? repAlertActive.data : null),
  (e) => {
    if (e !== null) {
      const fieldValue = toValue(e) as AlertActive
      if (fieldValue) {
        handleAlert()
      } else {
        handleExit()
      }
    }
  },
)

function handleExit() {
  sendAlertDarkenerEvent(false)

  const flair = repAlertData?.data?.flair

  // Exit
  tl.clear().add('exit', '+=25')

  tl.to(
    refElemInner.value,
    1,
    {
      marginRight: '100%',
      ease: Quart.easeInOut,
    },
    'exit',
  )
  tl.to(
    refElemOuter.value,
    1,
    {
      marginRight: '1900px',
      borderRadius: '0px 0px 0px 0px',
      ease: Quart.easeInOut,
    },
    'exit+=0.5',
  )
  tl.to(
    refElemOuter.value,
    1,
    {
      left: '-50px',
      ease: Quart.easeInOut,
    },
    'exit+=1',
  )

  if (flair) {
    tl.to(
      refExclaimText.value,
      0.5,
      {
        opacity: 0,
        y: 0,
        ease: Power2.easeInOut,
      },
      'exit',
    )
  }
  tl.play('exit')
}
</script>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.wipe-outer {
  @include tbg-bar-outer(20px, 5px);
  top: 500px;
  /* left: 100px; */
  right: 100px;
  bottom: 400px;
  z-index: 1055;
  /*  Prepare for animation */
  margin-right: 100%;
  left: -50px;
}

.wipe-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  background-color: #3c438c;
  overflow: hidden;
  /*  Prepare for animation */
  margin-right: 100%;
}

.name-content {
  font-size: 75px;
  font-weight: 700;
  font-family: 'Arial', sans-serif;
}

.icon {
  color: red;
  filter: drop-shadow(10px 3px 10px rgba(0, 0, 0, 0.7));
}

.exclaim {
  position: absolute;
  z-index: 1054;
  margin: auto;
  font-size: 33em;
  font-family: 'Arial Black', sans-serif;
  color: red;
  text-shadow: 0px 10px 10px #000;
  opacity: 0;
  text-align: center;
}
</style>

<template>
  <div>
    <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
    <div ref="wipe-outer" class="wipe-outer">
      <div ref="wipe-inner" class="wipe-inner container-fluid">
        <div class="d-flex flex-row align-items-center">
          <div class="icon">
            <RiAlarmWarningLine size="150px" />
          </div>
          <div id="wipe-now" class="ps-3">
            <div id="name">
              <div id="name-content" class="name-content">
                {{ repAlertData?.data?.body }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="exclaim" class="exclaim"><b>ALERT</b></div>
  </div>
</template>
