<script setup lang="ts">
const props = defineProps<{ currentRound: number; totalScore: number }>()
</script>

<template>
  <div class="info-section">
    <h2>Moje Miasteczko</h2>
    <p>Runda: {{ props.currentRound }} / 9</p>
    <p>Punkty: {{ props.totalScore }}</p>
  </div>

</template>
