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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-header h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2rem;
}

.subtitle {
  margin: 0;
  color: #7c8d9a;
  font-size: 1.1rem;
  font-weight: bold;
}

.modal-body {
  margin-bottom: 2rem;
}

.intro-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  text-align: center;
}

.description {
  color: #666;
  text-align: center;
  margin: 0 0 1.5rem 0;
}

.game-rules {
  background: #f5f7fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.game-rules h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.game-rules ul {
  margin: 0;
  padding-left: 1.5rem;
}

.game-rules li {
  margin: 0.5rem 0;
  color: #555;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-start {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-start:active {
  transform: translateY(0);
}
</style>
