<script setup lang="ts">
// NOWY: Modal startowy na środku ekranu
const emit = defineEmits<{
  (e: 'start-game'): void
}>()
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h1>🏘️ Moje Miasteczko 🏘️</h1>
        <p class="subtitle">Rolling Village</p>
      </div>

      <div class="modal-body">
        <p class="intro-text">Witaj w grze Moje Miasteczko!</p>
        <p class="description">
          Zbuduj piękne miasteczko poprzez umieszczanie domów, lasów i stawów na planszy.
        </p>

        <div class="game-rules">
          <h3>Zasady gry:</h3>
          <ul>
            <li>Gra trwa 9 rund</li>
            <li>W każdej rundzie rzucasz kostkami i stawiasz projekty</li>
            <li>Projekty muszą być postawiane w kolumnach zgodnych z wynikami kostek</li>
            <li>Punkty zdobywasz za każdy projekt</li>
            <li>Bonusy w rundach 3, 6 i 9 ⭐</li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('start-game')" class="btn-start">
          🎮 Rozpocznij grę 🎮
        </button>
      </div>
    </div>
  </div>
</template>

