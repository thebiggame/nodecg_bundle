<script setup lang="ts">
import { ExampleType } from '@thebiggame/types'
import {
  Configschema,
  ProjectorActive,
  Clock,
  BandwidthData,
} from '@thebiggame/types/schemas'
import { useReplicant, useAssetReplicant, Asset } from 'nodecg-vue-composable'
import { onMounted, watch, toValue, useTemplateRef, computed } from 'vue'
import { gsap, Quart } from 'gsap'

import {
  RiDownloadCloudFill,
  RiUploadCloudFill,
  RiCalendarEventFill,
  RiHandHeartFill,
  RiEmotionHappyFill,
  RiRocketFill,
  RiMusic2Fill,
  RiUserLine,
  RiWifiFill,
  RiLockPasswordLine,
  RiShieldUserFill,
  RiTimeLine,
} from '@remixicon/vue'

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema

// Accessing normal types.
// const exampleType: ExampleType = { exampleProperty: 'exampleString' };

const tl = gsap.timeline({ autoRemoveChildren: true })

const repAssetSponsorChips = useAssetReplicant('sponsor-chips', 'thebiggame')

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repMusicTitle = useReplicant<string>('music:title', 'thebiggame', {
  defaultValue: 'Unknown Song',
})
const repMusicArtist = useReplicant<string>('music:artist', 'thebiggame', {
  defaultValue: 'Unknown Artist',
})

const clockRep = useReplicant<Clock>('clock', 'thebiggame')

const repNetWANBw = useReplicant<BandwidthData>(
  'network:wan:bandwidth',
  'thebiggame',
)

const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')

const refBwDown = useTemplateRef('net-bw-down')
const refBwUp = useTemplateRef('net-bw-up')

function handleBwValue(newVal: number, oldVal: number, elem: Element | null) {
  if (newVal == null || elem == null) {
    return
  }
  if (newVal === -1) {
    // Presently unknown bandwidth data
    elem.textContent = '???'
  } else {
    const target = Math.floor((newVal / 100) * 10) / 100
    gsap.to(elem, {
      duration: 1,
      ease: 'power1.inOut',
      textContent: target,
      snap: {
        textContent: 0.01,
      },
      onUpdate() {
        elem.textContent = parseFloat(
          elem.textContent != null ? elem.textContent : '0',
        ).toFixed(1)
      },
      onComplete() {
        elem.textContent = target.toFixed(1)
      },
    })
    if (newVal >= config.network.bwHighThreshold) {
      elem.classList.add('bw-high-anim')
    } else {
      elem.classList.remove('bw-high-anim')
    }
  }
}

watch(
  () => (repNetWANBw !== undefined ? repNetWANBw.data : null),
  (v, oldV) => {
    if (v != undefined) {
      // const fieldValue = toValue(v) as BandwidthData;
      handleBwValue(v.up, oldV != undefined ? oldV.up : 0, refBwUp.value)
      handleBwValue(v.down, oldV != undefined ? oldV.down : 0, refBwDown.value)
    }
  },
)

function handleWipe(newVal: boolean) {
  const outerNode = refElemOuter.value
  const innerNode = refElemInner.value
  if (newVal) {
    tl.clear().add('in')
    tl.to(
      outerNode,
      0.5,
      {
        top: '990px',
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
        borderRadius: '0px 150px 150px 0px',
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
        top: '100%',
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
      const fieldValue = toValue(e) as ProjectorActive
      handleWipe(fieldValue)
    }
  },
)

const clockTime = computed(() => {
  const period = new Date(clockRep?.data as Clock)
  return period.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, '$1')
})

const clockEventDay = computed(() => {
  const period = new Date(clockRep?.data as Clock)
  switch (period.getDay()) {
    case 5:
      return 1
    case 6:
      return 2
    case 0:
      return 3
    default:
      return '?'
  }
})

// watch(
//   () => (clockRep !== undefined ? clockRep.data : null),
//   (e) => {
//     if (e !== null) {
//       const fieldValue = toValue(e) as Clock;
//       updateClock(fieldValue);
//     }
//   },
// );

const refMessages = useTemplateRef('message-box')

