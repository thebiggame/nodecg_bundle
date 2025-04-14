<script setup lang="ts">
import {
  Configschema,
  EventInfoActive,
  EventInfoData,
  ProjectorActive,
} from '@thebiggame/types/schemas'
import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable'
import { gsap, Quart } from 'gsap'
import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import { RiInformationFill } from '@remixicon/vue'

const config = nodecg.bundleConfig as Configschema

const tl = gsap.timeline({ autoRemoveChildren: true })

const repAssetStageSlides = useAssetReplicant('stage-slides', 'thebiggame')

const gActive = useReplicant<ProjectorActive>('projector:active', 'thebiggame')

const repInfoBody = useReplicant<EventInfoData>('event:info:body', 'thebiggame')
const repInfoActive = useReplicant<EventInfoActive>(
  'event:info:active',
  'thebiggame',
)
// repInfoActive.on('change', (e) => {
//  this.handleInfoVisibilityChange(e);
// });

const refElemOuter = useTemplateRef('slideshow-outer')
const refElemInner = useTemplateRef('slideshow-inner')

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

function handleInfoVisibilityChange(newVal: boolean) {
  if (newVal) {
    // Play the announcement chime.
    setTimeout(() => {
      nodecg.playSound('announcementCue')
    }, 0)
  }
}

watch(
  () => (repInfoActive !== undefined ? repInfoActive.data : null),
  (e) => {
    if (e !== null) {
      const fieldValue = toValue(e) as EventInfoActive
      handleInfoVisibilityChange(fieldValue)
    }
  },
)

const refSlidesContainer = useTemplateRef('slides-container')

function initSlideshow() {
  if (refSlidesContainer.value === null) {
    return
  }
  const slidesOuter = refSlidesContainer.value.querySelectorAll('.is-slide')

  let currentSlideIndex = 0

  // gsap.set(slidesOuter, { x: '100%' })
  // gsap.set(slidesOuter[0], { x: '0%' })

  const showNextSlide = () => {
    if (refSlidesContainer.value === null) {
      return
    }
    const slides = refSlidesContainer.value.querySelectorAll('.is-slide')
    const totalSlides = slides.length
    const currentSlide = slides[currentSlideIndex]
    const nextSlideIndex = (currentSlideIndex + 1) % totalSlides
    const nextSlide = slides[nextSlideIndex]

    if (totalSlides >= 2) {
      // There are slides to animate between.
      gsap.to(currentSlide, {
        duration: 1.5,
        x: '-100%',
        ease: 'power4.inOut',
        onComplete: () => {
          gsap.set(currentSlide, { x: '100%' })
        },
      })

      gsap.to(nextSlide, {
        duration: 1.5,
        x: '0%',
        ease: 'power4.inOut',
        onComplete: () => {
          currentSlideIndex = nextSlideIndex
        },
      })
    }
  }
  setInterval(showNextSlide, config.stage.slideshow_interval * 1000)
}

onMounted(() => {
  // Initialise message slideshow handlers
  initSlideshow()
})
</script>

<template>
  <div>
    <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
    <div ref="slideshow-outer" class="slideshow-outer">
      <div ref="slideshow-inner" class="slideshow-inner container-fluid p-0">
        <div id="info" v-bind:class="{ 'd-none': !repInfoActive?.data }">
          <div class="d-flex pt-2">
            <div class="flex-shrink-0">
              <div class="icon-lead pr-3">
                <RiInformationFill size="120px"></RiInformationFill>
              </div>
            </div>
            <div class="flex-grow-1 ms-3 info-body" id="info-body">
              <b>{{ repInfoBody?.data }}</b>
            </div>
          </div>
        </div>
        <div
          id="slides"
          ref="slides-container"
          v-bind:class="{ 'd-none': repInfoActive?.data }"
        >
          <template v-if="repAssetStageSlides !== null">
            <img
              v-for="(slide, index) in repAssetStageSlides"
              class="is-slide is-asset-slide"
              style="transform: translate(100%, 0px)"
              :key="index"
              :src="slide.url"
            />
          </template>
          <template v-else>
            <div class="is-slide is-asset-slide" style="background-color: #000">
              <!-- This slide will be over-ridden by the NodeCG Replicant slides. -->
              No slides available. Please contact (i.e sulk at) your nearest
              member of tBG Crew.
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:host {
  @include tbg-bar-host;
}

.slideshow-outer {
  @include tbg-bar-outer(20px, 5px, 15px);
  top: 10px;
  left: 10px;
  right: 600px;
  bottom: 345px;
}

.slideshow-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 32px;
  color: white;
  background-color: #282c5d;
  overflow: hidden;
}

#slides {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.is-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.info-body {
  font-size: 75px;
  line-height: 125%;
  text-wrap: wrap;
  /* Chromism */
  white-space: pre-wrap;
  padding-right: 10px;
}
</style>
