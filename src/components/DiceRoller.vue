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

<style scoped>
.dice-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dice-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.dice {
  width: 60px;
  height: 60px;
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dice-sum {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
}

.btn-roll,
.btn-next {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-roll {
  background: #4caf50;
  color: white;
}

.btn-roll:hover:not(:disabled) {
  background: #45a049;
}

.btn-roll:disabled {
  background: #9e9e9e;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-next {
  background: #2196f3;
  color: white;
}

.btn-next:hover:not(:disabled) {
  background: #0b7dda;
}

.btn-next:disabled {
  background: #9e9e9e;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-roll.locked span,
.btn-next.locked span {
  font-size: 1.2rem;
}
</style>
