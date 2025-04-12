<script setup lang="ts">
import {
  Configschema,
  ShoutboxShouts,
  ProjectorActive,
} from '@thebiggame/types/schemas'
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable'
import { gsap, Quart } from 'gsap'
import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import { RiInformationFill } from '@remixicon/vue'

const config = nodecg.bundleConfig as Configschema

const tl = gsap.timeline({ autoRemoveChildren: true })

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repShoutboxMessages = useReplicant<ShoutboxShouts>(
  'shoutbox:messages',
  'thebiggame',
  {
    defaultValue: <ShoutboxShouts>{
      shouts: [],
    },
  },
)

nodecg.listenFor('shoutbox:message', (data) => {
  console.log(data)
})

const refElemOuter = useTemplateRef('shoutbox-outer')
const refElemInner = useTemplateRef('shoutbox-inner')

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
        borderRadius: '0px 15px 15px 0px',
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
      'in+=0.75',
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
        y: '-100%',
        ease: Quart.easeInOut,
      },
      'out+=0.75',
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

<template>
  <div>
    <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
    <div ref="shoutbox-outer" class="shoutbox-outer" id="shoutbox">
      <div
        ref="shoutbox-inner"
        class="shoutbox-inner pl-0 pr-0 container-fluid d-flex flex-column-reverse justify-content-start align-items-end"
      >
        <TransitionGroup tag="div" name="list-join" class="">
          <div class="w-100 rounded-0 p-0 card text-dark bg-light">
            <div class="card-header d-flex align-items-center p-2">
              <img
                class="img-fluid rounded-lg avatar"
                src="./entrapta.jpg"
                alt="duck."
              />
              <div class="pl-2 text-muted">duck.</div>
              <div class="ml-auto text-muted text-time">00:30</div>
            </div>
            <div class="card-body card-text p-2">
              Welcome to theBIGGAME 53, featuring this shiny new shoutbox!
            </div>
          </div>
        </TransitionGroup>
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

.shoutbox-outer {
  position: absolute;
  overflow: hidden;
  top: 10px;
  left: 1425px;
  right: 10px;
  bottom: 300px;
  background-color: #fff;
  border-top: solid #fff 5px;
  border-bottom: solid #fff 5px;
  border-left: solid #fff 10px;
  border-right: solid #fff 5px;
  border-radius: 0px 15px 15px 0px;
}

.shoutbox-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 24px;
  color: white;
  background-color: #282c5d;
  overflow: hidden;
}

img.avatar {
  height: 40px;
  width: 40px;
}

.text-time {
  font-family: 'DSEG14 Classic', 'Archivo Variable', sans-serif;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}

.list-join-move,
.list-join-enter-active,
.list-join-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-join-enter-from,
.list-join-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* ensure leaving items are taken out of layout flow so that moving animations can be calculated correctly */
.list-join-leave-active {
  position: absolute;
}
</style>
