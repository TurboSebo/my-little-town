<script setup lang="ts">
// Import funkcji reaktywnych z Vue
import { ref, computed } from 'vue'

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

// Wartość pierwszej kostki (1-6)
const dice1 = ref<number>(1)

// Wartość drugiej kostki (1-6)
const dice2 = ref<number>(1)

// Numer obecnej rundy (gra może trwać np. 9 rund - do dostosowania)
const currentRound = ref<number>(1)

// Suma punktów gracza
const totalScore = ref<number>(0)

/* ============================================
   COMPUTED - WARTOŚCI OBLICZANE AUTOMATYCZNIE
   ============================================ */

// Suma wartości obu kostek (określa wiersz do punktowania)
// computed() automatycznie przelicza wartość gdy zmienią się dice1 lub dice2
const diceSum = computed(() => dice1.value + dice2.value)

/* ============================================
   FUNKCJE POMOCNICZE
   ============================================ */

// Funkcja mapująca sumę kostek na indeks wiersza (0-4)
// Zwraca -1 jeśli suma nie pasuje do żadnego wiersza
const getRowIndexFromSum = (sum: number): number => {
  if (sum === 3 || sum === 4) return 0    // Wiersz {3,4}
  if (sum === 5 || sum === 6) return 1    // Wiersz {5,6}
  if (sum === 7) return 2                 // Wiersz {7}
  if (sum === 8 || sum === 9) return 3    // Wiersz {8,9}
  if (sum === 10 || sum === 11) return 4  // Wiersz {10,11}
  return -1  // Suma poza zakresem (teoretycznie niemożliwe z dwoma kostkami)
}

/* ============================================
   FUNKCJE - LOGIKA GRY
   ============================================ */

// Funkcja losująca wartości na obu kostkach (1-6)
const rollDice = () => {
  // Math.random() zwraca liczbę 0-0.999...
  // Math.random() * 6 daje 0-5.999...
  // Math.floor() zaokrągla w dół (0-5)
  // +1 daje ostateczny wynik 1-6
  dice1.value = Math.floor(Math.random() * 6) + 1
  dice2.value = Math.floor(Math.random() * 6) + 1
}

// Funkcja zwracająca typ budynku na podstawie wartości kostki
// Według zasad gry:
// - 1 lub 4 = Dom
// - 2 lub 5 = Las
// - 3 lub 6 = Staw
const getCellTypeFromDice = (diceValue: number): CellType => {
  if (diceValue === 1 || diceValue === 4) return 'house'
  if (diceValue === 2 || diceValue === 5) return 'forest'
  if (diceValue === 3 || diceValue === 6) return 'lake'
  return 'empty'
}

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
const nextRound = () => {
  // Sprawdź czy nie skończyły się rundy (maksymalnie 9)
  if (currentRound.value < 9) {
    currentRound.value++     // Zwiększ numer rundy
    rollDice()               // Rzuć kostkami na nowo
  }
}

/* ============================================
   INICJALIZACJA
   ============================================ */

// Pierwszy rzut kostkami przy starcie gry
rollDice()
</script>

