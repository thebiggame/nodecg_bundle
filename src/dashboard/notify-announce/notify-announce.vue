<script setup lang="ts">
import { EventInfoData, EventInfoActive } from '@thebiggame/types/schemas'
import { useReplicant } from 'nodecg-vue-composable'
import { QToggle, QInput } from 'quasar'

const repEventInfoBody = useReplicant<EventInfoData>(
  'event:info:body',
  'thebiggame',
)

const repEventInfoActive = useReplicant<EventInfoActive>(
  'event:info:active',
  'thebiggame',
)
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-lg">
      <QBanner class="text-white bg-red"
        >Announcements make <b>noise</b> (a jingle)!
      </QBanner>
    </div>
    <div class="q-gutter-sm">
      <QInput
        v-model="repEventInfoBody!.data"
        label="Announcement Body"
        filled
        autogrow
      />
      <QBtnGroup>
        <QBtn
          :disabled="!repEventInfoBody!.changed"
          @click="repEventInfoBody!.save()"
          icon="check"
          color="green"
        >
          SAVE
        </QBtn>
        <QBtn
          :disabled="!repEventInfoBody!.changed"
          @click="repEventInfoBody!.revert()"
          icon="clear"
          color="red"
        >
          REVERT CHANGES
        </QBtn>
      </QBtnGroup>
      <QToggle
        size="xl"
        v-model="repEventInfoActive!.data"
        val="xl"
        label="Show Announcement"
        checked-icon="check"
        unchecked-icon="clear"
        @click="(repEventInfoBody!.save(), repEventInfoActive!.save())"
      />
    </div>
  </div>
</template>
