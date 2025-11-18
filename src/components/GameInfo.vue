<script setup lang="ts">
// Added isPlanning prop
const props = defineProps<{
  currentRound: number
  totalScore: number
  isPlanning: boolean
}>()
</script>

<template>
  <div class="info-section">
    <h2>Moje Miasteczko</h2>
    <!-- Display planning phase or round number -->
    <p v-if="props.isPlanning">Faza planowania</p>
    <p v-else>Runda: {{ props.currentRound }} / 9</p>
    <p>Punkty: {{ props.totalScore }}</p>
  </div>
</template>

