<script setup lang="ts">
import {
  Configschema,
  ScheduleData,
  ProjectorActive,
} from '@thebiggame/types/schemas'
import { gsap, Quart } from 'gsap'
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable'
import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import {
  RiArrowRightLine,
  RiCalendarScheduleLine,
  RiCalendarTodoLine,
} from '@remixicon/vue'

const config = nodecg.bundleConfig as Configschema

const tl = gsap.timeline({ autoRemoveChildren: true })

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repScheduleData = useReplicant<ScheduleData>(
  'schedule:data',
  'thebiggame',
)

// Refs
const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')

const refSchedNextOuter = useTemplateRef('sched-next-outer')
const refSchedNextInner = useTemplateRef('sched-next-inner')

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

function _formatTargetTime(start: string, end: string): string {
  if (_eventIsPast(end)) {
    return 'Please wait'
  } else if (_eventIsNow(start, end)) {
    return 'Now'
  } else {
    return _formatTime(start)
  }
}

function _formatTime(timestamp: string): string {
  var time = new Date(timestamp)
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function _eventIsFuture(start: string): boolean {
  var dStart = new Date(start)
  var now = new Date()

  return now <= dStart
}

function _eventIsNow(start: string, end: string): boolean {
  var dStart = new Date(start)
  var dEnd = new Date(end)
  var now = new Date()

  return dStart <= now && now <= dEnd
}

function _eventIsPast(end: string): boolean {
  var dEnd = new Date(end)
  var now = new Date()

  return dEnd <= now
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

function getTimeUntil(time: string): number | undefined {
  var now = new Date()
  var target = new Date(time)
  var delta = Math.abs(target.getTime() - now.getTime())
  var deltaSeconds = Math.floor(delta / 1000)
  if (deltaSeconds >= 0) {
    return deltaSeconds
  } else {
    return 0
  }
}

function _formatSeconds(delta: number | undefined): string | undefined {
  if (delta == undefined) {
    return ''
  }
  // https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400)
  delta -= days * 86400

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60

  // what's left is seconds
  var seconds = Math.floor(delta % 60)

  if (days > 0) {
    // There are days at play
    return days + ' day' + (days > 1 ? 's' : '')
  } else if (hours > 0) {
    // Hours remain
    return hours + ' hour' + (hours > 1 ? 's' : '')
  } else if (minutes > 0) {
    // Minutes remain!
    return minutes + ' minute' + (minutes > 1 ? 's' : '')
  } else if (seconds > 0) {
    // Really not long!
    return 'shortly'
  }
}

function initSlideshow() {
  const showNextSlide = () => {
    const slideOuter = refSchedNextOuter.value
    const slideInner = refSchedNextInner.value

    if (slideOuter == null || slideInner == null) {
      return
    }

    // Calculate the required animation distance.
    const slideOuterWidth = slideOuter.offsetWidth
    const slideInnerWidth = slideInner.offsetWidth

    const availableSpace = slideOuterWidth - slideInnerWidth

    // If this is a positive integer, then there is empty space - animation not required.
    if (availableSpace > 0) {
      // Call again in 10 seconds to see if we need to move then.
      setTimeout(showNextSlide, 10000)
      return
    }

    // Otherwise, we need to animate to show the whole bar.

    tl.clear()
    tl.to(
      slideInner,
      {
        duration: 20,
        x: availableSpace + 'px',
        ease: 'sine.inOut',
      },
      '>',
    )
    tl.to(
      slideInner,
      {
        duration: 1,
        opacity: 0,
      },
      '>3',
    )
    tl.set(slideInner, { x: '0px' }, '>0.5')
    tl.to(
      slideInner,
      {
        duration: 1,
        opacity: 1,
      },
      '>',
    )
    // Wait a configurable number of seconds before calling the slider again.
    tl.call(
      showNextSlide,
      undefined,
      '>' +
        (config.stage.schedule_scroll_interval != null
          ? config.stage.schedule_scroll_interval
          : 10),
    )
  }

  // Short delay to allow for initialisation.
  setTimeout(showNextSlide, 1000)
}

onMounted(() => {
  // Initialise message slideshow handlers
  initSlideshow()
})
</script>

<template>
  <div>
    <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
    <div ref="wipe-outer" class="wipe-outer">
      <div ref="wipe-inner" class="wipe-inner container-fluid p-0">
        <div id="schedule-data" class="d-flex schedule-data">
          <div
            id="sched-now-box"
            v-bind:class="{
              'bg-warning': _eventIsPast(repScheduleData?.data?.now.ts_end!),
              'bg-primary': _eventIsNow(
                repScheduleData?.data?.now.ts_start!,
                repScheduleData?.data?.now.ts_end!,
              ),
              'bg-dark': _eventIsFuture(repScheduleData?.data?.now.ts_start!),
            }"
            class="d-flex flex-column box-elem box-elem-sched-now"
          >
            <div class="d-flex align-items-center mt-n1 schedule-header">
              <RiCalendarTodoLine
                class="icon-lead pe-0"
                size="50px"
              ></RiCalendarTodoLine>
              <RiArrowRightLine class="icon-lead pe-1" size="50px">
              </RiArrowRightLine>
              <div
                id="sched-now-time"
                v-bind:class="{
                  'alert-warning': _eventIsPast(
                    repScheduleData?.data?.now.ts_end!,
                  ),
                  'alert-success': _eventIsNow(
                    repScheduleData?.data?.now.ts_start!,
                    repScheduleData?.data?.now.ts_end!,
                  ),
                  'alert-secondary': _eventIsFuture(
                    repScheduleData?.data?.now.ts_start!,
                  ),
                }"
                class="alert px-1 py-0 my-0 mx-2"
              >
                {{
                  _formatTargetTime(
                    repScheduleData?.data?.now.ts_start!,
                    repScheduleData?.data?.now.ts_end!,
                  )
                }}
                <template
                  v-if="
                    _eventIsNow(
                      repScheduleData?.data?.now.ts_start!,
                      repScheduleData?.data?.now.ts_end!,
                    )
                  "
                >
                  <RiArrowRightLine
                    class="icon-lead px-0"
                    size="50px"
                  ></RiArrowRightLine>
                  {{ _formatTime(repScheduleData?.data?.now.ts_end!) }}
                </template>
              </div>
              <div
                id="sched-now-time"
                class="alert alert-dark text-50 px-1 py-0 my-0 mx-2"
                v-if="_eventIsFuture(repScheduleData?.data?.now.ts_start!)"
              >
                {{
                  _formatSeconds(
                    getTimeUntil(repScheduleData?.data?.now.ts_start!),
                  )
                }}
              </div>
            </div>
            <div class="d-flex">
              <p
                id="sched-now-content"
                class="d-flex-shrink-1 px-2 schedule-content-main"
              >
                {{ repScheduleData?.data?.now.title }}
              </p>
            </div>
          </div>
          <div
            ref="sched-next-outer"
            class="d-flex flex-fill schedule-next-outer"
          >
            <div ref="sched-next-inner" class="d-flex">
              <template
                v-for="(item, index) in repScheduleData?.data?.upcoming"
                :key="index"
              >
                <div class="is-sched-item box-elem">
                  <div
                    class="d-flex align-items-center mt-n1 me-5 schedule-header"
                  >
                    <RiCalendarScheduleLine
                      class="pe-2 text-white-50"
                      size="50px"
                    ></RiCalendarScheduleLine>
                    <template v-if="!_eventIsToday(item.ts_start)">
                      <span class="alert alert-info h5 px-1 py-1 m-0 me-2">{{
                        _formatDay(item.ts_start)
                      }}</span>
                    </template>
                    <div class="alert alert-secondary px-1 py-0 m-0">
                      {{ _formatTime(item.ts_start)
                      }}<small>
                        <RiArrowRightLine
                          class="icon-lead px-0"
                          size="40px"
                        ></RiArrowRightLine>
                        {{ _formatTime(item.ts_end) }}</small
                      >
                    </div>
                  </div>
                  <div class="d-flex">
                    <p class="d-flex-shrink-1 px-2 schedule-content">
                      {{ item.title }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.wipe-outer {
  @include tbg-bar-outer(20px, 5px);
  top: 860px;
  left: 10px;
  right: 10px;
  bottom: 110px;
  white-space: nowrap;
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
  background-color: $color-tbg-dark;
  overflow: hidden;
}

#wipe-title {
  font-size: 45px;
  font-weight: 300;
  font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
  text-shadow: rgba(0, 0, 0, 0.5) 0 0 20px;
  background-color: $color-tbg-primary;
  border-right: solid #ffffff 2px;
}

.box-elem {
  height: 160px;
  border-left: solid #ffffff 2px;
  padding-left: 5px;
  padding-right: 5px;
  min-width: 300px;
}

.box-elem-sched-now {
  border-right: solid #ffffff 5px;
}

.schedule-data {
  flex-wrap: nowrap !important;
}

.box-border-left {
  border-left: solid #303030 1px;
}

.event-num {
  color: $color-tbg-event-highlight;
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

.is-sched-item {
  min-width: 100px;
}
</style>
