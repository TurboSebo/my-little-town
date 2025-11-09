<script setup lang="ts">
// ZMIANA: Dodano prop isPlanning
const props = defineProps<{
  dice1: number | null // ZMIANA: Może być null
  dice2: number | null // ZMIANA: Może być null
  diceSum: number
  currentRound: number
  canProceed: boolean // Czy można przejść dalej
  canRoll: boolean // NOWE: Czy można rzucać
  isPlanning: boolean // NOWE: Czy jesteśmy w fazie planowania
}>()

const emit = defineEmits<{
  (e: 'roll'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="dice-section">
    <div class="dice-container">
      <!-- ZMIANA: Wyświetlaj ? jeśli kostka jest null -->
      <div class="dice">{{ props.dice1 ?? '?' }}</div>
      <div class="dice">{{ props.dice2 ?? '?' }}</div>
    </div>
    <p class="dice-sum">Suma: {{ props.diceSum > 0 ? props.diceSum : '?' }}</p>
    <!-- NOWE: Blokuj przycisk rzutu jeśli już rzucono lub zapisano zmiany -->
    <button
      class="btn-roll"
      :class="{ locked: !props.canRoll }"
      :disabled="!props.canRoll"
      @click="emit('roll')"
    >
      <span v-if="!props.canRoll">🔒</span>
      Rzuć kostkami
    </button>
    <!-- ZMIANA: Przycisk z ikoną kłódki gdy nie można przejść -->
    <!-- ZMIANA: Zawsze wyświetlaj "Następna runda" zamiast zmiennego tekstu -->
    <button
      class="btn-next"
      :class="{ locked: !props.canProceed }"
      :disabled="props.currentRound >= 9 || !props.canProceed"
      @click="emit('next')"
    >
      <span v-if="!props.canProceed">🔒</span>
      Następna runda
    </button>
  </div>
</template>

