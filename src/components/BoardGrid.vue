<script setup lang="ts">
import { computed } from 'vue'

type CellType = 'empty' | 'house' | 'forest' | 'lake' | 'square' | 'factory'

interface Cell {
  type: CellType
  points: number
  occupied: boolean
}

// ZMIANA: Props teraz akceptują null
const props = defineProps<{
  board: Cell[][]
  dice1: number | null
  dice2: number | null
  diceSum: number
  rowLabels: string[]
  rowPoints: number[]
  tempChanges: { row: number; col: number; type: CellType }[]
  allowedColumns: number[]
  isChangesCommitted: boolean
}>()

const emit = defineEmits<{
  (e: 'cell-click', row: number, col: number): void
}>()

const getRowIndexFromSum = (sum: number): number => {
  if (sum === 3 || sum === 4) return 0
  if (sum === 5 || sum === 6) return 1
  if (sum === 7) return 2
  if (sum === 8 || sum === 9) return 3
  if (sum === 10 || sum === 11) return 4
  return -1
}

const activeRowIndex = computed(() => getRowIndexFromSum(props.diceSum))

// NOWE: Sprawdzenie czy pole ma tymczasową zmianę
const getTempType = (row: number, col: number): CellType | null => {
  const change = props.tempChanges.find((c) => c.row === row && c.col === col)
  return change ? change.type : null
}

// NOWE: Sprawdzenie czy kolumna jest dozwolona
// ZMIANA: Obsługujemy null dla kostek
const isColumnAllowed = (col: number): boolean => {
  if (props.allowedColumns.length === 0) return false
  return props.allowedColumns.includes(col + 1)
}
</script>

<template>
  <!-- Nagłówki kolumn (numery 1-6) -->
  <div class="col-headers">
    <div class="corner"></div>
    <div
      v-for="col in 6"
      :key="`col-${col}`"
      class="col-header"
      :class="{
        highlight:
          (props.dice1 !== null && props.dice1 === col) ||
          (props.dice2 !== null && props.dice2 === col),
      }"
    >
      {{ col }}
    </div>
  </div>

  <!-- Wiersze planszy -->
  <div v-for="(row, rowIndex) in props.board" :key="`row-${rowIndex}`" class="board-row">
    <div class="row-header" :class="{ highlight: activeRowIndex === rowIndex }">
      <span class="row-number">{{ props.rowLabels[rowIndex] }}</span>
      <span class="row-points">{{ props.rowPoints[rowIndex] }}p</span>
    </div>

    <div
      v-for="(cell, colIndex) in row"
      :key="`cell-${rowIndex}-${colIndex}`"
      class="cell"
      :class="[
        getTempType(rowIndex, colIndex) || cell.type,
        {
          clickable: !cell.occupied || getTempType(rowIndex, colIndex) !== null,
          'col-highlight':
            (props.dice1 !== null && props.dice1 === colIndex + 1) ||
            (props.dice2 !== null && props.dice2 === colIndex + 1),
          'row-highlight': activeRowIndex === rowIndex,
          'temp-change': getTempType(rowIndex, colIndex) !== null,
          'col-disabled': !isColumnAllowed(colIndex),
          'changes-committed': props.isChangesCommitted,
        },
      ]"
      @click="emit('cell-click', rowIndex, colIndex)"
    >
      <!-- ZMIANA: Wyświetlanie tymczasowego typu lub trwałego -->
      <span v-if="(getTempType(rowIndex, colIndex) || cell.type) === 'house'" class="cell-icon"
        >🏠</span
      >
      <span
        v-else-if="(getTempType(rowIndex, colIndex) || cell.type) === 'forest'"
        class="cell-icon"
        >🌲</span
      >
      <span
        v-else-if="(getTempType(rowIndex, colIndex) || cell.type) === 'lake'"
        class="cell-icon"
        >💧</span
      >
      <span
        v-else-if="(getTempType(rowIndex, colIndex) || cell.type) === 'square'"
        class="cell-icon"
        >⬜</span
      >
      <span
        v-else-if="(getTempType(rowIndex, colIndex) || cell.type) === 'factory'"
        class="cell-icon"
        >🏭</span
      >

      <!-- NOWE: Wyświetlanie punktów w prawym górnym rogu -->
      <span v-if="cell.points > 0" class="cell-points">{{ cell.points }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   NAGŁÓWKI KOLUMN
   ============================================ */

.col-headers {
  display: grid;
  grid-template-columns: 80px repeat(6, 60px);
  gap: 2px;
  margin-bottom: 2px;
}

.corner {
  width: 80px;
  height: 40px;
}

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

.col-header.highlight {
  background: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

/* ============================================
   WIERSZE PLANSZY
   ============================================ */

.board-row {
  display: grid;
  grid-template-columns: 80px repeat(6, 60px);
  gap: 2px;
  margin-bottom: 2px;
}

.row-header {
  width: 80px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #e0e0e0;
  border-radius: 4px;
  transition: background 0.3s;
}

.row-header.highlight {
  background: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

.row-number {
  font-size: 1rem;
}

.row-points {
  font-size: 0.85rem;
  color: #666;
}

/* ============================================
   KOMÓRKI PLANSZY
   ============================================ */

.cell {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  transition: all 0.2s;
  position: relative;
}

.cell.clickable {
  cursor: pointer;
}

.cell.clickable:hover:not(.col-disabled):not(.changes-committed) {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: scale(1.05);
}

.cell.col-highlight {
  border-color: #ffa726;
  border-width: 2px;
}

.cell.row-highlight {
  background: #fff3cd;
}

.cell.house {
  background: #ffccbc;
}

.cell.forest {
  background: #c8e6c9;
}

.cell.lake {
  background: #b3e5fc;
}

.cell.square {
  background: #e0e0e0;
}

.cell.factory {
  background: #bdbdbd;
}

/* NOWE: Style dla tymczasowych zmian */
.cell.temp-change {
  border: 3px dashed #ff9800;
  background: #fff3e0;
}

/* NOWE: Style dla zablokowanych kolumn */
.cell.col-disabled {
  opacity: 0.3;
  cursor: not-allowed !important;
}

/* NOWE: Style gdy zmiany zostały zapisane */
.cell.changes-committed {
  opacity: 0.6;
  cursor: not-allowed !important;
}

.cell-icon {
  font-size: 2rem;
}

/* NOWE: Wyświetlanie punktów w prawym górnym rogu */
.cell-points {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  color: #f57c00;
  background: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* ============================================
   RESPONSYWNOŚĆ
   ============================================ */

@media (max-width: 768px) {
  .cell,
  .col-header {
    width: 45px;
    height: 45px;
  }

  .row-header {
    width: 60px;
    height: 45px;
  }

  .corner {
    width: 60px;
    height: 40px;
  }

  .board-row,
  .col-headers {
    grid-template-columns: 60px repeat(6, 45px);
  }

  .cell-icon {
    font-size: 1.5rem;
  }
}
</style>
