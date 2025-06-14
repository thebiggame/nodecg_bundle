<script setup lang="ts">
import {
  BandwidthData,
  Clock,
  Configschema,
  MusicData,
  ProjectorActive,
} from '@thebiggame/types/schemas'
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable'
import { computed, onMounted, toValue, useTemplateRef, watch } from 'vue'
import { gsap, Quart } from 'gsap'
import assetTBGText from '../../shared/tbgText.svg?raw'
import {
  RiCalendarEventFill,
  RiDownloadCloudFill,
  RiGamepadFill,
  RiHandHeartFill,
  RiLockPasswordLine,
  RiMusicAiFill,
  RiProjector2Line,
  RiShieldUserFill,
  RiTimeLine,
  RiUploadCloudFill,
  RiWifiFill,
} from '@remixicon/vue'
import TbgBrandChip from '../../shared/tbgBrandChip.vue'

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema

const versionString = 'Bundle-' + nodecg.bundleVersion

// Accessing normal types.
// const exampleType: ExampleType = { exampleProperty: 'exampleString' };

const tl = gsap.timeline({ autoRemoveChildren: true })

const repAssetSponsorChips = useAssetReplicant('sponsor-chips', 'thebiggame')

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repMusicData = useReplicant<MusicData>('music:now', 'thebiggame')

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
        x: '0%',
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
        x: '-200%',
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
  let slides = refMessages.value?.querySelectorAll('.is-message')

  let currentSlideIndex = 0

  gsap.set(slides, { y: '100%' })
  gsap.set(slides[0], { y: '0%' })

  const showNextSlide = () => {
    const totalSlides = slides.length
    const currentSlide = slides[currentSlideIndex]
    const nextSlideIndex = (currentSlideIndex + 1) % totalSlides
    const nextSlide = slides[nextSlideIndex]

    let shouldStepForward = true
    if (totalSlides >= 2) {
      // There are slides to animate between.
      gsap.to(currentSlide, {
        duration: 0.5,
        y: '-100%',
        ease: 'power4.inOut',
        onComplete: () => {
          if (currentSlide.classList.contains('message-display-once')) {
            currentSlide.remove()
            // Need to step the current understanding back one to compensate.
            shouldStepForward = false
            // Update understanding of slide list.
            if (refMessages.value !== null) {
              slides = refMessages.value?.querySelectorAll('.is-message')
            }
          } else {
            gsap.set(currentSlide, { y: '100%' })
          }
        },
      })

      gsap.to(nextSlide, {
        duration: 0.5,
        y: '0%',
        ease: 'power4.inOut',
        onComplete: () => {
          if (shouldStepForward) {
            currentSlideIndex = nextSlideIndex
          }
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

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.wipe-outer {
  @include tbg-bar-outer(20px, 5px);
  top: 990px;
  left: 10px;
  right: 10px;
  bottom: 5px;
}

.wipe-outer {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;

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
  background-color: $color-tbg-primary;
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
  color: $color-tbg-event-highlight;
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
  font-family: 'DSEG14 Classic', 'Archivo Variable', sans-serif;
  font-weight: 300;
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
      <div ref="wipe-inner" class="wipe-inner container-fluid p-0">
        <div id="event-data" class="d-flex">
          <TbgBrandChip :size="75" />
          <div
            id="message-box"
            ref="message-box"
            class="ps-1 d-flex box-elem-message align-items-center align-self-center"
          >
            <div class="is-message d-flex message-display-once">
              <RiProjector2Line
                size="50px"
                className="align-self-center anim-wiggle mx-2"
              ></RiProjector2Line>
              <p>
                <b class="pe-2">NG-TBG</b>
                <i>{{ versionString }}</i>
              </p>
            </div>
            <div class="is-message d-flex">
              <RiGamepadFill size="50px" className="align-self-center me-2" />
              <p v-if="clockEventDay == 1">
                Welcome to <b>theBIGGAME</b>
                <b class="event-num">{{ config.event_num }}</b
                >!
              </p>
              <p v-else>
                <b>theBIGGAME</b>
                <b class="event-num">{{ config.event_num }}</b>
              </p>
            </div>
            <div class="is-message d-flex">
              <RiCalendarEventFill
                size="50px"
                className="align-self-center me-2"
              ></RiCalendarEventFill>
              <p v-if="clockEventDay == 1">
                Day <b>1</b>: <i>Settle in, make yourself at home!</i>
              </p>
              <p v-else-if="clockEventDay == 2">
                Day <b>2</b>: <i>Tournaments & Pub Quiz</i>
              </p>
              <p v-else-if="clockEventDay == 3">
                Day <b>3</b>: <i>Finals Day</i>
              </p>
              <p v-else>Day... wait, you're not supposed to be here!</p>
            </div>
            <div class="is-message d-flex">
              <RiHandHeartFill
                size="50px"
                className="align-self-center me-2"
              ></RiHandHeartFill>
              <div
                v-for="chip in repAssetSponsorChips"
                class="d-flex box-elem align-items-center sponsor-boxo bg-white"
              >
                <img class="img-fluid mx-2" :src="chip.url" />
              </div>
            </div>
            <div class="is-message d-flex" v-if="config.music.party?.enabled">
              <RiMusicAiFill
                size="50px"
                className="align-self-center me-2"
              ></RiMusicAiFill>
              <p>
                Add your own music:
                {{ config.music.party?.url }}
              </p>
            </div>
            <div class="is-message d-flex">
              <RiWifiFill
                size="50px"
                className="align-self-center me-2"
              ></RiWifiFill>
              <span>thebiggame</span>
              <RiLockPasswordLine
                size="50px"
                className="align-self-center mx-2"
              ></RiLockPasswordLine>
              <span>thebiggame</span>
            </div>
            <div class="is-message d-flex">
              <RiShieldUserFill
                size="50px"
                className="align-self-center me-2"
              ></RiShieldUserFill>
              <p>Please ensure your credentials are visible at all times.</p>
            </div>
          </div>
          <div class="ms-auto" />
          <div
            id="net-bw-box"
            class="d-flex flex-column box-elem bg-dark"
            v-if="config.network.snmp.enabled"
          >
            <div class="d-flex flex-grow">
              <RiDownloadCloudFill
                size="36px"
                className="icon-bw"
              ></RiDownloadCloudFill>
              <div
                id="net-bw-down-content"
                ref="net-bw-down"
                class="bw-content ps-2"
              >
                ???
              </div>
              <div class="align-self-end bw-trail text-white-50">Mbps</div>
            </div>
            <div class="d-flex flex-grow">
              <RiUploadCloudFill
                size="36px"
                className="icon-bw"
              ></RiUploadCloudFill>
              <div
                id="net-bw-up-content"
                ref="net-bw-up"
                class="bw-content ps-2"
              >
                ???
              </div>
              <div class="align-self-end bw-trail text-white-50">Mbps</div>
            </div>
          </div>
          <div
            id="day-box"
            class="d-flex box-elem bg-dark align-items-center align-self-center"
          >
            <div class="icon-primary text-white-50 align-self-center">
              <RiCalendarEventFill
                size="50px"
                className="icon-primary text-white-50 align-self-center"
              ></RiCalendarEventFill>
            </div>
            <div id="day">{{ clockEventDay }}</div>
            <div class="align-self-end day-trail text-white-50">/3</div>
          </div>
          <div id="clock-box" class="d-flex box-elem bg-dark">
            <div class="icon-primary text-white-50 align-self-center">
              <RiTimeLine size="50px"></RiTimeLine>
            </div>
            <div class="box-clock align-self-center ps-1 pe-3" id="clock">
              {{ clockTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
