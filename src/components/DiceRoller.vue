<script setup lang="ts">
const props = defineProps<{
  dice1: number;
  dice2: number;
  diceSum: number;
  currentRound: number;
}>()

const emit = defineEmits<{
  (e: 'roll'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="dice-section">
    <div class="dice-container">
      <div class="dice">{{ props.dice1 }}</div>
      <div class="dice">{{ props.dice2 }}</div>
    </div>
    <p class="dice-sum">Suma: {{ props.diceSum }}</p>
    <button class="btn-roll" @click="emit('roll')">Rzuć kostkami</button>
    <button class="btn-next" :disabled="props.currentRound >= 9" @click="emit('next')">Następna runda</button>
  </div>
</template>