function initSlideshow() {
  if (refMessages.value === null) {
    return
  }
  const slides = refMessages.value.querySelectorAll('.is-message')

  let currentSlideIndex = 0

  gsap.set(slides, { y: '100%' })
  gsap.set(slides[0], { y: '0%' })

  const showNextSlide = () => {
    const totalSlides = slides.length
    const currentSlide = slides[currentSlideIndex]
    const nextSlideIndex = (currentSlideIndex + 1) % totalSlides
    const nextSlide = slides[nextSlideIndex]

    if (totalSlides >= 2) {
      // There are slides to animate between.
      gsap.to(currentSlide, {
        duration: 0.5,
        y: '-100%',
        ease: 'power4.inOut',
        onComplete: () => {
          gsap.set(currentSlide, { y: '100%' })
        },
      })

      gsap.to(nextSlide, {
        duration: 0.5,
        y: '0%',
        ease: 'power4.inOut',
        onComplete: () => {
          currentSlideIndex = nextSlideIndex
        },
      })
    }
  }

  setInterval(showNextSlide, 7500)
}

onMounted(() => {
  // Initialise message slideshow handlers
  initSlideshow()
})
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

.wipe-outer {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  top: 990px;
  left: 10px;
  right: 10px;
  bottom: 5px;
  background-color: #fff;
  border-top: solid #fff 5px;
  border-bottom: solid #fff 5px;
  border-left: solid #fff 20px;
  border-right: solid #fff 5px;
  border-radius: 0px 150px 150px 0px;
}

.wipe-inner {
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

#wipe-title {
  font-size: 45px;
  font-weight: 300;
  font-family: 'Archivo Variable', 'Arial Black', 'Arial Bold', sans-serif;
  text-shadow: rgba(0, 0, 0, 0.5) 0 0 20px;
  background-color: #5762d7;
  border-right: solid #fff 2px;
}

.box-elem {
  height: 75px;
  border-left: solid #fff 2px;
  padding-left: 5px;
  padding-right: 5px;
}

.box-elem-message {
  height: 75px;
  border-left: solid #fff 2px;
  padding-left: 0px;
  padding-right: 10px;
  font-size: 50px;
}

.box-border-left {
  border-left: solid #303030 1px;
}

.event-num {
  color: goldenrod;
  font-family: 'Archivo Variable', sans-serif;
  font-weight: 800;
}

.icon-primary {
  --iron-icon-height: 30px;
  --iron-icon-width: 30px;
  padding-right: 5px;
}

.icon-lead {
  --iron-icon-height: 100px;
  --iron-icon-width: 100px;
  padding-right: 15px;
}

.info-body {
  font-size: 45px;
  line-height: 125%;
  text-wrap: wrap;
  /* Chromism */
  white-space: normal;
}

.box-clock {
  font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
  font-weight: 500;
  font-size: 45px;
  display: inline;
}

.day-trail {
  font-size: 25px;
  color: #909090;
  padding-right: 5px;
}

.is-message {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  padding-left: 5px;
}

.icon-message {
  margin-top: -10px;
  margin-bottom: -10px;
}

.anim-wiggle {
  animation: wobble 1s infinite;
  display: inline-block;
}

.is-message p {
  display: inline-block;
}

#day-box {
  font-size: 40px;
}

#now-body {
  font-size: 75px;
  font-weight: 700;
}

#schedule {
  padding-top: 10px;
  padding-left: 10px;
}

/*
.icon-bw {
  --iron-icon-height: 30px;
          --iron-icon-width: 30px;
}
.bw-trail {
  font-size: 15px;
  color: #909090;
  padding-left: 2px;
  vertical-align:bottom;
}
*/

.icon-bw {
  font-size: 25px;
}

.bw-trail {
  font-size: 15px;
  color: #909090;
  padding-left: 2px;
  vertical-align: bottom;
}

.day-trail {
  font-size: 25px;
  color: #909090;
  padding-left: 2px;
  vertical-align: bottom;
}

.bw-content {
  font-size: 25px;
}

.bw-high-anim {
  color: rgb(255, 127, 127);
  animation: tilt-shaking 0.15s infinite;
  transition: color 2s ease-in-out;
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

.event-trail {
  font-size: 30px;
  font-weight: 300;
  padding-right: 10px;
  font-family: 'Arial Bold', Gadget, sans-serif;
}

#next-body {
  font-size: 50px;
  font-weight: 500;
}