<template>
  <!-- Główny kontener gry -->
  <div class="game-container">
    
    <!-- ============================================
         PANEL INFORMACYJNY (LEWA STRONA)
         ============================================ -->
    <div class="info-panel">
      
      <!-- Sekcja z podstawowymi informacjami o grze -->
      <div class="info-section">
        <h2>Moje Miasteczko</h2>
        <!-- {{ }} to mustache syntax - wyświetla wartość zmiennej -->
        <p>Runda: {{ currentRound }} / 9</p>
        <p>Punkty: {{ totalScore }}</p>
      </div>

      <!-- Sekcja z kostkami i przyciskami -->
      <div class="dice-section">
        <!-- Kontener na dwie kostki -->
        <div class="dice-container">
          <!-- Pierwsza kostka - wyświetla wartość dice1 -->
          <div class="dice">{{ dice1 }}</div>
          <!-- Druga kostka - wyświetla wartość dice2 -->
          <div class="dice">{{ dice2 }}</div>
        </div>
        
        <!-- Suma kostek (obliczana automatycznie) -->
        <p class="dice-sum">Suma: {{ diceSum }}</p>
        
        <!-- Przycisk rzutu kostkami -->
        <!-- @click to skrót od v-on:click - wywołuje funkcję po kliknięciu -->
        <button @click="rollDice" class="btn-roll">Rzuć kostkami</button>
        
        <!-- Przycisk następnej rundy -->
        <!-- :disabled to skrót od v-bind:disabled - dynamicznie ustawia atrybut -->
        <button @click="nextRound" class="btn-next" :disabled="currentRound >= 9">
          Następna runda
        </button>
      </div>

      <!-- Legenda - wyjaśnienie symboli -->
      <div class="legend">
        <h3>Legenda</h3>
        <div class="legend-item">
          <span class="icon house-icon">🏠</span>
          <span>Dom (1, 4)</span>
        </div>
        <div class="legend-item">
          <span class="icon forest-icon">🌲</span>
          <span>Las (2, 5)</span>
        </div>
        <div class="legend-item">
          <span class="icon lake-icon">💧</span>
          <span>Staw (3, 6)</span>
        </div>
        <div class="legend-item">
          <span class="icon square-icon">⬜</span>
          <span>Plac (dublet)</span>
        </div>
      </div>
    </div>

    <!-- ============================================
         PLANSZA GRY (PRAWA STRONA)
         ============================================ -->
    <div class="board-container">
      <div class="board">
        
        <!-- Nagłówki kolumn (numery 1-6) -->
        <div class="col-headers">
          <!-- Pusty narożnik (miejsce nad nagłówkami wierszy) -->
          <div class="corner"></div>
          
          <!-- v-for iteruje po liczbach od 1 do 6 (boardSizeColumns) -->
          <!-- :key to unikalny identyfikator dla Vue (wymagany przy v-for) -->
          <!-- Podświetlenie kolumny gdy wartość kostki się z nią zgadza -->
          <div 
            v-for="col in boardSizeColumns" 
            :key="`col-${col}`" 
            class="col-header"
            :class="{ 'highlight': dice1 === col || dice2 === col }"
          >
            {{ col }}
          </div>
        </div>

        <!-- Wiersze planszy -->
        <!-- v-for iteruje po tablicy board (każdy element to wiersz) -->
        <!-- rowIndex to indeks wiersza (0-4) -->
        <div 
          v-for="(row, rowIndex) in board" 
          :key="`row-${rowIndex}`" 
          class="board-row"
        >
          <!-- Nagłówek wiersza z etykietą sum i punktami -->
          <div 
            class="row-header"
            :class="{ 'highlight': getRowIndexFromSum(diceSum) === rowIndex }"
          >
            <!-- Wyświetl etykietę z sumami kostek (np. "3,4" lub "7") -->
            <span class="row-number">{{ rowLabels[rowIndex] }}</span>
            <!-- Wyświetla punkty z tablicy rowPoints -->
            <span class="row-points">{{ rowPoints[rowIndex] }}p</span>
          </div>

          <!-- Komórki w wierszu -->
          <!-- Iterujemy po kolumnach w danym wierszu -->
          <!-- cell to pojedyncza komórka (obiekt typu Cell) -->
          <!-- colIndex to indeks kolumny (0-5) -->
          <div 
            v-for="(cell, colIndex) in row" 
            :key="`cell-${rowIndex}-${colIndex}`"
            class="cell"
            :class="[
              cell.type,
              { 
                'clickable': cell.type === 'empty',
                'col-highlight': dice1 === colIndex + 1 || dice2 === colIndex + 1,
                'row-highlight': getRowIndexFromSum(diceSum) === rowIndex
              }
            ]"
            @click="handleCellClick(rowIndex, colIndex)"
          >
            <!-- Wyświetl odpowiednią ikonę w zależności od typu pola -->
            <!-- v-if sprawdza warunek i renderuje element tylko gdy jest spełniony -->
            <span v-if="cell.type === 'house'" class="cell-icon">🏠</span>
            <span v-else-if="cell.type === 'forest'" class="cell-icon">🌲</span>
            <span v-else-if="cell.type === 'lake'" class="cell-icon">💧</span>
            <span v-else-if="cell.type === 'square'" class="cell-icon">⬜</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Stylowanie -->
<style scoped>
/* scoped oznacza, że style działają tylko w tym komponencie */

