<script setup lang="ts">
import {
  Configschema,
  ProjectorActive,
  ScoreboardData,
  ScoreboardActive,
} from '@thebiggame/types/schemas'
import { useReplicant, useAssetReplicant } from 'nodecg-vue-composable'
import { watch, toValue, useTemplateRef } from 'vue'
import { gsap, Quart } from 'gsap'
import assetTBGText from './tbgText.svg?raw'
import { RiSwordLine } from '@remixicon/vue'

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema

const versionString = 'Bundle-' + nodecg.bundleVersion

const tl = gsap.timeline({ autoRemoveChildren: true })

const repAssetSponsorChips = useAssetReplicant('sponsor-chips', 'thebiggame')

const gActive = useReplicant<ScoreboardActive>(
  'scoreboard:active',
  'thebiggame',
)

const repScoreboardData = useReplicant<ScoreboardData>(
  'scoreboard:data',
  'thebiggame',
)

const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')

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
      0.5,
      {
        marginTop: '0px',
        borderRadius: '30px 30px 0px 0px',
        ease: Quart.easeOut,
      },
      'in+=0.2',
    )
    tl.to(
      innerNode,
      1,
      {
        marginTop: '0px',
        ease: Quart.easeOut,
      },
      'in+=0.4',
    )
    tl.play('in')
  } else {
    tl.clear().add('out')
    tl.to(
      innerNode,
      1,
      {
        marginTop: '100%',
        ease: Quart.easeInOut,
      },
      'out',
    )
    tl.to(
      outerNode,
      1,
      {
        y: '200%',
        borderRadius: '0px 0px 0px 0px',
        ease: Quart.easeInOut,
      },
      'out+=0.5',
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
</script>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.wipe-outer {
  @include tbg-bar-outer(20px, 5px);
  top: 990px;
  left: 0;
  right: 0;
  bottom: 0;
}

.wipe-outer {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;

  background-color: #fff;
  border-top: solid #fff 5px;
  border-bottom: solid #fff 10px;
  border-left: solid #fff 5px;
  border-right: solid #fff 5px;
  border-radius: 30px 30px 0px 0px;
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
  z-index: 1;
}

.wipe-title {
  font-size: 45px;
  font-weight: 300;
  font-family: 'Archivo Variable', 'Arial Black', 'Arial Bold', sans-serif;
  text-shadow: rgba(0, 0, 0, 0.5) 0 0 20px;
  background-color: $color-tbg-primary;
}

.box-elem {
  height: 75px;
  padding-left: 5px;
  padding-right: 5px;

  &.box-border-left {
    border-left: solid #fff 2px;
  }

  &.box-border-right {
    border-right: solid #fff 2px;
  }

  &.box-jewel {
    border-left: solid #fff 3px;
    border-right: solid #fff 3px;
  }
}

.box-elem-message {
  height: 75px;
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

.info-body {
  font-size: 45px;
  line-height: 125%;
  text-wrap: wrap;
  /* Chromism */
  white-space: normal;
}

.box-score {
  // font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
  font-family: 'DSEG14 Classic', 'Arial Black', 'Arial Bold', sans-serif;
  font-weight: 700;
  font-size: 60px;
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

.outer-bg {
  width: 100%;
  height: 100%;
  z-index: 0;
  font-size: 80px;
  font-weight: 600;
  font-family: 'Archivo Variable', 'Arial Black', 'Arial Bold', sans-serif;
  background-color: $color-tbg-dark;
}
</style>

<template>
  <div>
    <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
    <div ref="wipe-outer" class="wipe-outer">
      <div
        class="outer-bg h-100 d-flex flex-fill align-items-center justify-content-center"
      >
        theBIGGAME
        <b class="event-num align-self-center">{{ config.event_num }}</b>
      </div>
      <div ref="wipe-inner" class="wipe-inner container-fluid p-0">
        <div id="event-data" class="flex-fill d-flex">
          <div
            class="box-elem wipe-title box-border-right align-self-start d-flex box-elem"
          >
            <b class="event-num align-self-center">{{ config.event_num }}</b>
          </div>
          <div
            ref="score-box"
            class="flex-grow-1 d-flex box-elem-message align-items-center justify-content-center"
          >
            <div class="d-flex box-elem">
              <div class="align-self-center" id="clock">
                {{ repScoreboardData?.data?.team1?.name }}
              </div>
            </div>
            <div class="ms-4 d-flex box-elem box-jewel bg-dark">
              <div class="box-score align-self-center" id="clock">
                {{ repScoreboardData?.data?.team1?.score }}
              </div>
            </div>
            <div
              class="d-flex box-elem box-jewel bg-dark align-items-center justify-content-center"
            >
              <div class="icon-primary align-self-center">
                <RiSwordLine
                  size="75px"
                  className="icon-primary text-white-50 align-self-center p-0"
                ></RiSwordLine>
              </div>
            </div>
            <div class="me-4 d-flex box-elem box-jewel bg-dark">
              <div class="box-score align-self-center" id="clock">
                {{ repScoreboardData?.data?.team2?.score }}
              </div>
            </div>
            <div class="d-flex box-elem">
              <div class="align-self-center" id="clock">
                {{ repScoreboardData?.data?.team2?.name }}
              </div>
            </div>
          </div>
          <div
            class="box-elem box-border-left wipe-title align-self-end d-flex box-elem"
          >
            <svg
              v-html="assetTBGText"
              class="align-self-center m-1"
              width="50px"
              height="50px"
            ></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
