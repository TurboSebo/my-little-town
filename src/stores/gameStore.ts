import { defineStore } from 'pinia'

export interface GameState {
  currentRound: number
  dice: [number, number]
  currentPhase: 'planning' | 'building' | 'bonus' | 'scoring'
  players: Player[]
}

export interface Player {
  id: number
  name: string
  board: Cell[][]
  score: number
  usedBonuses: string[]
}

export interface Cell {
  type: 'empty' | 'house' | 'forest' | 'lake' | 'factory' | 'park'
  column: number
  row: number
  occupied: boolean
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    currentRound: 1,
    dice: [1, 1],
    currentPhase: 'planning',
    players: [],
  }),

  actions: {
    rollDice() {
      this.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
      this.currentPhase = 'building'
    },

    //Dodawanie gracza
    addPlayer(name: string) {
      const newPlayer: Player = {
        id: this.players.length + 1,
        name,
        board: this.createEmptyBoard(),
        score: 0,
        usedBonuses: [],
      }
      this.players.push(newPlayer)
    },

    createEmptyBoard(): Cell[][] {
      // Placeholder: Tworzy pustą planszę 5x5 z pustymi komórkami
      return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, column) => ({
          type: 'empty',
          column,
          row,
          occupied: false,
        })),
      )
    },
  },

  getters: {
    //obliczanie sumy kości
    diceSum: (state: GameState): number => {
      return state.dice[0] + state.dice[1]
    },
    //sprawdzenie czy gra się może rozpocząć

    canStartGame: (state: GameState): boolean => {
      return state.players.length >= 1
    },
  },
})
