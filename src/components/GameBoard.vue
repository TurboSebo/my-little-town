<script setup lang="ts">
// Import funkcji reaktywnych z Vue
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/GameStore'
import GameInfo from './GameInfo.vue'
import DiceRoller from './DiceRoller.vue'
import GameLegend from './GameLegend.vue'
import BoardGrid from './BoardGrid.vue'

/* ============================================
   DEFINICJE TYPÓW I INTERFEJSÓW
   ============================================ */

// Typ definiujący możliwe rodzaje pól na planszy
type CellType = 'empty' | 'house' | 'forest' | 'lake' | 'square'

// Interfejs opisujący pojedynczą komórkę planszy
interface Cell {
  type: CellType    // Rodzaj pola (puste, dom, las, staw, plac)
  points: number    // Punkty zdobyte za to pole (na przyszłość)
}

/* ============================================
   STAN GRY - ZMIENNE REAKTYWNE
   ============================================ */

// Rozmiar planszy - 6 kolumn (dla kostek 1-6) i 5 wierszy (dla sum kostek)
const boardSizeColumns = 6  // Liczba kolumn (kostki mają 6 ścianek)
const boardSizeRows = 5     // Liczba wierszy (5 grup sum kostek)

// Dwuwymiarowa tablica reprezentująca planszę gry
// ref() tworzy reaktywną zmienną - Vue automatycznie śledzi zmiany
// Array.from() tworzy tablicę 5x6 wypełnioną pustymi polami
const board = ref<Cell[][]>(
  Array.from({ length: boardSizeRows }, () =>           // Tworzy 5 wierszy
    Array.from({ length: boardSizeColumns }, () => ({   // W każdym wierszu 6 kolumn
      type: 'empty' as CellType,                        // Początkowy typ: puste pole
      points: 0                                          // Początkowe punkty: 0
    }))
  )
)

// Definicja nagłówków wierszy z sumami kostek
// Każdy wiersz odpowiada konkretnym sumom wyrzuconych kostek
const rowLabels = ['3,4', '5,6', '7', '8,9', '10,11']

// Tablica punktów dla każdego wiersza
// Zgodnie z obrazkiem: wiersze dają kolejno 3, 1, 3, 1, 3 punkty
const rowPoints = [3, 1, 3, 1, 3]

// --- Stan globalny (Pinia) ---
const game = useGameStore()

// Wygodne computed do przekazywania do komponentów prezentacyjnych
const dice1 = computed(() => game.dice1)
const dice2 = computed(() => game.dice2)
const currentRound = computed(() => game.currentRound)
const totalScore = computed(() => game.totalScore)

/* ============================================
   COMPUTED - WARTOŚCI OBLICZANE AUTOMATYCZNIE
   ============================================ */

// Suma wartości obu kostek (określa wiersz do punktowania)
const diceSum = computed(() => game.diceSum)

/* ============================================
  FUNKCJE - LOGIKA GRY
  ============================================ */

// Funkcje wywołujące akcje ze store'a
const rollDice = () => game.rollDice()

// (opcjonalnie) mapowanie kostki na typ budynku będzie zaimplementowane później

// Funkcja obsługująca kliknięcie w pole planszy
// row: numer wiersza (0-4)
// col: numer kolumny (0-5)
const handleCellClick = (row: number, col: number) => {
  // Sprawdź czy wartości są zdefiniowane i pole nie jest już zajęte
  const boardRow = board.value[row];
  if (!boardRow) return;
  const cell = boardRow[col];
  if (!cell || cell.type !== 'empty') return

  // Tutaj będzie logika stawiania budynków (do implementacji)
  // Na razie tylko wypisujemy informację do konsoli
  console.log(`Clicked: row ${row + 1}, col ${col + 1}`)
  console.log(`Row label: ${rowLabels[row]}, Points: ${rowPoints[row]}`)
}

// Funkcja przechodzenia do następnej rundy
const nextRound = () => game.nextRound(9)

/* ============================================
   INICJALIZACJA
   ============================================ */

// Pierwszy rzut kostkami przy starcie gry
rollDice()
</script>

<template>
  <!-- Główny kontener gry -->
  <div class="game-container">
    <!-- PANEL INFORMACYJNY (LEWA STRONA) -->
    <div class="info-panel">
      <GameInfo :current-round="currentRound" :total-score="totalScore" />

      <DiceRoller
        :dice1="dice1"
        :dice2="dice2"
        :dice-sum="diceSum"
        :current-round="currentRound"
        @roll="rollDice"
        @next="nextRound"
      />

      <GameLegend />
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
          @cell-click="handleCellClick"
        />
      </div>
    </div>
  </div>
</template>