/* ============================================
   LAYOUT GŁÓWNY
   ============================================ */

/* Kontener całej gry - flexbox układa elementy obok siebie */
.game-container {
  display: flex;              /* Flexbox - elementy układane w wierszu */
  gap: 2rem;                  /* Odstęp między panelem a planszą */
  padding: 2rem;              /* Wewnętrzny margines */
  max-width: 1400px;          /* Maksymalna szerokość */
  margin: 0 auto;             /* Wyśrodkowanie */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ============================================
   PANEL INFORMACYJNY
   ============================================ */

/* Panel informacyjny po lewej stronie */
.info-panel {
  flex: 0 0 280px;            /* Stała szerokość 280px */
  display: flex;
  flex-direction: column;     /* Elementy jeden pod drugim */
  gap: 2rem;                  /* Odstęp między sekcjami */
}

/* Nagłówek sekcji informacyjnej */
.info-section h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

/* Paragrafy w sekcji informacyjnej */
.info-section p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

/* ============================================
   KOŚCI
   ============================================ */

/* Sekcja z kostkami i przyciskami */
.dice-section {
  background: #f8f9fa;        /* Jasne tło */
  padding: 1.5rem;
  border-radius: 8px;         /* Zaokrąglone rogi */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  /* Subtelny cień */
}

/* Kontener na obie kostki */
.dice-container {
  display: flex;
  gap: 1rem;                  /* Odstęp między kostkami */
  justify-content: center;    /* Wyśrodkowanie kostek */
  margin-bottom: 1rem;
}

/* Pojedyncza kostka */
.dice {
  width: 60px;
  height: 60px;
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: center;        /* Wyśrodkowanie w pionie */
  justify-content: center;    /* Wyśrodkowanie w poziomie */
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Tekst pokazujący sumę kostek */
.dice-sum {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
}

/* Wspólne style dla przycisków */
.btn-roll,
.btn-next {
  width: 100%;                /* Przyciski na całą szerokość */
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;            /* Kursor zmienia się w rękę */
  transition: background 0.3s; /* Płynna animacja koloru */
}

/* Przycisk rzutu kostkami - zielony */
.btn-roll {
  background: #4CAF50;
  color: white;
}

/* Efekt hover na przycisku rzutu */
.btn-roll:hover {
  background: #45a049;        /* Ciemniejszy zielony */
}

/* Przycisk następnej rundy - niebieski */
.btn-next {
  background: #2196F3;
  color: white;
}

/* Efekt hover na przycisku następnej rundy */
.btn-next:hover:not(:disabled) {
  background: #0b7dda;        /* Ciemniejszy niebieski */
}

/* Przycisk wyłączony (po 9 rundzie) */
.btn-next:disabled {
  background: #ccc;           /* Szary kolor */
  cursor: not-allowed;        /* Kursor zakazu */
}

/* ============================================
   LEGENDA
   ============================================ */

/* Sekcja z legendą symboli */
.legend {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

/* Nagłówek legendy */
.legend h3 {
  margin: 0 0 1rem 0;
}

/* Pojedynczy element legendy */
.legend-item {
  display: flex;
  align-items: center;        /* Wyrównanie ikony i tekstu */
  gap: 0.75rem;               /* Odstęp między ikoną a tekstem */
  margin: 0.75rem 0;
}

/* Ikony w legendzie */
.icon {
  font-size: 1.5rem;
}

/* ============================================
   KONTENER PLANSZY
   ============================================ */

/* Główny kontener planszy */
.board-container {
  flex: 1;                    /* Zajmuje pozostałą przestrzeń */
  display: flex;
  justify-content: center;    /* Wyśrodkowanie planszy */
  align-items: flex-start;    /* Wyrównanie do góry */
}

/* Plansza gry */
.board {
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* ============================================
   NAGŁÓWKI KOLUMN
   ============================================ */

/* Wiersz z nagłówkami kolumn */
.col-headers {
  display: grid;
  /* ZMIANA: 1 kolumna na nagłówek (80px) + 6 kolumn planszy (po 60px) */
  grid-template-columns: 80px repeat(6, 60px);
  gap: 2px;                   /* Odstęp między kolumnami */
  margin-bottom: 2px;
}

/* Pusty narożnik w lewym górnym rogu */
.corner {
  width: 80px;                /* ZMIANA: szerszy narożnik dla etykiet wierszy */
  height: 40px;
}

/* Nagłówek pojedynczej kolumny */
.col-header {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #e0e0e0;
  border-radius: 4px;
  transition: background 0.3s;
}

/* Podświetlenie kolumny gdy wartość kostki się z nią zgadza */
.col-header.highlight {
  background: #ffd700;        /* Złoty kolor */
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);  /* Świecący efekt */
}

/* ============================================
   WIERSZE PLANSZY
   ============================================ */

/* Pojedynczy wiersz planszy */
.board-row {
  display: grid;
  /* ZMIANA: 1 kolumna na nagłówek (80px) + 6 kolumn planszy (po 60px) */
  grid-template-columns: 80px repeat(6, 60px);
  gap: 2px;
  margin-bottom: 2px;
}

/* Nagłówek wiersza (z etykietą sum i punktami) */
.row-header {
  width: 80px;                /* ZMIANA: szerszy nagłówek dla etykiet typu "3,4" */
  height: 60px;
  display: flex;
  flex-direction: column;     /* Etykieta nad punktami */
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #e0e0e0;
  border-radius: 4px;
  transition: background 0.3s;
}

/* Podświetlenie wiersza gdy suma kostek się zgadza */
.row-header.highlight {
  background: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

/* Etykieta wiersza (np. "3,4" lub "7") */
.row-number {
  font-size: 1rem;            /* ZMIANA: mniejszy font dla etykiet z przecinkami */
}

/* Punkty wiersza */
.row-points {
  font-size: 0.85rem;
  color: #666;
}

/* ============================================
   KOMÓRKI PLANSZY
   ============================================ */

/* Pojedyncza komórka na planszy */
.cell {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  transition: all 0.2s;       /* Płynne animacje */
}

/* Komórka na którą można kliknąć (pusta) */
.cell.clickable {
  cursor: pointer;
}

/* Efekt hover na pustej komórce */
.cell.clickable:hover {
  background: #e3f2fd;        /* Jasnoniebieski */
  border-color: #2196F3;      /* Niebieski border */
  transform: scale(1.05);     /* Lekkie powiększenie */
}

/* Podświetlenie komórki w aktywnej kolumnie */
.cell.col-highlight {
  border-color: #ffa726;      /* Pomarańczowy border */
  border-width: 2px;
}

/* Podświetlenie komórki w aktywnym wierszu */
.cell.row-highlight {
  background: #fff3cd;        /* Jasno żółty */
}

/* Komórka z domem */
.cell.house {
  background: #ffccbc;        /* Jasny pomarańczowy */
}

/* Komórka z lasem */
.cell.forest {
  background: #c8e6c9;        /* Jasny zielony */
}

/* Komórka ze stawem */
.cell.lake {
  background: #b3e5fc;        /* Jasny niebieski */
}

/* Komórka z placem */
.cell.square {
  background: #e0e0e0;        /* Szary */
}

/* Ikona w komórce */
.cell-icon {
  font-size: 2rem;
}

/* ============================================
   RESPONSYWNOŚĆ (DOSTOSOWANIE DO EKRANU)
   ============================================ */

/* Na średnich ekranach - panel nad planszą */
@media (max-width: 1200px) {
  .game-container {
    flex-direction: column;   /* Elementy jeden pod drugim */
  }

  .info-panel {
    flex: 0 0 auto;           /* Panel zajmuje tyle ile potrzeba */
  }
}

/* Na małych ekranach - zmniejszone pola */
@media (max-width: 768px) {
  .cell,
  .col-header {
    width: 45px;              /* Mniejsze pola */
    height: 45px;
  }

  .row-header {
    width: 60px;              /* Proporcjonalnie szerszy nagłówek */
    height: 45px;
  }

  .corner {
    width: 60px;
    height: 40px;
  }

  .board-row,
  .col-headers {
    /* ZMIANA: dostosowanie do 6 kolumn */
    grid-template-columns: 60px repeat(6, 45px);
  }

  .cell-icon {
    font-size: 1.5rem;        /* Mniejsze ikony */
  }
}
</style>
