<script setup lang="ts">
import { ScoreboardActive, ScoreboardData } from '@thebiggame/types/schemas'
import { useReplicant } from 'nodecg-vue-composable'
import { QToggle, QInput } from 'quasar'

const repScoreboardActive = useReplicant<ScoreboardActive>(
  'scoreboard:active',
  'thebiggame',
)

const repScoreboardData = useReplicant<ScoreboardData>(
  'scoreboard:data',
  'thebiggame',
)

function SaveScoreboardData() {
  repScoreboardData?.save()
}

function RevertScoreboardData() {
  repScoreboardData?.revert()
}
</script>

<template>
  <div class="q-pa-sm">
    <div class="q-gutter-sm">
      <QInput
        :model-value="repScoreboardData?.data?.team1?.name!"
        @update:modelValue="
          (value) => {
            if (repScoreboardData?.data?.team1 !== undefined) {
              repScoreboardData.data.team1.name = value!.toString()
            }
          }
        "
        label="Team 1"
        filled
      />
      <QInput
        :model-value="repScoreboardData?.data?.team2?.name!"
        @update:modelValue="
          (value) => {
            if (repScoreboardData?.data?.team2 !== undefined) {
              repScoreboardData.data.team2.name = value!.toString()
            }
          }
        "
        label="Team 2"
        filled
      />
    </div>
    <div class="q-gutter-sm">
      <QBtnGroup>
        <QBtn
          :disabled="!repScoreboardData!.changed"
          @click="SaveScoreboardData()"
          icon="check"
          color="green"
        >
          SAVE
        </QBtn>
        <QBtn
          :disabled="!repScoreboardData!.changed"
          @click="RevertScoreboardData()"
          icon="clear"
          color="red"
        >
          REVERT CHANGES
        </QBtn>
      </QBtnGroup>
    </div>
    <div class="q-gutter-sm">
      <QInput
        :model-value="repScoreboardData?.data?.team1?.score!"
        @update:modelValue="
          (value) => {
            if (repScoreboardData?.data?.team1 !== undefined) {
              repScoreboardData.data.team1.score = value as number
              repScoreboardData.save()
            }
          }
        "
        label="Team 1 Score"
        type="number"
      />
      <QBtnGroup>
        <QBtn
          :disabled="repScoreboardData!.changed"
          @click="
            ((repScoreboardData!.data!.team1!.score! += 1),
            repScoreboardData?.save())
          "
          icon="add"
          color="green"
        >
        </QBtn>
        <QBtn
          :disabled="repScoreboardData!.changed"
          @click="
            ((repScoreboardData!.data!.team1!.score! -= 1),
            repScoreboardData?.save())
          "
          icon="remove"
          color="red"
        >
        </QBtn>
      </QBtnGroup>
    </div>
    <div class="q-gutter-md">
      <QInput
        :model-value="repScoreboardData?.data?.team2?.score!"
        @update:modelValue="
          (value) => {
            if (repScoreboardData?.data?.team2 !== undefined) {
              repScoreboardData.data.team2.score = value as number
              repScoreboardData.save()
            }
          }
        "
        label="Team 2 Score"
        type="number"
      />
      <QBtnGroup>
        <QBtn
          :disabled="repScoreboardData!.changed"
          @click="
            ((repScoreboardData!.data!.team2!.score! += 1),
            repScoreboardData?.save())
          "
          icon="add"
          color="green"
        >
        </QBtn>
        <QBtn
          :disabled="repScoreboardData!.changed"
          @click="
            ((repScoreboardData!.data!.team2!.score! -= 1),
            repScoreboardData?.save())
          "
          icon="remove"
          color="red"
        >
        </QBtn>
      </QBtnGroup>
    </div>
    <div class="q-gutter-sm">
      <QToggle
        size="xl"
        v-model="repScoreboardActive!.data"
        :disable="repScoreboardData!.changed"
        val="xl"
        label="Show Element"
        checked-icon="check"
        unchecked-icon="clear"
        @click="repScoreboardActive!.save()"
      />
    </div>
  </div>
</template>
