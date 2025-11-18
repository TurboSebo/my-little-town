<script setup lang="ts">
// Added isPlanning prop
const props = defineProps<{
  dice1: number | null // Can be null
  dice2: number | null // Can be null
  diceSum: number
  currentRound: number
  canProceed: boolean // Can proceed to next phase
  canRoll: boolean // Can roll dice
  isPlanning: boolean // Are we in planning phase
  isBonus: boolean // Are we in bonus phase
  canEnterBonus: boolean // Point 16: Can enter bonus phase
  needsRowSelection: boolean // Sum is 2 or 12, needs row selection
}>()

const emit = defineEmits<{
  (e: 'roll'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="dice-section">
    <div class="dice-container">
      <!-- Display ? if dice is null -->
      <div class="dice">{{ props.dice1 ?? '?' }}</div>
      <div class="dice">{{ props.dice2 ?? '?' }}</div>
    </div>
    <p class="dice-sum">Suma: {{ props.diceSum > 0 ? props.diceSum : '?' }}</p>
    
    <!-- Message when row selection needed -->
    <p v-if="props.needsRowSelection" class="row-selection-hint">
      👆 Kliknij na nagłówek wiersza aby wybrać ulicę do punktowania!
    </p>
    <!-- Block roll button if already rolled or changes saved -->
    <button
      class="btn-roll"
      :class="{ locked: !props.canRoll }"
      :disabled="!props.canRoll"
      @click="emit('roll')"
    >
      <span v-if="!props.canRoll">🔒</span>
      Rzuć kostkami
    </button>
    <!-- Button with lock icon when cannot proceed -->
    <!-- Point 16: In planning "Start Game", when canEnterBonus "Bonus Phase", in bonus "Next Round", otherwise "Next Round" -->
    <button
      class="btn-next"
      :class="{ locked: !props.canProceed && !props.canEnterBonus }"
      :disabled="!props.canProceed && !props.canEnterBonus"
      @click="emit('next')"
    >
      <span v-if="!props.canProceed && !props.canEnterBonus">🔒</span>
      {{ props.isPlanning ? 'Rozpocznij grę' : props.canEnterBonus ? 'Faza bonusowa' : props.currentRound === 9 ? 'Zakończ grę' : 'Następna runda' }}
    </button>
  </div>
</template>

