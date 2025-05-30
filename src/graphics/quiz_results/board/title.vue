<script setup lang="ts">
import { Configschema } from '@thebiggame/types/schemas'

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema
</script>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.wipe-outer {
  @include tbg-bar-outer(20px, 5px);
  top: 50px;
  left: 100px;
  right: 750px;
  bottom: 880px;
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
  font-family: 'Archivo Variable', sans-serif;
}

#wipe-title {
  font-size: 100px;
  font-weight: 300;
  font-family: 'Archivo Variable', 'Arial Black', 'Arial Bold', sans-serif;
  text-shadow: rgba(0, 0, 0, 0.5) 0 0 20px;
  background-color: $color-tbg-primary;
  border-right: solid #fff 2px;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
}

.box-elem {
  height: 140px;
  border-left: solid #fff 2px;
  padding-left: 5px;
  padding-right: 5px;
}

.box-elem-message {
  height: 140px;
  border-left: solid #fff 2px;
  font-size: 100px;
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
          <div
            id="message-box"
            ref="message-box"
            class="d-flex box-elem-message align-items-center align-self-center"
          >
            <b class="ps-4">Pub Quiz Results</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
