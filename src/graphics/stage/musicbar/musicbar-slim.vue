<script setup lang="ts">
import {
  Configschema,
  ProjectorActive,
  MusicData,
  MusicPlaybackData,
} from '@thebiggame/types/schemas'
import { gsap, Quart } from 'gsap'
import { useReplicant } from 'nodecg-vue-composable'
import { computed, ref, toValue, useTemplateRef, watch } from 'vue'
import { RiArrowRightLine, RiMusic2Fill } from '@remixicon/vue'

const config = nodecg.bundleConfig as Configschema

const tl = gsap.timeline({ autoRemoveChildren: true })
const musicTl = gsap.timeline({ autoRemoveChildren: true })

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repMusicNow = useReplicant<MusicData>('music:now', 'thebiggame')
const repMusicNext = useReplicant<MusicData>('music:next', 'thebiggame')
const repMusicState = useReplicant<MusicPlaybackData>(
  'music:playbackState',
  'thebiggame',
)

const dispMusicNow = ref(<MusicData>{})
const dispMusicNext = ref(<MusicData>{})

const musicProgressServer = computed(() => {
  const total = repMusicState?.data?.length
  const playhead = repMusicState?.data?.playhead
  if (total == undefined || playhead == undefined) {
    return 0
  }
  return (playhead / total) * 100
})

const musicStartTime = computed(() => {
  return (
    new Date(repMusicState?.data?.updatedAt!).getTime() -
    repMusicState?.data?.playhead!
  )
})

const musicProgress = computed(() => {
  const progress = new Date().getTime() - musicStartTime.value
  return Math.min((progress / repMusicState?.data?.length!) * 100, 100)
})

