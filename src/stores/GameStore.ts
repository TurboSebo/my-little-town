import { defineStore } from 'pinia'

// NOWE TYPY: Dodano 'factory' do typu Cell
export type CellType = 'empty' | 'house' | 'forest' | 'lake' | 'square' | 'factory'

export interface GameState {
    currentRound: number
    dice: [number | null, number | null]
    currentPhase: 'planning' | 'building' | 'bonus' | 'scoring'
    players: Player[]
    totalScore: number
    selectedProject: CellType | null
    tempChanges: { row: number; col: number; type: CellType }[]
    roundScores: number[]
    usedBonusRounds: Set<number>
    changesCommitted: boolean
    diceRolledThisRound: boolean
    squarePlacedOnBoard: boolean
}

export interface Player {
    id: number
    name: string
    board: Cell[][]
    score: number
    usedBonuses: string[]
}

export interface Cell {
    type: CellType
    column: number
    row: number
    occupied: boolean
    points: number
}

export const useGameStore = defineStore('game', {
    state: (): GameState => ({
        currentRound: 0,
        dice: [null, null],
        currentPhase: 'planning',
        players: [],
        totalScore: 0,
        selectedProject: null,
        tempChanges: [],
        roundScores: Array(9).fill(0),
        usedBonusRounds: new Set(),
        changesCommitted: false,
        diceRolledThisRound: false,
        squarePlacedOnBoard: false,
    }),

    actions: {
        // ZMIANA: Rzut kostkami - dozwolony tylko raz na rundę
        rollDice() {
            if (this.diceRolledThisRound) {
                // POPRAWKA: Poprawiony komunikat
                console.warn('⚠️ Już rzuciłeś kostkami w tej rundzie! Musisz najpierw postawić projekty i kliknąć "Zapisz zmiany".')
                return
            }

            if (this.changesCommitted) {
                console.warn(
                    '⚠️ Nie możesz rzucać kostkami ponownie! Kliknij "Następna runda" aby przejść do kolejnej rundy.'
                )
                return
            }

            if (this.currentPhase === 'planning' || this.currentPhase === 'building') {
                this.dice = [
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1,
                ]
                this.currentPhase = 'building'
                this.diceRolledThisRound = true
                this.changesCommitted = false
                this.tempChanges = []
                this.selectedProject = null
                // NOWY: Potwierdzenie rzutu
                console.log(`🎲 Rzucono kostkami: ${this.dice[0]} i ${this.dice[1]} (suma: ${this.diceSum})`)
            }
        },

        // NOWE: Rozpocznij grę
        startGame() {
            if (this.currentPhase === 'planning' && this.currentRound === 0) {
                this.currentRound = 0
                this.currentPhase = 'planning'
                this.changesCommitted = false
                this.diceRolledThisRound = false
                this.tempChanges = []
                this.selectedProject = null
                this.dice = [null, null]
                this.squarePlacedOnBoard = false
                console.log('🎮 Gra rozpoczęta! Faza planowania - rzuć kostkami aby rozpocząć.')
            }
        },

        // ZMIANA: Przejście do następnej rundy
        nextRound(maxRounds = 9) {
            if (this.tempChanges.length > 0) {
                console.warn('⚠️ Nie możesz przejść do następnej rundy! Pozostały niezapisane zmiany. Kliknij "Zapisz zmiany" najpierw.')
                return
            }

            if (!this.changesCommitted) {
                console.warn('⚠️ Nie możesz przejść do następnej rundy! Musisz najpierw rzucić kostkami i postawić projekty.')
                return
            }

            if (this.currentRound < maxRounds) {
                this.currentRound += 1
                this.currentPhase = 'building'
                this.changesCommitted = false
                this.diceRolledThisRound = false
                this.tempChanges = []
                this.selectedProject = null
                this.dice = [null, null]
                this.squarePlacedOnBoard = false
                console.log(`✅ Przeszedłeś do rundy ${this.currentRound}/${maxRounds}. Rzuć kostkami aby kontynuować.`)
            } else {
                this.currentPhase = 'scoring'
                this.calculateFinalScore()
                console.log(`🏁 Koniec gry! Łączny wynik: ${this.totalScore} punktów`)
            }
        },

        // NOWE: Wybór projektu z legendy
        selectProject(projectType: CellType) {
            if (projectType === 'square' && this.squarePlacedOnBoard) {
                console.warn('⚠️ Już postawiłeś plac na planszy! Możesz postawić go tylko raz.')
                return
            }

            this.selectedProject = projectType
            // NOWY: Potwierdzenie wyboru
            console.log(`📍 Wybrałeś projekt: ${projectType}. Teraz kliknij na pole na planszy aby go postawić.`)
        },

        // NOWE: Umieszczenie projektu na planszy (tymczasowo)
        placeProjectTemp(row: number, col: number) {
            if (!this.selectedProject || this.selectedProject === 'empty') return

            if (!this.diceRolledThisRound) {
                console.warn('⚠️ Najpierw musisz rzucić kostkami!')
                return
            }

            if (this.changesCommitted) {
                console.warn('⚠️ Już zapisałeś zmiany w tej rundzie! Kliknij "Następna runda" aby kontynuować.')
                return
            }

            const validationResult = this.validateColumnForProject(col, this.selectedProject)
            if (!validationResult.isValid) {
                console.warn(`⚠️ ${validationResult.message}`)
                return
            }

            if (this.isProjectAlreadyInColumn(col, this.selectedProject)) {
                console.warn(`⚠️ W kolumnie ${col + 1} już postawiłeś projekt typu ${this.selectedProject}!`)
                return
            }

            const existingIndex = this.tempChanges.findIndex(
                (change) => change.row === row && change.col === col,
            )

            if (existingIndex !== -1) {
                this.tempChanges[existingIndex]!.type = this.selectedProject
                console.log(`🔄 Zmieniono projekt w kolumnie ${col + 1} na: ${this.selectedProject}`)
            } else {
                this.tempChanges.push({
                    row,
                    col,
                    type: this.selectedProject,
                })
                console.log(`✅ Postawiono ${this.selectedProject} w kolumnie ${col + 1}`)

                if (this.selectedProject === 'square') {
                    this.squarePlacedOnBoard = true
                }
            }
        },

        // NOWE: Usunięcie wszystkich tymczasowych zmian
        clearTempChanges() {
            if (this.tempChanges.length > 0) {
                console.log(`🗑️ Usunięto ${this.tempChanges.length} tymczasowy/tymczasowe projekt/projekty`)
            }
            this.tempChanges = []
            this.squarePlacedOnBoard = false
        },

        // NOWE: Zapisanie zmian na planszy
        saveChanges() {
            if (this.players.length === 0) return

            const player = this.players[0]!

            const allProjectsPlaced = this.validateAllProjectsPlaced()
            if (!allProjectsPlaced.isValid) {
                console.warn(`⚠️ ${allProjectsPlaced.message}`)
                return
            }

            this.tempChanges.forEach((change) => {
                const cell = player.board[change.row]?.[change.col]
                if (cell && !cell.occupied) {
                    cell.type = change.type
                    cell.occupied = true
                }
            })

            console.log(`💾 Zapisano ${this.tempChanges.length} projekt/projekty na planszy.`)
            this.tempChanges = []
            this.changesCommitted = true
            this.selectedProject = null

            if (this.currentRound > 0) {
                this.calculateRoundScore()
                console.log(`📊 Punkty za rundę ${this.currentRound}: ${this.roundScores[this.currentRound - 1]}`)
            }
        },

        // NOWE: Obliczanie punktów za rundę
        calculateRoundScore() {
            if (this.players.length === 0 || this.currentRound === 0) return

            const player = this.players[0]!
            let roundScore = 0

            player.board.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.occupied && cell.type !== 'empty') {
                        roundScore += cell.points
                    }
                })
            })

            this.roundScores[this.currentRound - 1] = roundScore
            this.totalScore = this.roundScores.reduce((sum, score) => sum + score, 0)
        },

        // NOWE: Obliczanie końcowych punktów
        calculateFinalScore() {
            if (this.players.length === 0) return

            const player = this.players[0]!

            let factoryBonus = 0
            let squareBonus = 0

            player.board.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.type === 'factory') {
                        factoryBonus += 3
                    }
                    if (cell.type === 'square') {
                        squareBonus += 2
                    }
                })
            })

            this.totalScore += factoryBonus + squareBonus
        },

        // NOWE: Użycie bonusu w rundzie 3, 6 lub 9
        useBonusRound(round: number, projectType: CellType) {
            if ([3, 6, 9].includes(round) && !this.usedBonusRounds.has(round)) {
                this.usedBonusRounds.add(round)
                this.selectedProject = projectType
            }
        },

        // Dodawanie gracza
        addPlayer(name: string) {
            const newPlayer: Player = {
                id: this.players.length + 1,
                name,
                board: this.createEmptyBoard(),
                score: 0,
                usedBonuses: [],
            }
            this.players.push(newPlayer)
            console.log(`👤 Dodano gracza: ${name}`)
        },

        // ZMIANA: Tworzenie planszy z punktami
        createEmptyBoard(): Cell[][] {
            const pointsGrid = [
                [3, 3, 2, 2, 0, 3],
                [0, 1, 0, 0, 1, 0],
                [2, 0, 1, 1, 0, 2],
                [0, 0, 1, 0, 1, 0],
                [3, 0, 2, 2, 0, 3],
            ] as const

            return Array.from({ length: 5 }, (_, row) =>
                Array.from({ length: 6 }, (_, column) => ({
                    type: 'empty' as CellType,
                    column,
                    row,
                    occupied: false,
                    points: pointsGrid[row]![column]!,
                })),
            )
        },

        /* ============================================
           FUNKCJE WALIDACYJNE
           ============================================ */

        validateColumnForProject(col: number, projectType: CellType): { isValid: boolean; message: string } {
            const colNumber = col + 1
            const [die1, die2] = this.dice

            if (die1 === null || die2 === null) {
                return { isValid: false, message: 'Musisz najpierw rzucić kostkami!' }
            }

            if (projectType === 'square') {
                return { isValid: true, message: '' }
            }

            if (die1 === die2) {
                if (colNumber === die1) {
                    return { isValid: true, message: '' }
                }
                return {
                    isValid: false,
                    message: `Dubel (${die1},${die2}): ${projectType} musi być w kolumnie ${die1}. Plac może być w dowolnym pustym polu.`,
                }
            }

            const projectToValues: { [key in CellType]?: [number, number] } = {
                house: [1, 4],
                forest: [2, 5],
                lake: [3, 6],
            }

            const projectValues = projectToValues[projectType] as [number, number] | undefined
            if (!projectValues) {
                return { isValid: true, message: '' }
            }

            const [proj1, proj2] = projectValues

            if (die1 === proj1 && colNumber === die2) {
                return { isValid: true, message: '' }
            }
            if (die1 === proj2 && colNumber === die2) {
                return { isValid: true, message: '' }
            }

            if (die2 === proj1 && colNumber === die1) {
                return { isValid: true, message: '' }
            }
            if (die2 === proj2 && colNumber === die1) {
                return { isValid: true, message: '' }
            }

            if (projectType === 'factory') {
                if (colNumber === die1 || colNumber === die2) {
                    return { isValid: true, message: '' }
                }
            }

            return {
                isValid: false,
                message: `Kostki: ${die1} i ${die2}. ${projectType} musi być w kolumnie ${die1} (kostka 2) LUB ${die2} (kostka 1).`,
            }
        },

        isProjectAlreadyInColumn(col: number, projectType: CellType): boolean {
            return this.tempChanges.some(
                (change) => change.col === col && change.type === projectType
            )
        },

        validateAllProjectsPlaced(): { isValid: boolean; message: string } {
            const [die1, die2] = this.dice

            if (die1 === null || die2 === null) {
                return {
                    isValid: false,
                    message: 'Musisz najpierw rzucić kostkami!',
                }
            }

            if (this.tempChanges.length === 0) {
                return {
                    isValid: false,
                    message: 'Musisz postawić przynajmniej jeden projekt!',
                }
            }

            if (die1 === die2) {
                const hasProjectInColumn = this.tempChanges.some((c) => c.col === die1 - 1)
                if (!hasProjectInColumn) {
                    return {
                        isValid: false,
                        message: `Dubel (${die1},${die2}): Musisz postawić projekt w kolumnie ${die1}!`,
                    }
                }
            }

            const isDubletProject =
                (die1 === 1 && die2 === 4) ||
                (die1 === 4 && die2 === 1) ||
                (die1 === 2 && die2 === 5) ||
                (die1 === 5 && die2 === 2) ||
                (die1 === 3 && die2 === 6) ||
                (die1 === 6 && die2 === 3)

            if (isDubletProject) {
                const hasCol1 = this.tempChanges.some((c) => c.col === die1 - 1)
                const hasCol2 = this.tempChanges.some((c) => c.col === die2 - 1)

                if (!hasCol1 || !hasCol2) {
                    return {
                        isValid: false,
                        message: `Dubel projektowy (${die1},${die2}): Musisz postawić projekty w OBIE kolumnach: ${die1} i ${die2}!`,
                    }
                }
            }

            return { isValid: true, message: '' }
        },
    },

    getters: {
        diceSum: (state: GameState): number => {
            if (state.dice[0] === null || state.dice[1] === null) {
                return 0
            }
            return state.dice[0] + state.dice[1]
        },

        dice1: (state: GameState): number | null => state.dice[0],
        dice2: (state: GameState): number | null => state.dice[1],

        canStartGame: (state: GameState): boolean => {
            return state.players.length >= 1
        },

        canProceedToNextRound: (state: GameState): boolean => {
            return state.tempChanges.length === 0 && state.changesCommitted
        },

        isPlanning: (state: GameState): boolean => {
            return state.currentRound === 0
        },

        canRollDice: (state: GameState): boolean => {
            return !state.diceRolledThisRound && !state.changesCommitted
        },

        availableProjects: (state: GameState): CellType[] => {
            if (state.dice[0] === null || state.dice[1] === null) {
                return []
            }

            const [die1, die2] = state.dice
            const projects: CellType[] = []

            if (die1 === 1 || die1 === 4) projects.push('house')
            if (die1 === 2 || die1 === 5) projects.push('forest')
            if (die1 === 3 || die1 === 6) projects.push('lake')

            if ((die2 === 1 || die2 === 4) && !projects.includes('house')) projects.push('house')
            if ((die2 === 2 || die2 === 5) && !projects.includes('forest'))
                projects.push('forest')
            if ((die2 === 3 || die2 === 6) && !projects.includes('lake')) projects.push('lake')

            if (die1 === die2) {
                projects.push('square')
            }

            if (
                (die1 === 1 && die2 === 4) ||
                (die1 === 4 && die2 === 1) ||
                (die1 === 2 && die2 === 5) ||
                (die1 === 5 && die2 === 2) ||
                (die1 === 3 && die2 === 6) ||
                (die1 === 6 && die2 === 3)
            ) {
                projects.push('factory')
            }

            return projects
        },

        allowedColumns: (state: GameState): number[] => {
            if (state.dice[0] === null || state.dice[1] === null) {
                return []
            }
            return [state.dice[0], state.dice[1]]
        },
    },
})
