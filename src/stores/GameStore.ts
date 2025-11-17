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
    // Ile projektów zapisano w bieżącej rundzie (po saveChanges)
    placementsThisRound: number
    // Jakie typy projektów bonusowych zostały już wykorzystane (house/forest/lake)
    usedBonusProjects: Set<CellType>
    changesCommitted: boolean
    diceRolledThisRound: boolean
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
        placementsThisRound: 0,
        usedBonusProjects: new Set(),
        changesCommitted: false,
        diceRolledThisRound: false,
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
                this.placementsThisRound = 0
                this.usedBonusProjects = new Set()
                console.log('🎮 Gra rozpoczęta! Faza planowania - rzuć kostkami aby rozpocząć.')
            }
        },

        // ZMIANA: Przejście do następnej rundy
        nextRound(maxRounds = 9) {
            // Z fazy bonus: zapisz bonus, przejdź do następnej rundy
            if (this.currentPhase === 'bonus') {
                if (this.tempChanges.length > 0) {
                    console.warn('⚠️ Nie możesz przejść do następnej rundy! Pozostały niezapisane zmiany. Kliknij "Zapisz zmiany" najpierw.')
                    return
                }
                
                if (this.currentRound < maxRounds) {
                    this.currentRound += 1
                    this.currentPhase = 'building'
                    this.changesCommitted = false
                    this.diceRolledThisRound = false
                    this.tempChanges = []
                    this.placementsThisRound = 0
                    this.selectedProject = null
                    this.dice = [null, null]
                    console.log(`✅ Przeszedłeś do rundy ${this.currentRound}/${maxRounds}. Rzuć kostkami aby kontynuować.`)
                } else {
                    this.currentPhase = 'scoring'
                    this.calculateFinalScore()
                    console.log(`🏁 Koniec gry! Łączny wynik: ${this.totalScore} punktów`)
                }
                return
            }

            // Standardowy przepływ: building -> next round
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
                this.placementsThisRound = 0
                this.selectedProject = null
                this.dice = [null, null]
                console.log(`✅ Przeszedłeś do rundy ${this.currentRound}/${maxRounds}. Rzuć kostkami aby kontynuować.`)
            } else {
                this.currentPhase = 'scoring'
                this.calculateFinalScore()
                console.log(`🏁 Koniec gry! Łączny wynik: ${this.totalScore} punktów`)
            }
        },

        // NOWE: Wybór projektu z legendy
        selectProject(projectType: CellType) {
            // Nie pozwalaj wybrać bonusowego projektu, jeśli już został użyty
            // Nie pozwalaj wybrać bonusowego projektu, jeśli już został użyty
            if ((projectType === 'house' || projectType === 'forest' || projectType === 'lake') && this.currentPhase === 'bonus') {
                if (this.usedBonusProjects.has(projectType)) {
                    console.warn('⚠️ Ten projekt bonusowy został już wykorzystany w poprzedniej rundzie.')
                    return
                }
            }

            // W fazie planowania dozwolone tylko podstawowe projekty
            if (this.currentPhase === 'planning' && !['house', 'forest', 'lake'].includes(projectType)) {
                console.warn('⚠️ W fazie planowania możesz stawiać wyłącznie Dom/Las/Staw.')
                return
            }

            this.selectedProject = projectType
            console.log(`📍 Wybrałeś projekt: ${projectType}. Teraz kliknij na pole na planszy aby go postawić.`)
        },

        // NOWE: Umieszczenie projektu na planszy (tymczasowo)
        placeProjectTemp(row: number, col: number) {
            if (!this.selectedProject || this.selectedProject === 'empty') return

            if (this.changesCommitted) {
                console.warn('⚠️ Już zapisałeś zmiany w tej rundzie! Kliknij "Następna runda" aby kontynuować.')
                return
            }

            const player = this.players[0]

            // Faza planowania: brak rzutów, gracz może postawić 2 różne podstawowe projekty
            if (this.currentPhase === 'planning') {
                if (!player) return
                if (!['house', 'forest', 'lake'].includes(this.selectedProject)) {
                    console.warn('⚠️ W fazie planowania możesz stawiać tylko Dom/Las/Staw.')
                    return
                }

                if (this.tempChanges.length >= 2) {
                    console.warn('⚠️ W fazie planowania możesz postawić maksymalnie 2 projekty.')
                    return
                }

                // Nie pozwalaj na dwa takie same typy w fazie planowania
                if (this.tempChanges.some((c) => c.type === this.selectedProject)) {
                    console.warn('⚠️ W fazie planowania musisz postawić dwa różne projekty.')
                    return
                }

                // Sprawdź czy pole puste
                const cell = player.board[row]?.[col]
                if (!cell || cell.occupied) {
                    console.warn('⚠️ To pole jest zajęte.')
                    return
                }

                this.tempChanges.push({ row, col, type: this.selectedProject })
                console.log(`✅ [Planowanie] Tymczasowo: ${this.selectedProject} na polu (${row},${col})`)
                return
            }

            // NOWE: Faza bonusowa - bez walidacji kolumnowej, na dowolnym pustym polu
            if (this.currentPhase === 'bonus') {
                if (!player) return
                if (!['house', 'forest', 'lake'].includes(this.selectedProject)) {
                    console.warn('⚠️ W fazie bonusowej możesz postawić tylko Dom/Las/Staw.')
                    return
                }

                // Gracz może postawić MAX 1 projekt bonusowy w fazie bonus
                if (this.tempChanges.length >= 1) {
                    console.warn('⚠️ W fazie bonusowej możesz postawić maksymalnie 1 projekt.')
                    return
                }

                // Sprawdź czy pole puste (zajęte pola to te z occupied=true)
                const cell = player.board[row]?.[col]
                if (!cell || cell.occupied) {
                    console.warn('⚠️ To pole jest zajęte.')
                    return
                }

                this.tempChanges.push({ row, col, type: this.selectedProject })
                console.log(`✅ [Bonus] Tymczasowo: ${this.selectedProject} na polu (${row},${col})`)
                return
            }

            // Poniżej: faza building - wymagane zasady o kolumnach
            if (!this.diceRolledThisRound && this.currentPhase === 'building') {
                console.warn('⚠️ Najpierw musisz rzucić kostkami!')
                return
            }

            const validationResult = this.validateColumnForProject(col, this.selectedProject)
            if (!validationResult.isValid) {
                console.warn(`⚠️ ${validationResult.message}`)
                return
            }

            // PUNKT 14 + 18: Walidacja duplikatów - nie pozwalaj na postawienie tego samego projektu więcej niż raz w rundzie
            const alreadyTempThisRound = this.tempChanges.some((c) => c.type === this.selectedProject)
            if (alreadyTempThisRound) {
                console.warn(`⚠️ W tej rundzie już postawiłeś ${this.selectedProject}. Możesz postawić każdy projekt tylko raz na rundę.`)
                return
            }

            // PUNKT 18 + 20: Przy dublu projektowym - jeśli już postawiono projekt, fabryka musi być w drugiej kolumnie
            const [die1, die2] = this.dice
            const isDublProjektowy = die1 !== null && die2 !== null &&
                ((die1 === 1 && die2 === 4) || (die1 === 4 && die2 === 1) ||
                (die1 === 2 && die2 === 5) || (die1 === 5 && die2 === 2) ||
                (die1 === 3 && die2 === 6) || (die1 === 6 && die2 === 3))
            
            if (isDublProjektowy && this.selectedProject === 'factory') {
                // Sprawdź czy już postawiono projekt w tej rundzie
                const existingProject = this.tempChanges.find(c => ['house', 'forest', 'lake'].includes(c.type))
                if (!existingProject) {
                    console.warn('⚠️ Przy dublu projektowym najpierw postaw projekt (dom/las/staw), potem fabrykę w drugiej kolumnie!')
                    return
                }
                
                // PUNKT 20: Sprawdź czy fabryka nie jest w tej samej kolumnie co projekt
                if (existingProject.col === col) {
                    console.warn('⚠️ Fabryka musi być w innej kolumnie niż projekt podstawowy!')
                    return
                }
            }

            const cell = player?.board[row]?.[col]
            if (!cell) return
            if (cell.occupied && !this.tempChanges.some((c) => c.row === row && c.col === col)) {
                console.warn('⚠️ To pole jest już zajęte.')
                return
            }

            const existingIndex = this.tempChanges.findIndex((c) => c.row === row && c.col === col)
            if (existingIndex !== -1) {
                this.tempChanges[existingIndex]!.type = this.selectedProject
                console.log(`🔄 Zmieniono tymczasowo pole (${row},${col}) na ${this.selectedProject}`)
            } else {
                this.tempChanges.push({ row, col, type: this.selectedProject })
                console.log(`✅ Tymczasowo postawiono ${this.selectedProject} na (${row},${col})`)
            }
        },

        // NOWE: Usunięcie wszystkich tymczasowych zmian
        clearTempChanges() {
            if (this.tempChanges.length > 0) {
                console.log(`🗑️ Usunięto ${this.tempChanges.length} tymczasowy/tymczasowe projekt/projekty`)
            }
            this.tempChanges = []
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

            const committedCount = this.tempChanges.length
            console.log(`💾 Zapisano ${committedCount} projekt/projekty na planszy.`)

            // Jeśli któryś z zapisanych projektów jest projektem bonusowym i jesteśmy w fazie bonus,
            // zarejestruj użycie tego typu projektu
            if (this.currentPhase === 'bonus') {
                this.tempChanges.forEach((c) => {
                    if (c.type === 'house' || c.type === 'forest' || c.type === 'lake') {
                        this.usedBonusProjects.add(c.type)
                    }
                })
                // Zarejestruj użycie rundy bonusowej
                this.usedBonusRounds.add(this.currentRound)
            }

            this.tempChanges = []
            this.placementsThisRound = (this.placementsThisRound || 0) + committedCount
            this.changesCommitted = true
            this.selectedProject = null

            // Jeśli to runda bonusowa (3,6,9) i jesteśmy w fazie building po standardowym zapisie projektów,
            // przejdź do fazy bonusowej aby umożliwić postawienie darmowego projektu bonusowego.
            if ([3, 6, 9].includes(this.currentRound) && this.currentPhase === 'building') {
                this.currentPhase = 'bonus'
                this.changesCommitted = false  // Zresetuj, aby gracz mógł wstawić bonus
                console.log('⭐ Aktywowano fazę bonusową — możesz teraz postawić darmowy projekt bonusowy (lub pominąć).')
            }

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
                this.currentPhase = 'bonus'
                this.selectedProject = projectType
                console.log(`⭐ Faza bonusowa dla rundy ${round}: możesz postawić ${projectType}`)
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
            // W fazie bonusowej projekt bonusowy można postawić gdziekolwiek
            if (this.currentPhase === 'bonus') {
                return { isValid: true, message: '' }
            }

            const [die1, die2] = this.dice

            if (die1 === null || die2 === null) {
                return { isValid: false, message: 'Musisz najpierw rzucić kostkami!' }
            }

            if (projectType === 'square') {
                return { isValid: true, message: '' }
            }

            // Helper: sprawdź czy kolumna ma wolne miejsce
            const colHasSpace = (colNum: number) => {
                const board = this.players[0]?.board
                if (!board) return false
                const colIdx = (colNum - 1 + 6) % 6
                return board.some((row) => !!row[colIdx] && !row[colIdx].occupied)
            }
            
            // PUNKT 23: Helper - zlicz liczbę wolnych pól w kolumnie
            const countFreeSpaces = (colNum: number): number => {
                const board = this.players[0]?.board
                if (!board) return 0
                const colIdx = (colNum - 1 + 6) % 6
                return board.filter((row) => !!row[colIdx] && !row[colIdx].occupied).length
            }

            // Helper: znajdź kolumny alternatywne dla danej kolumny primary
            const findAltColumns = (primaryCol: number): number[] => {
                const alts: number[] = []
                if (!colHasSpace(primaryCol)) {
                    for (let r = 1; r < 6; r++) {
                        const left = ((primaryCol - 1 - r + 6) % 6) + 1
                        const right = ((primaryCol - 1 + r) % 6) + 1
                        const leftFree = colHasSpace(left)
                        const rightFree = colHasSpace(right)
                        
                        // Reguła a) Jedna pełna, druga z wolnym polem
                        if (leftFree && !rightFree) {
                            alts.push(left)
                            break
                        }
                        if (!leftFree && rightFree) {
                            alts.push(right)
                            break
                        }
                        
                        // PUNKT 23: Reguły b) i c) - obie mają wolne pola
                        if (leftFree && rightFree) {
                            const leftCount = countFreeSpaces(left)
                            const rightCount = countFreeSpaces(right)
                            
                            if (leftCount > rightCount) {
                                // Reguła b) - lewa ma więcej, tylko lewa dozwolona
                                alts.push(left)
                            } else if (rightCount > leftCount) {
                                // Reguła b) - prawa ma więcej, tylko prawa dozwolona
                                alts.push(right)
                            } else {
                                // Reguła c) - taka sama liczba, obie dozwolone (gracz wybiera)
                                alts.push(left, right)
                            }
                            break
                        }
                    }
                }
                return alts
            }

            // PUNKT 18: Dubel projektowy (1,4), (4,1), (2,5), (5,2), (3,6), (6,3)
            const isDublProjektowy = 
                (die1 === 1 && die2 === 4) || (die1 === 4 && die2 === 1) ||
                (die1 === 2 && die2 === 5) || (die1 === 5 && die2 === 2) ||
                (die1 === 3 && die2 === 6) || (die1 === 6 && die2 === 3)

            // PUNKT 18: Logika fabryki - tylko przy dublu projektowym
            if (projectType === 'factory') {
                if (!isDublProjektowy) {
                    return { isValid: false, message: 'Fabrykę można postawić tylko przy dublu projektowym (1,4 / 2,5 / 3,6)!' }
                }
                
                // Przy dublu projektowym: fabryka może być w die1 LUB die2
                const primaryCols = [die1, die2]
                if (primaryCols.includes(colNumber)) {
                    return { isValid: true, message: '' }
                }
                
                // PUNKT 19: Sprawdź kolumny alternatywne dla fabryki
                const allAltCols: number[] = []
                primaryCols.forEach(pc => allAltCols.push(...findAltColumns(pc)))
                if (allAltCols.includes(colNumber)) {
                    return { isValid: true, message: '' }
                }
                
                return { 
                    isValid: false, 
                    message: `Fabryka przy dublu (${die1},${die2}) musi być w kolumnie ${die1} lub ${die2} (lub ich alternatywnej).` 
                }
            }

            // Dubel zwykły (nie projektowy)
            if (die1 === die2) {
                if (colNumber === die1) {
                    return { isValid: true, message: '' }
                }
                // PUNKT 19: Sprawdź alternatywne
                const alts = findAltColumns(die1)
                if (alts.includes(colNumber)) {
                    return { isValid: true, message: '' }
                }
                return {
                    isValid: false,
                    message: `Dubel (${die1},${die2}): ${projectType} musi być w kolumnie ${die1} (lub alternatywnej).`,
                }
            }

            // PUNKT 17: Odwrócona logika - kostka definiuje TYP, druga KOLUMNĘ
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
            let allowedPrimaryCols: number[] = []

            // Jeśli die1 = typ projektu, to kolumna = die2
            if (die1 === proj1 || die1 === proj2) {
                allowedPrimaryCols.push(die2)
            }
            // Jeśli die2 = typ projektu, to kolumna = die1
            if (die2 === proj1 || die2 === proj2) {
                allowedPrimaryCols.push(die1)
            }

            // Sprawdź czy kolumna jest w primary
            if (allowedPrimaryCols.includes(colNumber)) {
                return { isValid: true, message: '' }
            }

            // PUNKT 19: Sprawdź kolumny alternatywne
            const allAltCols: number[] = []
            allowedPrimaryCols.forEach(pc => allAltCols.push(...findAltColumns(pc)))
            if (allAltCols.includes(colNumber)) {
                return { isValid: true, message: '' }
            }

            return {
                isValid: false,
                message: `Kostki: ${die1} i ${die2}. ${projectType} dozwolony w kolumnie: ${allowedPrimaryCols.join(' lub ')} (lub ich alternatywnej).`,
            }
        },

        isProjectAlreadyInColumn(col: number, projectType: CellType): boolean {
            return this.tempChanges.some(
                (change) => change.col === col && change.type === projectType
            )
        },

        validateAllProjectsPlaced(): { isValid: boolean; message: string } {
            // W fazie planowania wymagane są dokładnie 2 różne podstawowe projekty
            if (this.currentPhase === 'planning') {
                if (this.tempChanges.length !== 2) {
                    return { isValid: false, message: 'W fazie planowania musisz postawić dokładnie 2 projekty.' }
                }

                const types = this.tempChanges.map((c) => c.type)
                if (types.some((t) => !['house', 'forest', 'lake'].includes(t))) {
                    return { isValid: false, message: 'W fazie planowania możesz stawiać tylko Dom/Las/Staw.' }
                }

                const unique = Array.from(new Set(types))
                if (unique.length !== 2) {
                    return { isValid: false, message: 'W fazie planowania projekty muszą być różne.' }
                }

                return { isValid: true, message: '' }
            }

            // W fazie bonus: gracz mógł postawić 0 lub 1 projekt, zawsze OK
            if (this.currentPhase === 'bonus') {
                return { isValid: true, message: '' }
            }

            // Faza building
            const [die1, die2] = this.dice
            if (die1 === null || die2 === null) {
                return { isValid: false, message: 'Musisz najpierw rzucić kostkami!' }
            }

            // NOWE (Punkt 12): Walidacja duplikatów - sprawdź czy gracz nie postawił tego samego projektu
            // więcej niż raz w tej rundzie (dotyczy house/forest/lake/square/factory)
            const projectTypes = ['house', 'forest', 'lake', 'square', 'factory']
            const typeCounts = new Map<CellType, number>()
            this.tempChanges.forEach((c) => {
                if (projectTypes.includes(c.type)) {
                    typeCounts.set(c.type as CellType, (typeCounts.get(c.type as CellType) || 0) + 1)
                }
            })

            for (const [type, count] of typeCounts.entries()) {
                if (count > 1) {
                    return { isValid: false, message: `W tej rundzie możesz postawić ${type} tylko raz!` }
                }
            }

            // Minimalne wymaganie: w rundach zwykłych 2 projekty, w rundach 3/6/9 - 2 projekty (bonus jest osobno)
            // Obsługa szczególnych przypadków:
            // - gdy kostki takie same: wymagany projekt w tej kolumnie oraz plac (square)
            if (die1 === die2) {
                // PUNKT 24: Dubel oczek - projekt podstawowy w kolumnie (lub alternatywnej), plac GDZIEKOLWIEK
                const board = this.players[0]?.board
                const colHasSpace = (colNum: number) => {
                    if (!board) return false
                    const colIdx = (colNum - 1 + 6) % 6
                    return board.some((row) => !!row[colIdx] && !row[colIdx].occupied)
                }
                
                const countFreeSpaces = (colNum: number): number => {
                    if (!board) return 0
                    const colIdx = (colNum - 1 + 6) % 6
                    return board.filter((row) => !!row[colIdx] && !row[colIdx].occupied).length
                }
                
                const findAltColumns = (primaryCol: number): number[] => {
                    const alts: number[] = []
                    if (!colHasSpace(primaryCol)) {
                        for (let r = 1; r < 6; r++) {
                            const left = ((primaryCol - 1 - r + 6) % 6) + 1
                            const right = ((primaryCol - 1 + r) % 6) + 1
                            const leftFree = colHasSpace(left)
                            const rightFree = colHasSpace(right)
                            
                            if (leftFree && !rightFree) {
                                alts.push(left)
                                break
                            }
                            if (!leftFree && rightFree) {
                                alts.push(right)
                                break
                            }
                            if (leftFree && rightFree) {
                                const leftCount = countFreeSpaces(left)
                                const rightCount = countFreeSpaces(right)
                                
                                if (leftCount > rightCount) {
                                    alts.push(left)
                                } else if (rightCount > leftCount) {
                                    alts.push(right)
                                } else {
                                    alts.push(left, right)
                                }
                                break
                            }
                        }
                    }
                    return alts
                }
                
                const hasSquare = this.tempChanges.some((c) => c.type === 'square')
                const projectInPrimary = this.tempChanges.find((c) => 
                    c.col === die1 - 1 && ['house', 'forest', 'lake', 'factory'].includes(c.type)
                )
                
                // Sprawdź czy kolumna primary jest pełna i użyto alternatywnej
                const primaryFree = colHasSpace(die1)
                const allowedCols = [die1]
                if (!primaryFree) {
                    allowedCols.push(...findAltColumns(die1))
                }
                
                const projectInAllowed = this.tempChanges.find((c) => 
                    allowedCols.includes(c.col + 1) && ['house', 'forest', 'lake', 'factory'].includes(c.type)
                )
                
                if (!projectInAllowed) {
                    if (primaryFree) {
                        return { isValid: false, message: `Dubel (${die1}): Musisz postawić projekt w kolumnie ${die1}.` }
                    } else {
                        return { 
                            isValid: false, 
                            message: `Dubel (${die1}): Kolumna ${die1} pełna. Musisz postawić projekt w kolumnie alternatywnej: ${allowedCols.filter(c => c !== die1).join(', ')}.` 
                        }
                    }
                }
                
                if (!hasSquare) {
                    return { isValid: false, message: 'Dubel: Musisz również postawić Plac (square) gdziekolwiek na planszy.' }
                }
                
                return { isValid: true, message: '' }
            }

            // Sprawdź dublet projektowy (np. 1+4) - wymagamy, żeby obie kolumny miały ustawione projekty/factory zgodnie z regułą
            const isDubletProject =
                (die1 === 1 && die2 === 4) ||
                (die1 === 4 && die2 === 1) ||
                (die1 === 2 && die2 === 5) ||
                (die1 === 5 && die2 === 2) ||
                (die1 === 3 && die2 === 6) ||
                (die1 === 6 && die2 === 3)

            if (isDubletProject) {
                // PUNKT 22: Sprawdź czy jedna z kolumn jest pełna i użyto alternatywnej
                const board = this.players[0]?.board
                const colHasSpace = (colNum: number) => {
                    if (!board) return false
                    const colIdx = (colNum - 1 + 6) % 6
                    return board.some((row) => !!row[colIdx] && !row[colIdx].occupied)
                }
                
                const col1Free = colHasSpace(die1)
                const col2Free = colHasSpace(die2)
                
                // Znajdź projekty w tempChanges
                const projectsPlaced = this.tempChanges.filter(c => ['house', 'forest', 'lake', 'factory'].includes(c.type))
                
                if (!col1Free || !col2Free) {
                    // PUNKT 22: Jedna lub obie kolumny pełne - użyto alternatywnej kolumny
                    // Wymagane: przynajmniej 2 projekty postawione (projekt + fabryka lub 2 projekty)
                    if (projectsPlaced.length < 2) {
                        return { isValid: false, message: `Dubel projektowy (${die1},${die2}): Musisz postawić 2 projekty (może być projekt + fabryka).` }
                    }
                    
                    // Sprawdź czy projekty są w dozwolonych kolumnach (primary lub alternatywne)
                    // PUNKT 23: Helper zliczający wolne pola
                    const countFreeSpaces = (colNum: number): number => {
                        if (!board) return 0
                        const colIdx = (colNum - 1 + 6) % 6
                        return board.filter((row) => !!row[colIdx] && !row[colIdx].occupied).length
                    }
                    
                    const findAltColumns = (primaryCol: number): number[] => {
                        const alts: number[] = []
                        if (!colHasSpace(primaryCol)) {
                            for (let r = 1; r < 6; r++) {
                                const left = ((primaryCol - 1 - r + 6) % 6) + 1
                                const right = ((primaryCol - 1 + r) % 6) + 1
                                const leftFree = colHasSpace(left)
                                const rightFree = colHasSpace(right)
                                
                                // Reguła a) Jedna pełna, druga z wolnym polem
                                if (leftFree && !rightFree) {
                                    alts.push(left)
                                    break
                                }
                                if (!leftFree && rightFree) {
                                    alts.push(right)
                                    break
                                }
                                
                                // PUNKT 23: Reguły b) i c) - obie mają wolne pola
                                if (leftFree && rightFree) {
                                    const leftCount = countFreeSpaces(left)
                                    const rightCount = countFreeSpaces(right)
                                    
                                    if (leftCount > rightCount) {
                                        // Reguła b) - lewa ma więcej, tylko lewa dozwolona
                                        alts.push(left)
                                    } else if (rightCount > leftCount) {
                                        // Reguła b) - prawa ma więcej, tylko prawa dozwolona
                                        alts.push(right)
                                    } else {
                                        // Reguła c) - taka sama liczba, obie dozwolone
                                        alts.push(left, right)
                                    }
                                    break
                                }
                            }
                        }
                        return alts
                    }
                    
                    const allowedCols: number[] = []
                    if (col1Free) allowedCols.push(die1)
                    if (col2Free) allowedCols.push(die2)
                    
                    // Dodaj alternatywne dla pełnych
                    if (!col1Free) allowedCols.push(...findAltColumns(die1))
                    if (!col2Free) allowedCols.push(...findAltColumns(die2))
                    
                    // Sprawdź czy wszystkie projekty są w dozwolonych kolumnach
                    const allInAllowed = projectsPlaced.every(p => allowedCols.includes(p.col + 1))
                    if (!allInAllowed) {
                        return { 
                            isValid: false, 
                            message: `Dubel projektowy (${die1},${die2}): Projekty muszą być w kolumnach ${allowedCols.join(', ')} (wylosowane lub alternatywne).` 
                        }
                    }
                    
                    return { isValid: true, message: '' }
                }
                
                // Obie kolumny mają wolne miejsca - standardowa walidacja
                const hasCol1 = this.tempChanges.some((c) => c.col === die1 - 1)
                const hasCol2 = this.tempChanges.some((c) => c.col === die2 - 1)
                if (!hasCol1 || !hasCol2) {
                    return { isValid: false, message: `Dubel projektowy (${die1},${die2}): Musisz postawić projekty w OBIE kolumnach: ${die1} i ${die2}!` }
                }
                // Dopuszczalna kombinacja: projekt + factory (albo dwa projekty różnych typów)
                return { isValid: true, message: '' }
            }

            // W standardowym przypadku wymagamy dokładnie 2 projektów (może być factory jeśli dozwolony)
            if (this.tempChanges.length < 2) {
                return { isValid: false, message: 'Musisz postawić 2 projekty zgodnie z wynikami kostek.' }
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
            // Nie można przejść dalej jeśli są niezapisane zmiany
            if (state.tempChanges.length > 0) return false
            if (!state.changesCommitted) return false

            // W fazie bonus: gracz mógł postawić 0 lub 1 projekt bonusowy, zawsze może przejść dalej
            if (state.currentPhase === 'bonus') {
                return true
            }

            // W fazie planowania (runda 0) — gracz musi zapisać dokładnie 2 projekty
            if (state.currentPhase === 'planning') {
                return state.placementsThisRound === 2
            }

            // W fazie building: potrzebne są 2 projekty na zwykłe rundy
            return state.placementsThisRound >= 2
        },

        // PUNKT 16: Czy można przejść do fazy bonusowej (po zapisie w rundach 3, 6, 9)
        canEnterBonus: (state: GameState): boolean => {
            // Tylko w rundach bonusowych (3, 6, 9) po zapisie w building
            if (![3, 6, 9].includes(state.currentRound)) return false
            if (state.currentPhase !== 'building') return false
            if (!state.changesCommitted) return false
            if (state.tempChanges.length > 0) return false
            return state.placementsThisRound >= 2
        },

        isPlanning: (state: GameState): boolean => {
            return state.currentRound === 0
        },

        canRollDice: (state: GameState): boolean => {
            // W fazie planowania nie można rzucać kostkami
            if (state.currentPhase === 'planning') {
                return false
            }
            return !state.diceRolledThisRound && !state.changesCommitted
        },

        availableProjects: (state: GameState): CellType[] => {
            // Faza planowania: zawsze trzy podstawowe projekty dostępne
            if (state.currentPhase === 'planning') {
                return ['house', 'forest', 'lake']
            }

            // PUNKT 15: Faza bonus - tylko projekty podstawowe (house/forest/lake) niezależnie od kości
            if (state.currentPhase === 'bonus') {
                const all: CellType[] = ['house', 'forest', 'lake']
                return all.filter((t) => !state.usedBonusProjects.has(t))
            }

            // Faza budowania - projekty zależne od kości
            if (state.dice[0] === null || state.dice[1] === null) {
                return []
            }

            const [die1, die2] = state.dice
            const projects: CellType[] = []

            if (die1 === 1 || die1 === 4) projects.push('house')
            if (die1 === 2 || die1 === 5) projects.push('forest')
            if (die1 === 3 || die1 === 6) projects.push('lake')

            if ((die2 === 1 || die2 === 4) && !projects.includes('house')) projects.push('house')
            if ((die2 === 2 || die2 === 5) && !projects.includes('forest')) projects.push('forest')
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

        // Zwraca informację o dozwolonych kolumnach:
        // { primary: number[], alt: number[], anyForSquare: boolean, planning: boolean }
        allowedColumns: (state: GameState) => {
            const info = { primary: [] as number[], alt: [] as number[], anyForSquare: false, planning: false }

            if (state.currentPhase === 'planning' || state.currentPhase === 'bonus') {
                info.planning = true
                return info
            }

            const [die1, die2] = state.dice
            if (die1 === null || die2 === null) return info

            // helper: czy kolumna (1-based) ma wolne pola
            const board = state.players[0]?.board
            const colHasSpace = (colNumber: number) => {
                if (!board) return false
                const colIndex = (colNumber - 1 + 6) % 6
                return board.some((row) => !!row[colIndex] && !row[colIndex].occupied)
            }
            
            // PUNKT 21: Helper - zlicz liczbę wolnych pól w kolumnie
            const countFreeSpaces = (colNumber: number): number => {
                if (!board) return 0
                const colIndex = (colNumber - 1 + 6) % 6
                return board.filter((row) => !!row[colIndex] && !row[colIndex].occupied).length
            }

            // Jeśli gracz wybrał projekt (nie null), oblicz dozwolone kolumny dla tego projektu
            // w oparciu o zalogowany typ projektu.
            // Dla podstawowych projektów (house/forest/lake): mapuj na kolumny (1,4)/(2,5)/(3,6)
            // Dla square/factory: dostępne wszędzie jeśli kosci są równe / dubel
            
            // primary cols bazowane na wylosowanych kostkach
            const primSet = new Set<number>()
            primSet.add(die1)
            primSet.add(die2)

            // ZMIANA (Punkt 17): Logika: kostka definiuje TYP projektu, druga kostka definiuje KOLUMNĘ
            // Przykład: kości 3,2 + wybrano las(2) → podświetl kolumnę 3 (bo 2 na kostce = las, więc 3 = kolumna)
            if (state.selectedProject && ['house', 'forest', 'lake', 'square', 'factory'].includes(state.selectedProject)) {
                let projectPrimary: number[] = []
                
                if (state.selectedProject === 'house') {
                    // PUNKT 24: Dom = 1 lub 4. Jeśli die1=1 lub 4, kolumna=die2. Jeśli die2=1 lub 4, kolumna=die1.
                    // Przy dublu (np. 1,1 lub 4,4) obie kostki definiują ten sam typ i kolumnę
                    if (die1 === 1 || die1 === 4) projectPrimary.push(die2)
                    if (die2 === 1 || die2 === 4) projectPrimary.push(die1)
                } else if (state.selectedProject === 'forest') {
                    // PUNKT 24: Las = 2 lub 5
                    if (die1 === 2 || die1 === 5) projectPrimary.push(die2)
                    if (die2 === 2 || die2 === 5) projectPrimary.push(die1)
                } else if (state.selectedProject === 'lake') {
                    // PUNKT 24: Staw = 3 lub 6
                    if (die1 === 3 || die1 === 6) projectPrimary.push(die2)
                    if (die2 === 3 || die2 === 6) projectPrimary.push(die1)
                } else if (state.selectedProject === 'square') {
                    // Plac jest dostępny wszędzie jeśli kości równe
                    if (die1 === die2) {
                        info.anyForSquare = true
                        info.primary = Array.from(primSet)
                        return info
                    }
                    projectPrimary = Array.from(primSet)
                } else if (state.selectedProject === 'factory') {
                    // PUNKT 18: Fabryka przy dublu projektowym - dostępna w obu kolumnach
                    // Dubel projektowy: (1,4), (4,1), (2,5), (5,2), (3,6), (6,3)
                    const isDublProjektowy = 
                        (die1 === 1 && die2 === 4) || (die1 === 4 && die2 === 1) ||
                        (die1 === 2 && die2 === 5) || (die1 === 5 && die2 === 2) ||
                        (die1 === 3 && die2 === 6) || (die1 === 6 && die2 === 3)
                    
                    if (isDublProjektowy) {
                        projectPrimary = [die1, die2]
                    } else {
                        // Poza dublem projektowym fabryka niedostępna
                        projectPrimary = []
                    }
                }

                info.primary = Array.from(new Set(projectPrimary))

                // Szukaj alternatywnych kolumn TYLKO dla primary które są pełne
                info.primary.forEach((col) => {
                    if (!colHasSpace(col)) {
                        // search radius
                        for (let r = 1; r < 6; r++) {
                            const left = ((col - 1 - r + 6) % 6) + 1
                            const right = ((col - 1 + r) % 6) + 1
                            const leftFree = colHasSpace(left)
                            const rightFree = colHasSpace(right)
                            
                            // Reguła a) Jedna pełna, druga z wolnym polem
                            if (leftFree && !rightFree) {
                                info.alt.push(left)
                                break
                            }
                            if (!leftFree && rightFree) {
                                info.alt.push(right)
                                break
                            }
                            
                            // Reguły b) i c) - obie mają wolne pola
                            if (leftFree && rightFree) {
                                // PUNKT 21: Porównaj liczbę wolnych pól
                                const leftCount = countFreeSpaces(left)
                                const rightCount = countFreeSpaces(right)
                                
                                if (leftCount > rightCount) {
                                    // Reguła b) - lewa ma więcej, podświetl tylko lewą
                                    info.alt.push(left)
                                } else if (rightCount > leftCount) {
                                    // Reguła b) - prawa ma więcej, podświetl tylko prawą
                                    info.alt.push(right)
                                } else {
                                    // Reguła c) - taka sama liczba, gracz wybiera (obie)
                                    info.alt.push(left)
                                    info.alt.push(right)
                                }
                                break
                            }
                        }
                    }
                })

                // remove duplicates
                info.alt = Array.from(new Set(info.alt))
                return info
            }

            // Jeśli nie ma wybranego projektu, zwróć podstawowe primary (kosci)
            // ale BEZ alt-kolumn
            info.primary = Array.from(primSet)
            return info
        },
    },
})
