<script setup lang="ts">
import { computed } from 'vue'

type CellType = 'empty' | 'house' | 'forest' | 'lake' | 'square'
interface Cell {
  type: CellType
  points: number
}

const props = defineProps<{
  board: Cell[][]
  dice1: number
  dice2: number
  diceSum: number
  rowLabels: string[]
  rowPoints: number[]
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
</script>

<template>
  <!-- Nagłówki kolumn (numery 1-6) -->
  <div class="col-headers">
    <div class="corner"></div>
    <div
      v-for="col in 6"
      :key="`col-${col}`"
      class="col-header"
      :class="{ highlight: props.dice1 === col || props.dice2 === col }"
    >
      {{ col }}
    </div>
  </div>

  <!-- Wiersze planszy -->
  <div
    v-for="(row, rowIndex) in props.board"
    :key="`row-${rowIndex}`"
    class="board-row"
  >
    <div class="row-header" :class="{ highlight: activeRowIndex === rowIndex }">
      <span class="row-number">{{ props.rowLabels[rowIndex] }}</span>
      <span class="row-points">{{ props.rowPoints[rowIndex] }}p</span>
    </div>

    <div
      v-for="(cell, colIndex) in row"
      :key="`cell-${rowIndex}-${colIndex}`"
      class="cell"
      :class="[
        cell.type,
        {
          clickable: cell.type === 'empty',
          'col-highlight': props.dice1 === colIndex + 1 || props.dice2 === colIndex + 1,
          'row-highlight': activeRowIndex === rowIndex,
        },
      ]"
      @click="emit('cell-click', rowIndex, colIndex)"
    >
      <span v-if="cell.type === 'house'" class="cell-icon">🏠</span>
      <span v-else-if="cell.type === 'forest'" class="cell-icon">🌲</span>
      <span v-else-if="cell.type === 'lake'" class="cell-icon">💧</span>
      <span v-else-if="cell.type === 'square'" class="cell-icon">⬜</span>
    </div>
  </div>
</template>
