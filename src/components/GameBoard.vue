<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/GameStore'
import GameInfo from './GameInfo.vue'
import DiceRoller from './DiceRoller.vue'
import GameLegend from './GameLegend.vue'
import BoardGrid from './BoardGrid.vue'
import RoundScores from './RoundScores.vue'
import GameStartModal from './GameStartModal.vue'

/* ============================================
   DEFINICJE TYPÓW I INTERFEJSÓW
   ============================================ */

type CellType = 'empty' | 'house' | 'forest' | 'lake' | 'square' | 'factory'

interface Cell {
  type: CellType
  points: number
  occupied: boolean
}

/* ============================================
   STAN GRY - STORE PINIA
   ============================================ */

const game = useGameStore()

// NOWE: Inicjalizacja gracza przy starcie
if (game.players.length === 0) {
  game.addPlayer('Gracz 1')
}

// NOWE: Stan dla modala startowego
const showStartModal = ref(true)

// Rozmiar planszy (możliwe użycie w przyszłości – na razie nieużywane)
// const boardSizeColumns = 6
// const boardSizeRows = 5

// ZMIANA: Plansza pochodzi ze store (board gracza)
const board = computed(() => {
  if (game.players.length > 0) {
    return game.players[0]!.board
  }
  return [] as Cell[][]
})

// Definicja nagłówków wierszy z sumami kostek
const rowLabels = ['3,4', '5,6', '7', '8,9', '10,11']

// Tablica punktów dla każdego wiersza
const rowPoints = [3, 1, 3, 1, 3]

// Wygodne computed do przekazywania do komponentów
const dice1 = computed(() => game.dice1)
const dice2 = computed(() => game.dice2)
const currentRound = computed(() => game.currentRound)
const totalScore = computed(() => game.totalScore)
const diceSum = computed(() => game.diceSum)
const isPlanning = computed(() => game.isPlanning)
const canProceed = computed(() => game.canProceedToNextRound)
const selectedProject = computed(() => game.selectedProject)
const tempChanges = computed(() => game.tempChanges)
const roundScores = computed(() => game.roundScores)
const usedBonusRounds = computed(() => game.usedBonusRounds)
const canRollDice = computed(() => game.canRollDice)
const changesCommitted = computed(() => game.changesCommitted)
const diceRolledThisRound = computed(() => game.diceRolledThisRound) // NOWE

/* ============================================
  FUNKCJE - LOGIKA GRY
  ============================================ */

// NOWE: Rozpoczęcie gry (przejście z modala startowego)
const startGame = () => {
  game.startGame()
  showStartModal.value = false
}

// Funkcje wywołujące akcje ze store'a
const rollDice = () => {
  if (canRollDice.value) {
    game.rollDice()
  }
}

// ZMIANA: Kliknięcie w pole - umieszczenie tymczasowe
const handleCellClick = (row: number, col: number) => {
  // NOWE: Blokuj kliknięcia jeśli nie rzucono kostek
  if (!diceRolledThisRound.value) {
    console.log('Musisz najpierw rzucić kostkami!')
    return
  }

  // NOWE: Blokuj kliknięcia na pole jeśli już zapisaliśmy zmiany
  if (changesCommitted.value) {
    console.log('Musisz przejść do następnej rundy aby postawiać nowe projekty!')
    return
  }

  const cell = board.value[row]?.[col]
  if (!cell) return

  // Sprawdź czy pole jest już zajęte (nie tymczasowo)
  if (cell.occupied && !tempChanges.value.some((c) => c.row === row && c.col === col)) {
    console.log('To pole jest już zajęte!')
    return
  }

  // Sprawdź czy wybrano projekt
  if (!selectedProject.value || selectedProject.value === 'empty') {
    console.log('Najpierw wybierz projekt z legendy!')
    return
  }

  // Umieść projekt tymczasowo
  game.placeProjectTemp(row, col)
}

// NOWE: Zapisanie zmian
const saveChanges = () => {
  game.saveChanges()
}

// NOWE: Usunięcie wszystkich tymczasowych zmian
const clearChanges = () => {
  game.clearTempChanges()
}

// Funkcja przechodzenia do następnej rundy
const nextRound = () => {
  if (canProceed.value) {
    game.nextRound(9)
  }
}

// NOWE: Wybór projektu z legendy
const selectProject = (projectType: CellType) => {
  // NOWE: Blokuj wybór projektów jeśli już zapisaliśmy zmiany
  if (changesCommitted.value) {
    console.log('Nie możesz zmieniać projektów po zapisaniu!')
    return
  }
  game.selectProject(projectType)
}

/* ============================================
   INICJALIZACJA
   ============================================ */

// ZMIANA: Brak automatycznego rzutu - start od fazy planowania
</script>

<template>
  <!-- NOWY: Modal startowy na środku ekranu -->
  <GameStartModal v-if="showStartModal" @start-game="startGame" />

  <!-- Główny kontener gry -->
  <div v-else class="game-container">
    <!-- PANEL INFORMACYJNY (LEWA STRONA) -->
    <div class="info-panel">
      <!-- ZMIANA: Wyświetlanie fazy planowania lub rundy -->
      <GameInfo :current-round="currentRound" :total-score="totalScore" :is-planning="isPlanning" />

      <!-- ZMIANA: Wyświetlaj DiceRoller zawsze -->
      <DiceRoller
        :dice1="dice1"
        :dice2="dice2"
        :dice-sum="diceSum"
        :current-round="currentRound"
        @roll="rollDice"
        @next="nextRound"
        :can-proceed="canProceed"
        :can-roll="canRollDice"
        :is-planning="isPlanning"
      />

      <!-- ZMIANA: Wyświetlaj legendę zawsze -->
      <GameLegend
        :selected-project="selectedProject"
        :available-projects="game.availableProjects"
        @select-project="selectProject"
        :disabled="changesCommitted"
      />

      <!-- ZMIANA: Wyświetlaj przyciski akcji zawsze -->
      <div class="action-buttons">
        <button @click="saveChanges" class="btn-save" :disabled="tempChanges.length === 0">
          Zapisz zmiany
        </button>
        <button @click="clearChanges" class="btn-clear" :disabled="tempChanges.length === 0">
          Usuń wszystkie
        </button>
      </div>
    </div>

    <!-- PLANSZA GRY (PRAWA STRONA) -->
    <div class="board-container">
      <div class="board">
        <BoardGrid
          :board="board"
          :dice1="dice1"
          :dice2="dice2"
          :dice-sum="diceSum"
          :row-labels="rowLabels"
          :row-points="rowPoints"
          :temp-changes="tempChanges"
          :allowed-columns="game.allowedColumns"
          @cell-click="handleCellClick"
          :is-changes-committed="changesCommitted"
        />

        <!-- ZMIANA: Wyświetlaj RoundScores zawsze -->
        <RoundScores
          :round-scores="roundScores"
          :current-round="currentRound"
          :used-bonus-rounds="usedBonusRounds"
          :is-planning="isPlanning"
        />
      </div>
    </div>
  </div>
</template>

