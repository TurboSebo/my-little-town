<script setup lang="ts">
import type { CellType } from '@/stores/GameStore'

// ZMIANA: Dodano props dla wybranego projektu, dostępnych projektów i disabled
const props = defineProps<{
  selectedProject: CellType | null
  availableProjects: CellType[]
  disabled: boolean // NOWE: Blokada legendy
}>()

const emit = defineEmits<{
  (e: 'select-project', projectType: CellType): void
}>()

// Funkcja sprawdzająca czy projekt jest dostępny
const isAvailable = (projectType: CellType): boolean => {
  return props.availableProjects.includes(projectType)
}
</script>

<template>
  <div class="legend" :class="{ disabled: props.disabled }">
    <h3>Legenda (kliknij aby wybrać)</h3>

    <!-- ZMIANA: Interaktywne elementy legendy -->
    <div
      class="legend-item"
      :class="{
        selected: props.selectedProject === 'house',
        available: isAvailable('house'),
        disabled: !isAvailable('house') || props.disabled,
      }"
      @click="!props.disabled && isAvailable('house') && emit('select-project', 'house')"
    >
      <span class="icon house-icon">🏠</span>
      <span>Dom (1, 4)</span>
    </div>

    <div
      class="legend-item"
      :class="{
        selected: props.selectedProject === 'forest',
        available: isAvailable('forest'),
        disabled: !isAvailable('forest') || props.disabled,
      }"
      @click="!props.disabled && isAvailable('forest') && emit('select-project', 'forest')"
    >
      <span class="icon forest-icon">🌲</span>
      <span>Las (2, 5)</span>
    </div>

    <div
      class="legend-item"
      :class="{
        selected: props.selectedProject === 'lake',
        available: isAvailable('lake'),
        disabled: !isAvailable('lake') || props.disabled,
      }"
      @click="!props.disabled && isAvailable('lake') && emit('select-project', 'lake')"
    >
      <span class="icon lake-icon">💧</span>
      <span>Staw (3, 6)</span>
    </div>

    <div
      class="legend-item"
      :class="{
        selected: props.selectedProject === 'square',
        available: isAvailable('square'),
        disabled: !isAvailable('square') || props.disabled,
      }"
      @click="!props.disabled && isAvailable('square') && emit('select-project', 'square')"
    >
      <span class="icon square-icon">⬜</span>
      <span>Plac (dublet)</span>
    </div>

    <!-- NOWY: Fabryka -->
    <div
      class="legend-item"
      :class="{
        selected: props.selectedProject === 'factory',
        available: isAvailable('factory'),
        disabled: !isAvailable('factory') || props.disabled,
      }"
      @click="!props.disabled && isAvailable('factory') && emit('select-project', 'factory')"
    >
      <span class="icon factory-icon">🏭</span>
      <span>Fabryka (dubel projektowy)</span>
    </div>
  </div>
</template>

<style scoped>
.legend {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s;
}

/* NOWE: Legenda zablokowana */
.legend.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.legend h3 {
  margin: 0 0 1rem 0;
}

.legend-item {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-item.available {
  background: #e8f5e9;
}

.legend-item.available:hover {
  background: #c8e6c9;
  transform: scale(1.05);
}

.legend-item.selected {
  background: #4caf50;
  color: white;
  font-weight: bold;
}

.legend-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon {
  font-size: 1.5rem;
}
</style>