// Refs
const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')
const refMusicNow = useTemplateRef('music-now')
const refMusicNowProgress = useTemplateRef('music-now-progress')
const refMusicNext = useTemplateRef('music-next')
const refMusicNextArt = useTemplateRef('music-next-art')
const refMusicNextArrow = useTemplateRef('music-next-arrow')

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
      'in+=0.3',
    )
    tl.to(
      innerNode,
      1,
      {
        marginRight: '0px',
        ease: Quart.easeOut,
      },
      'in+=0.7',
    )
    tl.play('in')
  } else {
    tl.clear().add('out')
    tl.to(
      innerNode,
      0.8,
      {
        marginRight: '100%',
        ease: Quart.easeInOut,
      },
      'out',
    )
    tl.to(
      outerNode,
      0.8,
      {
        marginRight: '2000px',
        borderRadius: '0px 0px 0px 0px',
        ease: Quart.easeInOut,
      },
      'out+=0.3',
    )
    tl.to(
      outerNode,
      1,
      {
        x: '-200%',
        ease: Quart.easeInOut,
      },
      'out+=1.2',
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

// Thanks mintopia! (from musicparty client source)

function formatMs(ms: number) {
  const mins = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return mins + ':' + (seconds < 10 ? '0' : '') + seconds
}

function transitionNextToNow() {
  // Calculate the required animation distance.
  const musicNowWidth = refMusicNow.value?.offsetWidth

  dispMusicNext.value = repMusicNow?.data!

  musicTl.clear().add('start')

  musicTl.to(
    refMusicNow.value,
    {
      duration: 1,
      x: '-100%',
      ease: 'power4.inOut',
    },
    'start',
  )
  musicTl.to(
    refMusicNext.value,
    {
      duration: 1,
      x: `-${musicNowWidth!}`,
      ease: 'power4.inOut',
    },
    'start',
  )
  musicTl.add('pre-mid')
  musicTl.to(
    refMusicNextArt.value,
    {
      duration: 1,
      opacity: '100%',
    },
    'pre-mid+=0.5',
  )
  musicTl.to(
    refMusicNextArrow.value,
    {
      duration: 1,
      opacity: 0,
    },
    'pre-mid+=0.5',
  )
  musicTl.add('mid')
  musicTl.call(
    () => {
      // Set the new data to be correct.
      dispMusicNow.value = repMusicNow?.data!
      // Set the new next data to be correct.
      dispMusicNext.value = repMusicNext?.data!
    },
    undefined,
    'mid',
  )
  // Now: Make the progress bar invisible so we can fade it in gently. (this matches the design of Next)
  musicTl.set(refMusicNowProgress.value, { opacity: 0 }, 'mid')
  // Now: Snap back into its rightful place.
  musicTl.set(refMusicNow.value, { x: '0%' }, 'mid')
  // Next: Set to be invisible, so we can mess with it behind the scenes.
  musicTl.set(refMusicNext.value, { opacity: 0 }, 'mid')
  // Next: Set the art state to be correct for when Next takes up its mantle again.
  musicTl.set(
    refMusicNextArt.value,
    {
      opacity: 0,
    },
    'mid',
  )
  musicTl.set(
    refMusicNextArrow.value,
    {
      opacity: '100%',
    },
    'mid',
  )
  // Next: Move back to original place, and tween back into visibility.
  musicTl.set(refMusicNext.value, { x: '0%' }, 'mid')
  // Now: Fade the progress bar in.
  musicTl.to(
    refMusicNowProgress.value,
    {
      duration: 2,
      opacity: '100%',
    },
    'mid',
  )
  // Next: Fade back in.
  musicTl.to(
    refMusicNext.value,
    {
      duration: 1,
      opacity: '100%',
    },
    'mid+=2',
  )
  musicTl.play('start')
}

watch(
  () => (repMusicNow !== undefined ? repMusicNow.data : null),
  (newValue, oldValue) => {
    if (newValue !== null && newValue?.name !== oldValue?.name) {
      // const fieldValue = toValue(e) as ProjectorActive
      transitionNextToNow()
    } else if (!musicTl.isActive()) {
      dispMusicNow.value = repMusicNow?.data!
      dispMusicNext.value = repMusicNext?.data!
    }
  },
)
</script>

<template>
  <div>
    <div ref="wipe-outer" class="wipe-outer">
      <div ref="wipe-inner" class="wipe-inner container-fluid">
        <div id="music-data" class="row schedule-data">
          <div class="d-flex box-elem box-lead">
            <RiMusic2Fill
              size="60px"
              className="align-self-center"
            ></RiMusic2Fill>
          </div>
          <div
            id="music-now-box"
            ref="music-now"
            class="d-flex flex-column position-relative box-elem lead-music overflow-hidden"
          >
            <div class="art-bg h-100">
              <img :src="dispMusicNow?.album_art" />
            </div>
            <div class="music-inner ms-1">
              <div class="d-flex mt-n1 align-items-center schedule-header">
                <div class="d-flex flex-column">
                  <div class="px-2 py-0 mb-n2">
                    {{ dispMusicNow?.name }}
                  </div>
                  <div class="px-2 py-0 h5 m-0">
                    {{ dispMusicNow?.artist }}
                  </div>
                </div>
              </div>
              <div class="progress ms-2" ref="music-now-progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="`width: ${musicProgress}%`"
                ></div>
              </div>
            </div>
          </div>
          <div
            id="music-next-box"
            ref="music-next"
            class="d-flex flex-column position-relative box-elem lead-music overflow-hidden"
          >
            <div class="art-bg h-100">
              <img
                ref="music-next-art"
                style="opacity: 0%"
                class="music-art"
                :src="dispMusicNext?.album_art"
              />
              <div
                ref="music-next-arrow"
                class="music-art-arrow text-muted"
                style="opacity: 100%"
              >
                <RiArrowRightLine size="50px"></RiArrowRightLine>
              </div>
            </div>
            <div class="music-inner ms-1">
              <div class="d-flex mt-n1 align-items-center schedule-header">
                <div class="d-flex flex-column">
                  <div class="px-2 py-0 mb-n2">
                    {{ dispMusicNext?.name }}
                  </div>
                  <div class="px-2 py-0 h5 m-0">
                    {{ dispMusicNext?.artist }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
  top: 790px;
  left: 1425px;
  right: 10px;
  bottom: 210px;
  background-color: #fff;
  border-top: solid #fff 5px;
  border-bottom: solid #fff 5px;
  border-left: solid #fff 10px;
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
  /* Darker tBG color. */
  background-color: #262a5a;
  overflow: hidden;
}

.box-elem {
  padding-left: 5px;
  padding-right: 5px;
}

.box-lead {
  border-right: solid #fff 5px;
  background-color: #5762d7;
  z-index: 10;
}

.art-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.art-bg img {
  height: 100%;
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 90%,
    transparent 100%
  );
  /*noinspection CssInvalidPropertyValue*/
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 90%,
    transparent 100%
  );
}

.art-bg .music-art-arrow {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
}

.music-inner {
  position: relative;
  z-index: 2;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.75);
}

.progress-bar {
  transition: width 1s linear;
}

.schedule-data {
  flex-wrap: nowrap !important;
  height: 100%;
}

.box-border-left {
  border-left: solid #303030 1px;
}

.event-num {
  color: goldenrod;
  font-family: 'Arial Black', sans-serif;
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

.lead-music {
  padding-left: 0px;
  min-width: 400px;
}

.progress {
  width: 300px;
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

#sched-now-box {
  min-width: 500px;
}

.schedule-header {
  line-height: 1.25;
}

.schedule-content-main {
  font-weight: bold;
}

.schedule-next-outer {
  overflow: hidden;
}

.album-art {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
