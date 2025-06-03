<script setup lang="ts">
import { Configschema } from '@thebiggame/types/schemas'
import { onMounted, useTemplateRef } from 'vue'
import { gsap } from 'gsap'
import assetTBGText from './tbgText.svg?raw'

const props = defineProps<{
  // Passing as a number is kinda garbo, but we need to do it for calculating font size.
  size: Number
}>()

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema

const refMessages = useTemplateRef('message-box')

const animStrings: string[] = [
  'bounce.out',
  'power4.inOut',
  'steps(8)',
  'expo.inOut',
  'back.inOut',
]

function getAnimString(): string {
  const ptr: number = Math.floor(Math.random() * animStrings.length)
  return animStrings[ptr]
}

function initSlideshow() {
  if (refMessages.value === null) {
    return
  }
  let slides = refMessages.value.querySelectorAll('.is-message')

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

      // Pick the animation type randomly.
      let animation = getAnimString()
      console.log('tweening with: ' + animation)
      gsap.to(currentSlide, {
        duration: 1,
        y: '-100%',
        ease: animation,
        onComplete: () => {
          gsap.set(currentSlide, { y: '100%' })
        },
      })

      gsap.to(nextSlide, {
        duration: 1,
        y: '0%',
        ease: animation,
        onComplete: () => {
          if (shouldStepForward) {
            currentSlideIndex = nextSlideIndex
          }
        },
      })
    }
  }

  setInterval(showNextSlide, config.stage.brandchip_interval)
}

onMounted(() => {
  // Initialise message slideshow handlers
  initSlideshow()
})
</script>
<style scoped lang="scss">
.box-elem {
  aspect-ratio: 1/1;
  border-left: solid #fff 2px;
  padding-left: 5px;
  padding-right: 5px;
  font-family: 'Archivo Variable', 'Arial Black', 'Arial Bold', sans-serif;
  text-shadow: rgba(0, 0, 0, 0.5) 0 0 20px;
  background-color: $color-tbg-primary;
  border-right: solid #fff 2px;
}

.is-message {
  position: absolute;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.event-num {
  color: $color-tbg-event-highlight;
  font-weight: 800;
}
</style>

<template>
  <div
    ref="message-box"
    class="d-flex box-elem message-box align-items-center justify-content-center"
    :style="{ height: props.size, 'font-size': props.size * 0.6 + 'px' }"
  >
    <div
      class="is-message event-num d-flex align-self-center align-items-center"
    >
      {{ config.event_num }}
    </div>
    <div class="is-message">
      <svg
        v-html="assetTBGText"
        class="align-self-center"
        :width="props.size * 0.7"
        :height="props.size * 0.7"
      ></svg>
    </div>
  </div>
</template>