#wipe-next {
  margin-top: -20px;
}

.sponsor-boxo > .img-fluid {
  max-height: 40px;
}

#music-box > .img-fluid {
  max-height: 20px;
}
</style>

<template>
  <div>
    <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
    <div ref="wipe-outer" class="wipe-outer">
      <div ref="wipe-inner" class="wipe-inner container-fluid">
        <div id="event-data" class="row">
          <div id="wipe-title" class="d-flex box-elem">
            <b class="event-num align-self-center">{{ config.event_num }}</b>
          </div>
          <div id="net-bw-box" class="d-flex flex-column box-elem bg-dark">
            <div class="d-flex flex-grow">
              <RiDownloadCloudFill
                size="36px"
                className="icon-bw"
              ></RiDownloadCloudFill>
              <div
                id="net-bw-down-content"
                ref="net-bw-down"
                class="bw-content pl-2"
              >
                ???
              </div>
              <div class="align-self-end bw-trail text-muted">Mbps</div>
            </div>
            <div class="d-flex flex-grow">
              <RiUploadCloudFill
                size="36px"
                className="icon-bw"
              ></RiUploadCloudFill>
              <div
                id="net-bw-up-content"
                ref="net-bw-up"
                class="bw-content pl-2"
              >
                ???
              </div>
              <div class="align-self-end bw-trail text-muted">Mbps</div>
            </div>
          </div>
          <div
            id="message-box"
            ref="message-box"
            class="d-flex box-elem-message align-self-center"
          >
            <div class="is-message">
              <RiEmotionHappyFill
                size="50px"
                className="align-self-center anim-wiggle"
              ></RiEmotionHappyFill>
              <p>
                Welcome to <b>theBIGGAME</b>
                <b class="event-num">{{ config.event_num }}</b
                >!
              </p>
            </div>
            <div class="is-message">
              <RiRocketFill
                size="50px"
                className="align-self-center"
              ></RiRocketFill>
              <p>Powered by <b>NG-tBG</b>, our new AV experience!</p>
            </div>
            <div class="is-message d-flex">
              <RiHandHeartFill
                size="50px"
                className="align-self-center pr-3"
              ></RiHandHeartFill>
              <div
                v-for="chip in repAssetSponsorChips"
                class="d-flex box-elem align-items-center sponsor-boxo bg-light"
              >
                <img class="img-fluid mx-2" :src="chip.url" />
              </div>
            </div>
            <div class="is-message">
              <RiMusic2Fill
                size="50px"
                className="align-self-center anim-wiggle"
              ></RiMusic2Fill>
              <span id="music-title">{{ repMusicTitle?.data }}</span>
              <RiUserLine
                size="50px"
                className="align-self-center text-muted"
              ></RiUserLine>
              <span id="music-artist">{{ repMusicArtist?.data }}</span>
            </div>
            <div class="is-message">
              <RiWifiFill
                size="50px"
                className="align-self-center"
              ></RiWifiFill>
              <p>
                thebiggame /
                <RiLockPasswordLine
                  size="36px"
                  className="align-self-center"
                ></RiLockPasswordLine>
                thebiggame
              </p>
            </div>
            <div class="is-message">
              <RiShieldUserFill
                size="50px"
                className="align-self-center"
              ></RiShieldUserFill>
              <p>Please ensure your credentials are visible at all times.</p>
            </div>
          </div>
          <div
            id="day-box"
            class="d-flex box-elem bg-dark align-items-center ml-auto align-self-center"
          >
            <div class="icon-primary text-muted align-self-center">
              <RiCalendarEventFill
                size="50px"
                className="icon-primary text-muted align-self-center"
              ></RiCalendarEventFill>
            </div>
            <div id="day">{{ clockEventDay }}</div>
            <div class="align-self-end day-trail text-muted">/3</div>
          </div>
          <div id="clock-box" class="d-flex box-elem bg-dark">
            <div class="icon-primary text-muted align-self-center">
              <RiTimeLine size="50px"></RiTimeLine>
            </div>
            <div class="box-clock align-self-center pl-1 pr-3" id="clock">
              {{ clockTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
