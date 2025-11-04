<script setup lang="ts">
import { computed } from 'vue'

// NOWE: Definicja propów
const props = defineProps<{
  roundScores: number[]
  currentRound: number
  usedBonusRounds: Set<number>
  isPlanning: boolean // NOWE: Czy jesteśmy w fazie planowania
}>()

// Sprawdzenie czy runda ma bonus (gwiazdka)
const hasBonus = (round: number): boolean => {
  return [3, 6, 9].includes(round)
}

// Sprawdzenie czy bonus został użyty
const isBonusUsed = (round: number): boolean => {
  return props.usedBonusRounds.has(round)
}

// NOWE: Obliczenie całkowitej ilości punktów
const totalPoints = computed(() => {
  return props.roundScores.reduce((sum, score) => sum + score, 0)
})
</script>

<template>
  <div class="round-scores-container">
    <h3 v-if="!props.isPlanning">Punktacja za rundy</h3>
    <h3 v-else>Faza planowania - Brak punktacji</h3>
    
    <!-- ZMIANA: Wyświetlaj siatka punktacji zawsze -->
    <div class="round-scores">
      <div
        v-for="(score, index) in props.roundScores"
        :key="`round-${index}`"
        class="round-score"
        :class="{
          active: currentRound === index + 1,
          bonus: hasBonus(index + 1),
          'bonus-used': isBonusUsed(index + 1),
          'planning-mode': isPlanning,
        }"
      >
        <div class="round-number">R{{ index + 1 }}</div>
        <div class="score-value">{{ score || '-' }}</div>
        <!-- NOWY: Gwiazdka dla rund bonusowych -->
        <div v-if="hasBonus(index + 1)" class="bonus-star">⭐</div>
      </div>
    </div>
    <!-- NOWY: Obecny wynik obok -->
    <div class="current-score">
      <h4>{{ isPlanning ? 'Obecny wynik:' : 'Łączny wynik:' }}</h4>
      <p class="total">{{ totalPoints }}</p>
    </div>
  </div>
</template>

<style scoped>
.round-scores-container {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.round-scores-container h3 {
  margin-bottom: 0.75rem;
  text-align: center;
  color: #2c3e50;
}

.round-scores {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 4px;
  margin-bottom: 1rem;
}

.round-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  border: 2px solid transparent;
  position: relative;
  min-height: 60px;
}

.round-score.active {
  border-color: #2196f3;
  background: #e3f2fd;
}

.round-score.bonus {
  background: #fff3e0;
}

.round-score.bonus-used {
  background: #c8e6c9;
}

/* NOWE: Style dla fazy planowania */
.round-score.planning-mode {
  opacity: 0.5;
  background: #f0f0f0;
}

.round-number {
  font-size: 0.75rem;
  font-weight: bold;
  color: #666;
}

.score-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.bonus-star {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.9rem;
}

.current-score {
  text-align: center;
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  border-radius: 4px;
}

.current-score h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.current-score .total {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

/* Responsywność */
@media (max-width: 768px) {
  .round-scores {
    grid-template-columns: repeat(9, 1fr);
  }
}
</style>
