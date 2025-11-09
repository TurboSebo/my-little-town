<script setup lang="ts">
// ZMIANA: Dodano props isPlanning
const props = defineProps<{
  currentRound: number
  totalScore: number
  isPlanning: boolean // NOWE
}>()
</script>

<template>
  <div class="info-section">
    <h2>Moje Miasteczko</h2>
    <!-- ZMIANA: Wyświetlanie fazy planowania lub rundy -->
    <p v-if="props.isPlanning">Faza planowania</p>
    <p v-else>Runda: {{ props.currentRound }} / 9</p>
    <p>Punkty: {{ props.totalScore }}</p>
  </div>
</template>

