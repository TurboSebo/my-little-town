<script setup lang="ts">
import type { CellType } from '@/stores/GameStore'

// Props for selected project, available projects, and disabled state
const props = defineProps<{
  selectedProject: CellType | null
  availableProjects: CellType[]
  disabled: boolean // Legend blocking
  usedBonusProjects?: Set<CellType>
}>()

const emit = defineEmits<{
  (e: 'select-project', projectType: CellType): void
}>()

// Function checking if project is available
const isAvailable = (projectType: CellType): boolean => {
  return props.availableProjects.includes(projectType)
}
</script>

<template>
  <div class="legend" :class="{ disabled: props.disabled }">
    <h3>Legenda (kliknij aby wybrać)</h3>

    <!-- Interactive legend elements -->
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
        <span>Dom (1, 4) <span v-if="props.usedBonusProjects && props.usedBonusProjects.has('house')">⭐</span></span>
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
      <span>Las (2, 5) <span v-if="props.usedBonusProjects && props.usedBonusProjects.has('forest')">⭐</span></span>
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
      <span>Staw (3, 6) <span v-if="props.usedBonusProjects && props.usedBonusProjects.has('lake')">⭐</span></span>
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

    <!-- Factory project -->
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

