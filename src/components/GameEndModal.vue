<script setup lang="ts">
// End-game modal with score summary
const props = defineProps<{
  totalScore: number
  roundScores: number[]
  finalBonuses: {
    squares: number
    factories: number
    squareDetails: Array<{ row: number; col: number; points: number; reason: string }>
    factoryDetails: Array<{ row: number; col: number; points: number; reason: string }>
  }
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

// Sum of points from all rounds
const roundTotal = props.roundScores.reduce((sum, score) => sum + score, 0)

// Emoji based on score
const getEmoji = (score: number): string => {
  if (score >= 100) return '🏆🎉'
  if (score >= 80) return '🎊✨'
  if (score >= 60) return '🌟'
  if (score >= 40) return '👍'
  return '💪'
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content end-game">
      <div class="modal-header">
        <h1>{{ getEmoji(props.totalScore) }} Gratulacje! {{ getEmoji(props.totalScore) }}</h1>
        <p class="subtitle">Gra zakończona</p>
      </div>

      <div class="modal-body">
        <div class="final-score">
          <h2>Twój końcowy wynik:</h2>
          <p class="total-points">{{ props.totalScore }} punktów</p>
        </div>

        <div class="score-breakdown">
          <h3>Szczegóły punktacji:</h3>

          <div class="breakdown-item">
            <span class="label">🏘️ Punkty z rund (1-9):</span>
            <span class="value">{{ roundTotal }} pkt</span>
          </div>

          <div class="breakdown-separator"></div>

          <div class="breakdown-item bonus" :class="{ positive: props.finalBonuses.squares > 0 }">
            <span class="label">⬜ Bonusy za place ({{ props.finalBonuses.squareDetails.length }}):</span>
            <span class="value">{{ props.finalBonuses.squares >= 0 ? '+' : '' }}{{ props.finalBonuses.squares }} pkt</span>
          </div>

          <!-- Szczegóły placów -->
          <div v-if="props.finalBonuses.squareDetails.length > 0" class="details-section">
            <div v-for="(detail, index) in props.finalBonuses.squareDetails" :key="`square-${index}`" class="detail-item" :class="{ positive: detail.points > 0, zero: detail.points === 0 }">
              <span class="detail-label">Plac [{{ detail.row + 1 }},{{ detail.col + 1 }}]:</span>
              <span class="detail-reason">{{ detail.reason }}</span>
              <span class="detail-points">{{ detail.points >= 0 ? '+' : '' }}{{ detail.points }}pkt</span>
            </div>
          </div>

          <div class="breakdown-separator"></div>

          <div class="breakdown-item bonus" :class="{ positive: props.finalBonuses.factories > 0, negative: props.finalBonuses.factories < 0 }">
            <span class="label">🏭 Punkty za fabryki ({{ props.finalBonuses.factoryDetails.length }}):</span>
            <span class="value">{{ props.finalBonuses.factories >= 0 ? '+' : '' }}{{ props.finalBonuses.factories }} pkt</span>
          </div>

          <!-- Szczegóły fabryk -->
          <div v-if="props.finalBonuses.factoryDetails.length > 0" class="details-section">
            <div v-for="(detail, index) in props.finalBonuses.factoryDetails" :key="`factory-${index}`" class="detail-item" :class="{ positive: detail.points > 0, negative: detail.points < 0, zero: detail.points === 0 }">
              <span class="detail-label">Fabryka [{{ detail.row + 1 }},{{ detail.col + 1 }}]:</span>
              <span class="detail-reason">{{ detail.reason }}</span>
              <span class="detail-points">{{ detail.points >= 0 ? '+' : '' }}{{ detail.points }}pkt</span>
            </div>
          </div>
        </div>

        <div class="rounds-summary">
          <h4>Punkty z poszczególnych rund:</h4>
          <div class="rounds-grid">
            <div v-for="(score, index) in props.roundScores" :key="`round-${index}`" class="round-item">
              <span class="round-label">R{{ index + 1 }}</span>
              <span class="round-score">{{ score }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('restart')" class="btn-restart">
          🔄 Zagraj ponownie
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped src="../assets/end-game.css"></style>
