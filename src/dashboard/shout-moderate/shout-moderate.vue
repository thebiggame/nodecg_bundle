<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable'
import { ShoutboxShout, ShoutboxShouts } from '@thebiggame/types/schemas'
import { QAvatar, QBtn, QList, QItem, QItemSection, QItemLabel } from 'quasar'

const repShoutboxMessages = useReplicant<ShoutboxShouts>(
  'shoutbox:messages',
  'thebiggame',
  {
    defaultValue: <ShoutboxShouts>{
      shouts: [],
    },
  },
)

function SaveShoutboxData() {
  repShoutboxMessages?.save()
}

function RevertShoutboxData() {
  repShoutboxMessages?.revert()
}

function DeleteShout(shout: ShoutboxShout) {
  if (repShoutboxMessages !== null && repShoutboxMessages !== undefined) {
    const targetIndex = repShoutboxMessages.data?.shouts.findIndex(
      (repShout) => repShout.id === shout.id,
    )
    if (targetIndex === -1) {
      console.error('failed to find shout with ID', shout.id)
      return
    }
    // Remove 1 element at the given index (the targeted shout).
    repShoutboxMessages.data?.shouts.splice(targetIndex, 1)
    SaveShoutboxData()
  }
}
</script>

<template>
  <div class="q-pa-md">
    <QList bordered>
      <QItem
        v-for="shout in repShoutboxMessages?.data?.shouts.slice(0, 10)"
        :key="shout.id"
        class="q-my-sm"
        clickable
        v-ripple
      >
        <QItemSection avatar>
          <QAvatar color="primary" text-color="white">
            <img
              class="img-fluid rounded avatar"
              :src="shout.user.avatar_url"
              alt="?"
            />
          </QAvatar>
        </QItemSection>

        <QItemSection>
          <QItemLabel>{{ shout.message }}</QItemLabel>
          <QItemLabel caption lines="1">{{ shout.user.name }}</QItemLabel>
        </QItemSection>

        <QItemSection side>
          <QBtn @click="DeleteShout(shout)" icon="clear" color="red">
            DELETE
          </QBtn>
        </QItemSection>
      </QItem>
    </QList>
  </div>
</template>
