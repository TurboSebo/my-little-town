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

<style scoped>
.info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  text-align: center;
}

.info-section p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  text-align: center;
  color: #555;
}
</style>
