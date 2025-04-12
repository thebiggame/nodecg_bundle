<script setup lang="ts">
import { ExampleType } from '@thebiggame/types'
import { Configschema, AlertData, AlertActive } from '@thebiggame/types/schemas'
import { useHead } from '@vueuse/head'
import { useReplicant } from 'nodecg-vue-composable'
import { QToggle, QInput } from 'quasar'

let repNotifyAlertData = useReplicant<AlertData>(
  'notify:alert:data',
  'thebiggame',
)

const emit = defineEmits(['update:ModelValue'])

let repNotifyAlertActive = useReplicant<AlertActive>(
  'notify:alert:active',
  'thebiggame',
)

function toggleAlert() {
  if (repNotifyAlertActive === undefined || repNotifyAlertData === undefined) {
    return
  }
  repNotifyAlertData.save()
  // Invert value.
  repNotifyAlertActive.data = !repNotifyAlertActive.data
  repNotifyAlertActive.save()
}
</script>

<template>
  <div class="q-pa-md">
    <div>
      <QInput
        :disable="repNotifyAlertActive?.data"
        :model-value="repNotifyAlertData?.data?.body!"
        @update:modelValue="
          (value) => {
            if (repNotifyAlertData?.data !== undefined) {
              repNotifyAlertData.data.body = value!.toString()
            }
          }
        "
        type="text"
        label="Alert Name"
        :maxlength="40"
        filled
      />

      <QSeparator inset spaced />

      <QItem>
        <QItemSection>
          <QIcon name="timer" />
        </QItemSection>
        <QItemSection>
          <QSlider
            :disable="repNotifyAlertActive?.data"
            :model-value="repNotifyAlertData?.data?.delay!"
            @update:modelValue="
              (value) => {
                if (repNotifyAlertData?.data !== undefined) {
                  repNotifyAlertData.data.delay = value!
                }
              }
            "
            :min="0"
            :max="10"
            markers
            label
            :label-value="'Delay: ' + repNotifyAlertData?.data?.delay! + 's'"
          />
        </QItemSection>
      </QItem>
      <QToggle
        size="xl"
        :model-value="repNotifyAlertData?.data?.flair!"
        @update:modelValue="
          (value) => {
            if (repNotifyAlertData?.data !== undefined) {
              repNotifyAlertData.data.flair = value!
            }
          }
        "
        val="xl"
        label="Play with Flair (sound)"
        checked-icon="check"
        unchecked-icon="clear"
      />
      <QBanner v-if="repNotifyAlertData?.data?.flair" class="text-white bg-red"
        ><b>Flaired Alerts are very noisy!</b> Please use sparingly.
      </QBanner>
      <QBtnGroup>
        <QBtn
          :disabled="repNotifyAlertActive?.data"
          @click="toggleAlert()"
          icon="check"
          color="red"
        >
          SEND ALERT
        </QBtn>
        <QBtn
          :disabled="!repNotifyAlertActive?.data"
          @click="toggleAlert()"
          icon="clear"
          color="green"
        >
          END ALERT
        </QBtn>
      </QBtnGroup>
    </div>
  </div>
</template>
