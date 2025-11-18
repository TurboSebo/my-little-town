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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content.end-game {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
  padding: 2.5rem;
  max-width: 600px;
  width: 90%;
  animation: slideUp 0.5s ease-out;
  color: white;
}

@keyframes slideUp {
  from {
    transform: translateY(100px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.final-score {
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.final-score h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.total-points {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.score-breakdown {
  background: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  max-height: 400px;
  overflow-y: auto;
}

.score-breakdown::-webkit-scrollbar {
  width: 8px;
}

.score-breakdown::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.score-breakdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.score-breakdown::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.score-breakdown h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  text-align: center;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
}

.breakdown-item.bonus {
  font-weight: bold;
}

.breakdown-item.positive .value {
  color: #4caf50;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.breakdown-item.negative .value {
  color: #f44336;
  text-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
}

.breakdown-separator {
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1rem 0;
}

.details-section {
  margin: 0.5rem 0 1rem 1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
}

.detail-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 0.5rem;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  align-items: center;
}

.detail-label {
  font-weight: bold;
  font-size: 0.85rem;
}

.detail-reason {
  font-size: 0.85rem;
  opacity: 0.9;
}

.detail-points {
  font-weight: bold;
  text-align: right;
  min-width: 60px;
}

.detail-item.positive .detail-points {
  color: #4caf50;
  text-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.detail-item.negative .detail-points {
  color: #f44336;
  text-shadow: 0 0 8px rgba(244, 67, 54, 0.4);
}

.detail-item.zero .detail-points {
  color: #9e9e9e;
}


.rounds-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.rounds-summary h4 {
  margin: 0 0 1rem 0;
  text-align: center;
  font-size: 1.1rem;
}

.rounds-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
}

.round-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

.round-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.round-score {
  font-size: 1.2rem;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-restart {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.btn-restart:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

.btn-restart:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .modal-content.end-game {
    padding: 1.5rem;
  }

  .modal-header h1 {
    font-size: 2rem;
  }

  .total-points {
    font-size: 3rem;
  }

  .rounds-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
