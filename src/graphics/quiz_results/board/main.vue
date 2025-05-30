<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable'
import Title from './title.vue'
import Row from './row.vue'
import { QuizScoreData } from '@thebiggame/types/schemas/quizScoreData'

const repQuizScoreData = useReplicant<QuizScoreData>(
  'quiz:scores:data',
  'thebiggame',
)
</script>

<style scoped lang="scss">
.row {
  @include tbg-bar-outer(20px, 5px);
  left: 50px;
  right: 50px;
}

.pos1 {
  top: 280px;
  bottom: 660px;
}

.pos2 {
  top: 440px;
  bottom: 500px;
}

.pos3 {
  top: 600px;
  bottom: 340px;
}

.pos4 {
  top: 760px;
  bottom: 180px;
}

.pos5 {
  top: 920px;
  bottom: 20px;
}
</style>

<template>
  <div>
    <Title />
    <Row
      :position="1"
      :score="repQuizScoreData?.data?.team1?.score"
      class="row pos1"
      :active="repQuizScoreData?.data?.team1?.active"
      >{{ repQuizScoreData?.data?.team1?.name }}
    </Row>
    <Row
      :position="2"
      :score="repQuizScoreData?.data?.team2?.score"
      class="row pos2"
      :active="repQuizScoreData?.data?.team2?.active"
      >{{ repQuizScoreData?.data?.team2?.name }}
    </Row>
    <Row
      :position="3"
      :score="repQuizScoreData?.data?.team3?.score"
      class="row pos3"
      :active="repQuizScoreData?.data?.team3?.active"
      >{{ repQuizScoreData?.data?.team3?.name }}
    </Row>
    <Row
      :position="4"
      :score="repQuizScoreData?.data?.team4?.score"
      class="row pos4"
      :active="repQuizScoreData?.data?.team4?.active"
      >{{ repQuizScoreData?.data?.team4?.name }}
    </Row>
    <Row
      :position="5"
      :score="repQuizScoreData?.data?.team5?.score"
      class="row pos5"
      :active="repQuizScoreData?.data?.team5?.active"
      >{{ repQuizScoreData?.data?.team5?.name }}
    </Row>
  </div>
</template>
