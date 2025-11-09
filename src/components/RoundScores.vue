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

