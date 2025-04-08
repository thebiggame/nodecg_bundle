<script setup lang="ts">
import { ExampleType } from '@thebiggame/types'
import {
  Configschema,
  EventInfoData,
  EventInfoActive,
  CountdownActive,
  CountdownData,
  CountdownName,
} from '@thebiggame/types/schemas'
import { useHead } from '@vueuse/head'
import { useReplicant } from 'nodecg-vue-composable'
import { ref } from 'vue'
import { QToggle, QInput } from 'quasar'

const repCountdownActive = useReplicant<CountdownActive>(
  'countdown:active',
  'thebiggame',
)

const repCountdownData = useReplicant<CountdownData>(
  'countdown:data',
  'thebiggame',
)
const repCountdownName = useReplicant<CountdownName>(
  'countdown:name',
  'thebiggame',
)

function SaveCountdownData() {
  repCountdownData?.save()
  repCountdownName?.save()
}

function RevertCountdownData() {
  repCountdownData?.revert()
  repCountdownName?.revert()
}
</script>

<template>
  <div class="q-pa-sm">
    <div class="q-gutter-sm">
      <QInput v-model="repCountdownName!.data" label="Countdown Name" filled />
      <QInput
        v-model="repCountdownData!.data"
        label="Countdown Time"
        filled
        type="number"
      />
    </div>
    <div class="q-gutter-sm">
      <QBtnGroup>
        <QBtn
          :disabled="!repCountdownData!.changed && !repCountdownName?.changed"
          @click="SaveCountdownData()"
          icon="check"
          color="green"
        >
          SAVE
        </QBtn>
        <QBtn
          :disabled="!repCountdownData!.changed && !repCountdownName?.changed"
          @click="RevertCountdownData()"
          icon="clear"
          color="red"
        >
          REVERT CHANGES
        </QBtn>
      </QBtnGroup>
      <QToggle
        size="xl"
        v-model="repCountdownActive!.data"
        :disable="repCountdownData!.changed || repCountdownName!.changed"
        val="xl"
        label="Run Countdown"
        checked-icon="check"
        unchecked-icon="clear"
        @click="repCountdownActive!.save()"
      />
    </div>
  </div>
</template>
