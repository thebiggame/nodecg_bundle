<script setup lang="ts">
import { watch, toValue, useTemplateRef, computed } from 'vue'
import { gsap, Quart } from 'gsap'

const props = defineProps<{
  position?: number
  score?: number
  active?: boolean
}>()

const tl = gsap.timeline({ autoRemoveChildren: true })

const refElemOuter = useTemplateRef('wipe-outer')
const refElemInner = useTemplateRef('wipe-inner')

const posTrail = computed(() => {
  switch (props.position) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
})

function handleWipe(newVal: boolean) {
  const outerNode = refElemOuter.value
  const innerNode = refElemInner.value
  if (newVal) {
    tl.clear().add('in')
    tl.to(
      outerNode,
      0.2,
      {
        x: '0%',
        // marginRight: "0px",
        ease: Quart.easeOut,
      },
      'in',
    )
    tl.to(
      outerNode,
      0.75,
      {
        marginRight: '0px',
        borderRadius: '0px 150px 150px 0px',
        ease: Quart.easeOut,
      },
      'in+=0.2',
    )
    tl.to(
      innerNode,
      1,
      {
        marginRight: '0px',
        ease: Quart.easeOut,
      },
      'in+=0.4',
    )
    tl.play('in')
  } else {
    tl.clear().add('out')
    tl.to(
      innerNode,
      0.5,
      {
        marginRight: '100%',
        ease: Quart.easeInOut,
      },
      'out',
    )
    tl.to(
      outerNode,
      0.5,
      {
        marginRight: '1900px',
        borderRadius: '0px 0px 0px 0px',
        ease: Quart.easeInOut,
      },
      'out+=0.1',
    )
    tl.to(
      outerNode,
      1,
      {
        x: '-250%',
        ease: Quart.easeInOut,
      },
      'out+=1',
    )
    tl.play('out')
  }
}

watch(
  () => props.active,
  () => {
    console.log(props.active)
    handleWipe(toValue(props.active))
  },
)
</script>

<style scoped lang="scss">
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

.team-name {
  font-size: 50px;
  font-weight: 600;
  font-family: 'DSEG14 Classic', 'Archivo Variable', sans-serif;
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

.box-pos {
  height: 140px;
  border-left: solid #fff 2px;
  padding-left: 5px;
  padding-right: 20px;
  font-size: 40px;
  font-weight: 800;
  width: 130px;

  b {
    color: white;
    font-family: 'Archivo Variable', sans-serif;
    font-size: 100px;
    font-weight: 800;
  }
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

.pos1 {
  .box-elem-message {
    font-weight: 750;
  }

  .box-pos {
    background-color: darkgoldenrod;
    color: white;

    b {
      color: gold;
    }
  }
}

.pos2 {
  .box-pos {
    background-color: silver;
    color: black;
  }
}

.pos3 {
  .box-pos {
    background-color: saddlebrown;
    color: lightgrey;

    b {
      color: sandybrown;
    }
  }
}
</style>

<template>
  <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
  <div ref="wipe-outer" class="wipe-outer">
    <div ref="wipe-inner" class="wipe-inner container-fluid p-0">
      <div id="event-data" class="d-flex">
        <div class="d-flex box-elem box-pos">
          <span
            class="align-self-center"
            :class="position == 1 ? 'anim-wiggle' : null"
          >
            <b>{{ position }}</b
            >{{ posTrail }}
          </span>
        </div>
        <div
          id="message-box"
          ref="message-box"
          class="ps-4 d-flex box-elem-message align-items-center align-self-center"
        >
          <slot />
        </div>
        <div class="team-name ms-auto d-flex box-elem">
          <b class="pos-body align-self-center pe-3">{{ score }}</b>
        </div>
      </div>
    </div>
  </div>
</template>
