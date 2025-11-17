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
  isBonus: boolean // NOWE: Czy jesteśmy w fazie bonus
  canEnterBonus: boolean // PUNKT 16: Czy można przejść do fazy bonus
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
    <!-- PUNKT 16: W planning "Rozpocznij grę", gdy canEnterBonus "Faza bonusowa", w bonus "Następna runda", w innych "Następna runda" -->
    <button
      class="btn-next"
      :class="{ locked: !props.canProceed && !props.canEnterBonus }"
      :disabled="props.currentRound >= 9 || (!props.canProceed && !props.canEnterBonus)"
      @click="emit('next')"
    >
      <span v-if="!props.canProceed && !props.canEnterBonus">🔒</span>
      {{ props.isPlanning ? 'Rozpocznij grę' : props.canEnterBonus ? 'Faza bonusowa' : 'Następna runda' }}
    </button>
  </div>
</template>

