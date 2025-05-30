<script setup lang="ts">
import { ExampleType } from '@thebiggame/types'
import {
  Configschema,
  ProjectorActive,
  ProjectorDarkMode,
} from '@thebiggame/types/schemas'
import { useHead } from '@vueuse/head'
import { useReplicant } from 'nodecg-vue-composable'
import { QToggle } from 'quasar'

// Set the title of this page.
useHead({ title: 'example' })

// Helper composable to make accessing/modifying replicants easier.
// For more information see https://github.com/Dan-Shields/nodecg-vue-composable
const repProjectorActive = useReplicant<ProjectorActive>(
  'projector:active',
  'thebiggame',
)

const repProjectorDarkMode = useReplicant<ProjectorDarkMode>(
  'projector:darkmode',
  'thebiggame',
)

// Access the bundle configuration with types.
const config = nodecg.bundleConfig as Configschema

// Accessing normal types.
const exampleType: ExampleType = { exampleProperty: 'exampleString' }
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <QToggle
        size="xl"
        v-model="repProjectorActive!.data"
        val="xl"
        label="Projector Graphics Visibility"
        checked-icon="check"
        unchecked-icon="clear"
        @click="repProjectorActive!.save()"
      />
      <QToggle
        size="xl"
        v-model="repProjectorDarkMode!.data"
        val="xl"
        label="Dark Mode"
        checked-icon="check"
        unchecked-icon="clear"
        @click="repProjectorDarkMode!.save()"
      />
    </div>
  </div>
</template>
