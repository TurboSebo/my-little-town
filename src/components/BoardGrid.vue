<script setup lang="ts">
import { computed } from 'vue'

type CellType = 'empty' | 'house' | 'forest' | 'lake' | 'square' | 'factory'

interface Cell {
  type: CellType
  points: number
  occupied: boolean
}

// Props now accept null for dice values
const props = defineProps<{
  board: Cell[][]
  dice1: number | null
  dice2: number | null
  diceSum: number
  rowLabels: string[]
  rowPoints: number[]
  tempChanges: { row: number; col: number; type: CellType }[]
  allowedPrimary: number[] // from store: primary columns
  allowedAlt: number[] // alternative nearby columns
  anyForSquare: boolean
  isPlanning: boolean
  isBonus: boolean // Are we in bonus phase
  selectedProject: CellType | null // Selected project (Point 13)
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

// Check if cell has a temporary change
const getTempType = (row: number, col: number): CellType | null => {
  const change = props.tempChanges.find((c) => c.row === row && c.col === col)
  return change ? change.type : null
}

// Check if column is allowed (includes primary and alternative columns)
const isColumnAllowed = (col: number): boolean => {
  const colNum = col + 1
  // In planning phase, all empty cells are allowed
  if (props.isPlanning) {
    return true
  }

  // In bonus phase, all empty cells are allowed
  if (props.isBonus) {
    return true
  }

  // Point 13: If player has NOT selected a project, all columns are allowed (no blocking)
  if (!props.selectedProject || props.selectedProject === 'empty') {
    return true
  }

  if (props.anyForSquare) return true
  if (props.allowedPrimary && props.allowedPrimary.length > 0 && props.allowedPrimary.includes(colNum)) return true
  if (props.allowedAlt && props.allowedAlt.length > 0 && props.allowedAlt.includes(colNum)) return true
  return false
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
          'alt-highlight': props.allowedAlt && props.allowedAlt.includes(col),
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
          'alt-col': props.allowedAlt && props.allowedAlt.includes(colIndex + 1),
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

