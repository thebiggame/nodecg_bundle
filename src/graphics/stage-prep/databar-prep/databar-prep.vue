<script setup lang="ts">
import { Configschema, MusicData } from '@thebiggame/types/schemas'
import { useReplicant } from 'nodecg-vue-composable'
import { gsap } from 'gsap'

import { RiMusic2Fill, RiUserLine, RiProjector2Line } from '@remixicon/vue'

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema

const versionString = 'Bundle-' + nodecg.bundleVersion

// Accessing normal types.
// const exampleType: ExampleType = { exampleProperty: 'exampleString' };

const tl = gsap.timeline({ autoRemoveChildren: true })
const repMusicData = useReplicant<MusicData>('music:now', 'thebiggame')
</script>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.wipe-outer {
  @include tbg-bar-outer(20px, 5px, 150px);
  top: 990px;
  left: 10px;
  right: 10px;
  bottom: 5px;
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
          <div id="wipe-title" class="d-flex box-elem">
            <b class="event-num align-self-center">{{ config.event_num }}</b>
          </div>
          <div class="flex-fill d-flex align-items-center">
            <div id="version">
              <RiProjector2Line
                size="50px"
                className="align-self-center anim-wiggle mx-2"
              ></RiProjector2Line>
              <span>
                <b class="pe-2">NG-TBG</b>
                <i>{{ versionString }}</i>
              </span>
            </div>
            <div id="music" class="ms-auto me-2">
              <RiMusic2Fill
                size="50px"
                className="align-self-center anim-wiggle me-2"
              ></RiMusic2Fill>
              <span id="music-title">{{ repMusicData?.data?.name }}</span>
              <RiUserLine
                size="50px"
                className="align-self-center ms-4 me-2"
              ></RiUserLine>
              <span id="music-artist">{{ repMusicData?.data?.artist }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
