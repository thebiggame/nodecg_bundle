<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable'
import { QToggle, QInput } from 'quasar'
import { QuizScoreData } from '@thebiggame/types/schemas/quizScoreData'

const repQuizScoreData = useReplicant<QuizScoreData>(
  'quiz:scores:data',
  'thebiggame',
)

function SaveScoreboardData() {
  repQuizScoreData?.save()
}

function RevertScoreboardData() {
  repQuizScoreData?.revert()
}
</script>

<template>
  <!--
  This is implemented atrociously. Please, never ever do this. I was lazy, and it's going to bite me in the bum at some point.
  If you feel inclined, please make this less atrocious.
  -->
  <div class="q-pa-sm">
    <div class="q-gutter-sm row items-center">
      <QInput
        :model-value="repQuizScoreData?.data?.team1?.name!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team1 !== undefined) {
              repQuizScoreData.data.team1.name = value!.toString()
            }
          }
        "
        label="Team Name"
        class="col-4"
        filled
      />
      <QInput
        :model-value="repQuizScoreData?.data?.team1?.score!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team1 !== undefined) {
              repQuizScoreData.data.team1.score = value as number
            }
          }
        "
        label="Score"
        filled
      />
      <QToggle
        size="xl"
        :model-value="repQuizScoreData?.data?.team1?.active!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team1 !== undefined) {
              repQuizScoreData.data.team1.active = value! as boolean
            }
          }
        "
        val="xl"
        label="Show 1st"
        checked-icon="check"
        unchecked-icon="clear"
        @click="SaveScoreboardData"
      />
    </div>
    <div class="q-gutter-sm row items-center">
      <QInput
        :model-value="repQuizScoreData?.data?.team2?.name!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team2 !== undefined) {
              repQuizScoreData.data.team2.name = value!.toString()
            }
          }
        "
        label="Team Name"
        class="col-4"
        filled
      />
      <QInput
        :model-value="repQuizScoreData?.data?.team2?.score!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team2 !== undefined) {
              repQuizScoreData.data.team2.score = value as number
            }
          }
        "
        label="Score"
        filled
      />
      <QToggle
        size="xl"
        :model-value="repQuizScoreData?.data?.team2?.active!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team2 !== undefined) {
              repQuizScoreData.data.team2.active = value! as boolean
            }
          }
        "
        val="xl"
        label="Show 2nd"
        checked-icon="check"
        unchecked-icon="clear"
        @click="SaveScoreboardData"
      />
    </div>
    <div class="q-gutter-sm row items-center">
      <QInput
        :model-value="repQuizScoreData?.data?.team3?.name!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team3 !== undefined) {
              repQuizScoreData.data.team3.name = value!.toString()
            }
          }
        "
        label="Team Name"
        class="col-4"
        filled
      />
      <QInput
        :model-value="repQuizScoreData?.data?.team3?.score!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team3 !== undefined) {
              repQuizScoreData.data.team3.score = value as number
            }
          }
        "
        label="Score"
        filled
      />
      <QToggle
        size="xl"
        :model-value="repQuizScoreData?.data?.team3?.active!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team3 !== undefined) {
              repQuizScoreData.data.team3.active = value! as boolean
            }
          }
        "
        val="xl"
        label="Show 3rd"
        checked-icon="check"
        unchecked-icon="clear"
        @click="SaveScoreboardData"
      />
    </div>
    <div class="q-gutter-sm row items-center">
      <QInput
        :model-value="repQuizScoreData?.data?.team4?.name!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team4 !== undefined) {
              repQuizScoreData.data.team4.name = value!.toString()
            }
          }
        "
        label="Team Name"
        class="col-4"
        filled
      />
      <QInput
        :model-value="repQuizScoreData?.data?.team4?.score!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team4 !== undefined) {
              repQuizScoreData.data.team4.score = value as number
            }
          }
        "
        label="Score"
        filled
      />
      <QToggle
        size="xl"
        :model-value="repQuizScoreData?.data?.team4?.active!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team4 !== undefined) {
              repQuizScoreData.data.team4.active = value! as boolean
            }
          }
        "
        val="xl"
        label="Show 4th"
        checked-icon="check"
        unchecked-icon="clear"
        @click="SaveScoreboardData"
      />
    </div>
    <div class="q-gutter-sm row items-center">
      <QInput
        :model-value="repQuizScoreData?.data?.team5?.name!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team5 !== undefined) {
              repQuizScoreData.data.team5.name = value!.toString()
            }
          }
        "
        label="Team Name"
        class="col-4"
        filled
      />
      <QInput
        :model-value="repQuizScoreData?.data?.team5?.score!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team5 !== undefined) {
              repQuizScoreData.data.team5.score = value as number
            }
          }
        "
        label="Score"
        filled
      />
      <QToggle
        size="xl"
        :model-value="repQuizScoreData?.data?.team5?.active!"
        @update:modelValue="
          (value) => {
            if (repQuizScoreData?.data?.team5 !== undefined) {
              repQuizScoreData.data.team5.active = value! as boolean
            }
          }
        "
        val="xl"
        label="Show 5th"
        checked-icon="check"
        unchecked-icon="clear"
        @click="SaveScoreboardData"
      />
    </div>
    <div class="q-gutter-sm">
      <QBtnGroup>
        <QBtn
          :disabled="!repQuizScoreData!.changed"
          @click="SaveScoreboardData()"
          icon="check"
          color="green"
        >
          SAVE
        </QBtn>
        <QBtn
          :disabled="!repQuizScoreData!.changed"
          @click="RevertScoreboardData()"
          icon="clear"
          color="red"
        >
          REVERT CHANGES
        </QBtn>
      </QBtnGroup>
    </div>
  </div>
</template>
