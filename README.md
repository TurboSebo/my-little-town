# 🏘️ My Little Town (Moje Miasteczko)

A digital implementation of the board game "Rolling Village" - a strategic dice-based city-building game built with Vue 3, TypeScript, and Pinia.

## 📋 Table of Contents

- [Game Overview](#-game-overview)
- [Game Rules](#-game-rules)
- [Features Implemented](#-features-implemented)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup & Development](#-setup--development)
- [Architecture](#-architecture)
- [Documentation](#-documentation)

---

## 🎮 Game Overview

**My Little Town** is a single-player strategic board game where you build a town by placing houses, forests, lakes, squares, and factories on a 5x6 grid over 9 rounds. Each round involves rolling dice to determine where you can place projects, strategically planning to maximize points through project grouping and end-game bonuses.

### Game Objective

Score the most points by:
- Creating connected groups of the same project type in scored rows
- Building squares adjacent to houses, forests, and lakes (+10 points each)
- Placing factories near forests/lakes for bonuses, while avoiding houses/squares

---

## 📜 Game Rules

### Basic Structure

- **Board**: 5 rows × 6 columns grid
- **Duration**: 9 rounds + end-game scoring phase
- **Phases per round**: Planning → Building → Bonus (rounds 3, 6, 9) → Scoring

### Row-Column System

Each row corresponds to specific dice sums:
- Row 1: dice sum 3 or 4 (3 points)
- Row 2: dice sum 5 or 6 (1 point)
- Row 3: dice sum 7 (3 points)
- Row 4: dice sum 8 or 9 (1 point)
- Row 5: dice sum 10 or 11 (3 points)

**Special Case - Manual Row Selection:**
When dice sum equals **2 (1+1)** or **12 (6+6)**:
- Player must **manually select** which row to score
- Click on any row header (`{3,4}`, `{5,6}`, `{7}`, `{8,9}`, `{10,11}`) to choose
- Visual feedback: selected row header turns blue
- Hint message appears: "👆 Kliknij na nagłówek wiersza aby wybrać ulicę do punktowania!"
- Scoring uses the manually selected row instead of automatic mapping

### Round Flow

#### 1. Planning Phase (Round 0)
- Place initial projects anywhere on the board
- No dice rolling yet
- Use "Rozpocznij grę" (Start Game) to begin round 1

#### 2. Building Phase (Rounds 1-9)
1. **Roll Dice**: Click "Rzuć kostkami" (Roll Dice)
2. **Select Row** (if sum = 2 or 12):
   - Visual hint appears prompting row selection
   - Click on desired row header to choose scoring row
   - Selected row highlights in blue
3. **Place Projects**: 
   - Select project type from legend
   - Click on valid cells to place temporarily
   - Primary column = dice value (e.g., dice shows 4 → column 4)
   - Alternative columns = adjacent columns (3, 5) if primary is full
4. **Save/Clear**: 
   - "Zapisz zmiany" (Save Changes) - commits placements
   - "Wyczyść zmiany" (Clear Changes) - removes temporary placements
5. **Next Round**: Click "Następna runda" (Next Round) when ready

#### 3. Bonus Phase (Rounds 3, 6, 9)
- After completing rounds 3, 6, or 9
- Click "Faza bonusowa" (Bonus Phase)
- Place ONE bonus project anywhere on the board
- Each project type can be used once (house/forest/lake)
- After using all 3 types, bonus phases are skipped

#### 4. End-Game Scoring (After Round 9)
- Automatic calculation of:
  - Round scores (sum of all 9 rounds)
  - Square bonuses
  - Factory bonuses/penalties
- Modal displays detailed breakdown
- "Zagraj ponownie" (Play Again) to restart

### Project Types

| Icon | Type | Placement Rule | Points |
|------|------|----------------|--------|
| 🏠 | House | Dice column (1,4) | Cell value |
| 🌲 | Forest | Dice column (2,5) | Cell value |
| 💧 | Lake | Dice column (3,6) | Cell value |
| ⬜ | Square | **Dice doubles** - anywhere | 0 (end-game bonus) |
| 🏭 | Factory | **Project doubles** - dice column | 0 (end-game bonus) |

### Special Rules

#### Alternative Columns (Points 17-24)
When primary column is full, projects can be placed in adjacent columns:
- Primary full → Alternative = Primary ± 1
- Works for houses, forests, lakes, **and factories**
- Squares remain placeable anywhere on doubles
- Visual indicator: purple/violet LED glow on alternative columns

#### Dice Doubles (Same dice values)
- **Example**: Rolling 4 + 4 = 8
- Allows placing a **square** anywhere on the board
- Regular project still follows row 4 (sum 8) rules

#### Project Doubles (Two different projects in same column)
- **Example**: House in [2,3] + Forest in [4,3] (both column 3)
- Triggers after saving changes
- Allows placing a **factory** in the same column (3)
- Visual feedback shows available factory placement

### Round Scoring

Scoring occurs after each round based on the **scored row** (determined by dice sum):

1. **Identify Scored Row**: Dice sum determines which row scores
2. **Group Connected Projects**: Use BFS algorithm to find connected groups
   - Only orthogonal connections (N, S, E, W) - no diagonals
   - Only same project types group together
   - Only occupied cells with points count
3. **Sum Group Points**: Total all points in each connected group
4. **Add to Round Score**: Score displayed in round tracker

**Example**:
```
Dice: 3 + 4 = 7 → Row 3 scores
Row 3 has: Forest[3,2]=3pts, Forest[3,3]=3pts, House[3,4]=1pt
Connected forests = 1 group of 2 = 6 points
Isolated house = 1 group of 1 = 1 point
Round 3 score: 7 points
```

### End-Game Bonuses

#### Squares (+10 each or 0)
- **Requirement**: Must be adjacent to ALL three: house, forest, AND lake
- **Bonus**: +10 points per qualifying square
- **Otherwise**: 0 points
- **Details shown**: "Sąsiaduje z domem, lasem i stawem" or "Brak: dom, las"

#### Factories (+10 or penalties)
- **Bonus (+10)**: Adjacent to forest AND/OR lake (without house/square)
- **Penalty (-2)**: Per adjacent house
- **Penalty (-5)**: Per adjacent square
- **Details shown**: "Sąsiedzi: 2 domy (-4pkt), 1 plac (-5pkt)" = -9 total

**Example End-Game Calculation**:
```
Square [1,3]: Adjacent to house, forest, lake → +10
Square [2,5]: Missing lake → +0
Factory [4,2]: Adjacent to 2 forests → +10
Factory [5,4]: Adjacent to 1 house, 1 square → -2 -5 = -7

Square Bonus: +10
Factory Bonus: +10 -7 = +3
Round Total: 85
FINAL SCORE: 98 points
```

---

## ✨ Features Implemented

### Core Mechanics
- ✅ **Dice Rolling System**: Two 6-sided dice with sum calculation
- ✅ **5×6 Game Board**: Row/column headers with visual highlights
- ✅ **Row-Column Mapping**: Dice sum determines valid placement rows
- ✅ **Manual Row Selection**: When sum = 2 or 12, player chooses scoring row
- ✅ **Project Placement**: Houses (1,4), Forests (2,5), Lakes (3,6)
- ✅ **Temporary Changes**: Preview placements before committing
- ✅ **Phase Management**: Planning → Building → Bonus → Scoring
- ✅ **9-Round Structure**: Complete game flow with round progression

### Advanced Features (Points 13-24)
- ✅ **Point 13**: Optional project selection (no forced selection)
- ✅ **Point 14**: Improved button states with lock icons (🔒)
- ✅ **Point 15**: Block dice rolling after first roll per round
- ✅ **Point 16**: Bonus phases (rounds 3, 6, 9) with phase button
- ✅ **Point 17-24**: Alternative column system
  - Adjacent column placement when primary is full
  - Purple LED glow visual indicator
  - Works for houses, forests, lakes, and factories
  - Validation and highlighting logic
- ✅ **Dice Doubles**: Squares placeable anywhere on doubles
- ✅ **Project Doubles**: Factory placement on column doubles
- ✅ **Square End-Game Scoring**: +10 for all 3 neighbor types
- ✅ **Factory End-Game Scoring**: Bonuses/penalties based on neighbors

### Scoring System
- ✅ **BFS Grouping Algorithm**: Connected project detection
- ✅ **Round Scoring**: Calculates points from scored row groups
- ✅ **Round Tracker**: Visual display of all 9 rounds with bonus stars
- ✅ **Cumulative Score**: Real-time total point calculation
- ✅ **End-Game Modal**: Animated summary with gradient background
- ✅ **Detailed Breakdown**: Individual square/factory scoring with reasons
- ✅ **Color-Coded Points**: Green (positive), red (negative), gray (zero)

### UI/UX Features
- ✅ **Start Modal**: Welcome screen with game rules
- ✅ **Visual Feedback**: 
  - Yellow glow for active row/column
  - Purple glow for alternative columns
  - Blue highlight for selectable/selected rows (sum 2/12)
  - Green highlights for valid placements
  - Red for blocked cells
- ✅ **Interactive Row Headers**: Clickable when sum = 2 or 12
- ✅ **Contextual Hints**: Animated message for row selection
- ✅ **Responsive Design**: Mobile-friendly layouts
- ✅ **Animations**: Slide-up modals, pulse effects, fade-ins
- ✅ **Scrollable Details**: Custom scrollbar for long score lists
- ✅ **Lock Icons**: Visual indication of disabled actions

### State Management
- ✅ **Pinia Store**: Centralized game state with TypeScript
- ✅ **Computed Getters**: Reactive allowed columns, phase checks
- ✅ **Action Methods**: rollDice, saveChanges, nextRound, etc.
- ✅ **Persistent State**: Round scores, bonus tracking, board state

---

## 🛠️ Technology Stack

### Frontend Framework
- **Vue 3** (v3.5.22) - Progressive JavaScript framework
  - Composition API with `<script setup>` syntax
  - Reactive state with `ref()` and `computed()`
  - Component-based architecture

### Language
- **TypeScript** (v5.9.0) - Type-safe JavaScript
  - Strict type checking
  - Interface definitions for game state
  - Type inference and autocompletion

### State Management
- **Pinia** (v3.0.3) - Official Vue state management
  - Modular stores
  - TypeScript integration
  - DevTools support

### Build Tools
- **Vite** (v7.1.11) - Next-generation frontend tooling
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules-based

### Development Tools
- **ESLint** (v9.37.0) - Code linting
- **Prettier** (v3.6.2) - Code formatting
- **Vue DevTools** - Component inspection and debugging
- **vue-tsc** (v3.1.1) - TypeScript type checking for `.vue` files

### Routing
- **Vue Router** (v4.6.3) - Single-page navigation (prepared for future features)

---

## 📁 Project Structure

```
my-little-town/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Global styles (CSS)
│   │   ├── main.css           # Layout, reset, containers
│   │   ├── ui.css             # Buttons, panels, modals
│   │   └── board.css          # Grid, cells, highlights
│   ├── components/             # Vue components
│   │   ├── BoardGrid.vue      # Game board grid with cells
│   │   ├── DiceRoller.vue     # Dice display and controls
│   │   ├── GameBoard.vue      # Main game container
│   │   ├── GameInfo.vue       # Round/score display
│   │   ├── GameLegend.vue     # Project selection legend
│   │   ├── GameStartModal.vue # Welcome modal
│   │   ├── GameEndModal.vue   # End-game summary modal
│   │   └── RoundScores.vue    # Round-by-round tracker
│   ├── stores/                 # Pinia state management
│   │   ├── GameStore.ts       # Main game logic and state
│   │   └── counter.ts         # Example store (unused)
│   ├── router/                 # Vue Router config
│   │   └── index.ts           # Route definitions (empty)
│   ├── App.vue                # Root component
│   └── main.ts                # Application entry point
├── index.html                  # HTML template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite build config
├── eslint.config.ts           # ESLint rules
└── README.md                  # This file
```

### Key Files Explained

#### `src/stores/GameStore.ts` (630+ lines)
**Core game logic and state management**
- **Types**: `CellType`, `GameState`, `Player`, `Cell`
- **State**: Board, dice, phases, scores, bonuses
- **Actions**:
  - `rollDice()` - Generate random dice values
  - `saveChanges()` - Commit temporary placements, detect doubles
  - `clearChanges()` - Remove temporary placements
  - `nextRound()` - Progress game phase, calculate scores
  - `calculateRoundScore()` - BFS grouping algorithm
  - `calculateFinalScore()` - End-game bonus calculations with details
  - `restartGame()` - Reset to initial state
- **Getters**:
  - `canProceedToNextRound` - Validation for phase progression
  - `availableProjects` - Filter projects based on game state
  - `allowedColumns` - Calculate valid columns (primary + alternative)

#### `src/components/GameBoard.vue`
**Main container orchestrating all components**
- Manages start/end modals
- Passes computed props to child components
- Handles events from DiceRoller, BoardGrid, Legend

#### `src/components/BoardGrid.vue`
**Visual game board with interactive cells**
- Renders 5×6 grid with row/column headers
- Highlights active row (dice sum), allowed columns
- Shows temporary changes, occupied cells
- Emits cell-click events for placement

#### `src/components/GameEndModal.vue`
**End-game summary with detailed breakdown**
- Animated gradient background with pulse effects
- Displays total score, round scores, bonuses
- Scrollable details section for squares/factories
- Individual item breakdown with position, reason, points
- Color-coded scoring (green/red/gray)

---

## 🚀 Setup & Development

### Prerequisites

- **Node.js**: v20.19.0 or v22.12.0+
- **npm**: v9.0.0+ (comes with Node.js)

### Installation

```sh
# Clone repository
git clone <repository-url>
cd my-little-town

# Install dependencies
npm install
```

### Development Server

```sh
# Start Vite dev server with HMR
npm run dev

# Open browser to http://localhost:5173
```

### Production Build

```sh
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

### Code Quality

```sh
# Run ESLint with auto-fix
npm run lint

# Format code with Prettier
npm run format

# Type-check without building
npm run type-check
```

---

## 🏗️ Architecture

### State Flow

```
User Action (e.g., click cell)
    ↓
Component Event Emission (@cell-click)
    ↓
GameBoard Handler (handleCellClick)
    ↓
Pinia Store Action (game.toggleCell)
    ↓
State Mutation (tempChanges.push)
    ↓
Computed Getter Update (board, tempChanges)
    ↓
Component Re-render (reactive data)
```

### Scoring Algorithm (BFS)

**calculateRoundScore() logic**:
```typescript
1. Determine scored row:
   - If sum = 2 or 12: Use selectedRowIndex (manual choice)
   - Otherwise: Map dice sum to row (3-4→0, 5-6→1, 7→2, 8-9→3, 10-11→4)
2. For each occupied cell in scored row:
   3. Skip if already grouped
   4. Start BFS from cell:
      a. Add cell to queue and visited set
      b. While queue not empty:
         c. Dequeue cell, add points if same type
         d. Check 4 neighbors (N, S, E, W)
         e. If neighbor = same type + occupied + not visited:
            - Add to queue and visited set
   5. Add group total to round score
6. Store round score in array
7. Update total score
```

**Row Selection for Sum 2/12**:
```typescript
1. User rolls dice → sum = 2 or 12
2. needsRowSelection getter returns true
3. UI shows hint: "Kliknij na nagłówek wiersza..."
4. Row headers become clickable (blue border)
5. User clicks row header → selectRow(rowIndex)
6. selectedRowIndex state updated
7. Selected row highlights in blue
8. Scoring uses selectedRowIndex instead of automatic mapping
```

### Alternative Column System

**allowedColumns() getter logic**:
```typescript
1. Get primary column from dice value
2. Check if primary column is full:
   - Count occupied cells in column
   - If count < 5, return [primary]
3. If primary full, find alternatives:
   - Alternative = [primary - 1, primary + 1]
   - Filter out invalid (< 1 or > 6)
   - Check if alternatives have space
4. Return primary + valid alternatives
5. Special cases:
   - Planning phase: all columns allowed
   - Bonus phase: all columns allowed
   - Squares: all columns (anyForSquare = true)
```

### Component Communication

- **Props**: Parent → Child data flow (read-only)
- **Events**: Child → Parent notifications (emits)
- **Pinia Store**: Shared state across all components
- **Computed Properties**: Reactive derived state

---

## 📚 Documentation

### CSS Architecture

Styles are split into three global files:

#### `src/assets/main.css`
- Global resets (`*`, `body`, `#app`)
- Layout containers (`.game-container`)
- Responsive breakpoints
- General typography

#### `src/assets/ui.css`
- **DiceRoller**: `.dice-section`, `.dice`, `.btn-roll`, `.btn-next`
- **GameInfo**: `.info-section`
- **GameLegend**: `.legend`, `.legend-item`, `.icon`
- **Modals**: `.modal-overlay`, `.modal-content`
- **RoundScores**: `.round-scores-container`, `.round-score`
- Button states (hover, disabled, locked)

#### `src/assets/board.css`
- **Grid Layout**: `.col-headers`, `.board-row`
- **Headers**: `.col-header`, `.row-header`
- **Cells**: `.cell`, `.cell-icon`, `.cell-points`
- **Highlights**: `.highlight`, `.alt-highlight`, `.col-disabled`
- **Project Types**: `.house`, `.forest`, `.lake`, `.square`, `.factory`
- **States**: `.temp-change`, `.changes-committed`
- Responsive cell sizing

**Import Order** (in `src/main.ts`):
```typescript
import './assets/main.css'   // Base styles first
import './assets/ui.css'     // UI components
import './assets/board.css'  // Board-specific styles
```

### TypeScript Interfaces

**GameState** (main state object):
```typescript
{
  currentRound: number              // 0-9
  dice: [number | null, number | null]
  currentPhase: 'planning' | 'building' | 'bonus' | 'scoring'
  players: Player[]
  totalScore: number
  selectedProject: CellType | null
  selectedRowIndex: number | null   // For manual row selection when dice sum = 2 or 12
  tempChanges: Array<{row, col, type}>
  roundScores: number[9]
  usedBonusRounds: Set<number>
  placementsThisRound: number
  usedBonusProjects: Set<CellType>
  changesCommitted: boolean
  diceRolledThisRound: boolean
  finalBonuses: {
    squares: number
    factories: number
    squareDetails: Array<{row, col, points, reason}>
    factoryDetails: Array<{row, col, points, reason}>
  }
}
```

**Cell** (individual board cell):
```typescript
{
  type: CellType      // 'empty' | 'house' | 'forest' | 'lake' | 'square' | 'factory'
  points: number      // 0-3 depending on row and type
  occupied: boolean   // true if project placed
}
```

### IDE Setup

**Recommended**: 
- [VS Code](https://code.visualstudio.com/)
- [Vue (Official) Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Disable Vetur if installed

**Browser DevTools**:
- [Vue.js DevTools for Chrome](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Vue.js DevTools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- Enable Custom Object Formatters in DevTools settings

---

## 🎯 Future Enhancements

Potential features for future development:
- Multiplayer support (compare scores)
- Difficulty levels (different board sizes)
- Undo/redo functionality
- Save/load game state (localStorage)
- Achievement system
- Sound effects and music
- Leaderboard (high scores)
- Tutorial mode with hints
- Accessibility improvements (ARIA labels)

---

## 📝 License

See [LICENSE](./LICENSE) file for details.

---

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

**Built with ❤️ using Vue 3 + TypeScript + Pinia**

---

Dokumentacja poglądowa

# Projekt Zaliczeniowy - PSAM
## Moje Miasteczko (My Little Town)
### Cyfrowa implementacja gry planszowej "Rolling Village"

**Autorzy:** Marek Otulak, Sebastian Kałuża 
**Data:** 19 listopada 2025  
**Przedmiot:** Programowanie Skryptowe i Aplikacji Mobilnych (PSAM)

---

## 1. Wstęp

### 1.1 Opis projektu

"Moje Miasteczko" to cyfrowa wersja gry planszowej "Rolling Village". Gra polega na budowaniu miasteczka przez 9 rund, w których gracz rzuca kośćmi i umieszcza różne typy projektów (domy, lasy, stawy, place, fabryki) na planszy 5×6. Punkty zdobywa się przez tworzenie grup połączonych projektów tego samego typu oraz strategiczne budowanie placów i fabryk.

Głównym wyzwaniem było przeniesienie złożonych zasad gry planszowej do interaktywnej aplikacji webowej, zachowując przy tym płynność rozgrywki i intuicyjny interfejs.

### 1.2 Setup środowiska

**Wymagania:**
- Node.js w wersji 20.19.0 lub 22.12.0+
- npm (Node Package Manager)

**Instalacja projektu:**

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/TurboSebo/my-little-town.git
cd my-little-town

# 2. Zainstaluj zależności
npm install

# 3. Uruchom serwer deweloperski
npm run dev

# 4. Otwórz w przeglądarce
# Aplikacja dostępna pod adresem: http://localhost:5173
```

**Dodatkowe komendy:**

```bash
npm run build        # Build produkcyjny
npm run preview      # Podgląd buildu
npm run type-check   # Sprawdzenie typów TypeScript
npm run lint         # Sprawdzenie kodu (ESLint)
npm run format       # Formatowanie kodu (Prettier)
```

### 1.3 Stack technologiczny

- **Vue 3** (v3.5.22) - framework frontendowy z Composition API
- **TypeScript** (v5.9.0) - typowanie statyczne
- **Pinia** (v3.0.3) - state management (Vuex następnej generacji)
- **Vite** (v7.1.11) - build tool i dev server z HMR
- **Vue Router** (v4.6.3) - routing (przygotowany na przyszłość)
- **ESLint** + **Prettier** - quality & formatting

**Dlaczego ten stack?**

Wybraliśmy Vue 3 z TypeScript, bo daje świetne wsparcie typów i łatwą kompozycję logiki. Pinia to prostsza alternatywa dla Vuex, która lepiej współpracuje z TypeScript. Vite to bardzo szybki bundler - rebuild trwa milisekundy, co przyspiesza development.

### 1.4 Struktura projektu

```
my-little-town/
├── src/
│   ├── components/          # Komponenty Vue
│   │   ├── BoardGrid.vue    # Główna plansza gry (siatka 5×6)
│   │   ├── DiceRoller.vue   # Kości i przyciski akcji
│   │   ├── GameBoard.vue    # Kontener - łączy wszystkie komponenty
│   │   ├── GameInfo.vue     # Info o rundzie i punktach
│   │   ├── GameLegend.vue   # Legenda projektów (wybór typu)
│   │   ├── GameStartModal.vue   # Modal startowy
│   │   ├── GameEndModal.vue     # Modal końcowy z wynikami
│   │   └── RoundScores.vue      # Tabela punktów z rund
│   ├── stores/
│   │   └── GameStore.ts     # Logika gry (1393 linii)
│   ├── router/
│   │   └── index.ts         # Routing (placeholder)
│   ├── assets/              # Style CSS
│   │   ├── board.css        # Style planszy i komórek
│   │   ├── ui.css           # Style UI (przyciski, legendy)
│   │   └── main.css         # Layout główny
│   ├── App.vue              # Root component
│   └── main.ts              # Entry point
├── public/                  # Statyczne pliki
├── README.md               # Dokumentacja techniczna (579 linii)
└── package.json            # Konfiguracja projektu
```

---

## 2. Zasady gry

### 2.1 Podstawowy przebieg

Gra składa się z **9 rund** plus faza końcowa. W każdej rundzie:

1. **Rzut kośćmi** - wynik określa, w których kolumnach można stawiać projekty
2. **Wybór projektu** - z legendy po lewej stronie
3. **Umieszczenie** - kliknięcie w odpowiednie pole na planszy
4. **Zapisanie zmian** - potwierdzenie ruchów
5. **Następna runda** - przejście dalej (co 3. runda = bonus)

### 2.2 Typy projektów

| Ikona | Typ | Warunek kostki | Punktacja |
|-------|-----|----------------|-----------|
| 🏠 | Dom | 1 lub 4 | Grupowanie |
| 🌲 | Las | 2 lub 5 | Grupowanie |
| 💧 | Staw | 3 lub 6 | Grupowanie |
| ⬜ | Plac | Dubel oczek (np. 3,3) | +10 jeśli sąsiaduje z domem, lasem I stawem |
| 🏭 | Fabryka | Dubel projektowy (np. 1,4) | +10 za las/staw, -2/-5 za dom/plac |

### 2.3 Mapowanie kości na wiersze

Suma kości określa, który **wiersz** (ulica) jest punktowany w danej rundzie:

- Suma **3 lub 4** → wiersz 1 (3 pkt)
- Suma **5 lub 6** → wiersz 2 (1 pkt)
- Suma **7** → wiersz 3 (3 pkt)
- Suma **8 lub 9** → wiersz 4 (1 pkt)
- Suma **10 lub 11** → wiersz 5 (3 pkt)

**Wyjątek:** Przy sumie **2** lub **12** gracz **sam wybiera** wiersz klikając w nagłówek.

### 2.4 Kluczowe zasady

**Zasada "typu i kolumny":**  
Jeśli na kościach wypadnie np. `3` i `5`, to:
- Kostka `3` = typ stawu → można postawić staw
- Kostka `5` = kolumna → staw musi być w kolumnie 5

**Zasada "alternatywnej kolumny":**  
Gdy kolumna wynikająca z kości jest pełna, szukamy najbliższej wolnej kolumny (lewo/prawo). Jeśli obie strony mają wolne miejsca:
- **Więcej miejsc po lewej** → tylko lewa dozwolona
- **Więcej miejsc po prawej** → tylko prawa dozwolona
- **Równo** → gracz wybiera (obie podświetlone fioletowo)

**Zasada dubla oczek:**  
Przy dublu (np. 6,6):
- Projekt podstawowy → kolumna 6 (lub alternatywna)
- Plac → **dowolne puste pole** (bez walidacji kolumny)

---

## 3. Stylowanie i UI

### 3.1 Layout aplikacji

Zastosowaliśmy układ **trzykolumnowy**:

```
┌──────────────────────────────────────────────────────┐
│ ┌──────────┐  ┌───────────────────────┐ ┌──────────┐ │
│ │  Lewa    │  │   Główna plansza      │ │  Prawa   │ │
│ │  kolumna │  │   (BoardGrid)         │ │  kolumna │ │
│ │          │  │                       │ │          │ │
│ │ - Info   │  │   5 wierszy × 6 kol   │ │          │ │
│ │ - Kości  │  │                       │ │          │ │
│ │          │  │                       │ │ - Legenda│ │
│ │          │  │  [Punkty rund]        │ │          │ │
│ └──────────┘  └───────────────────────┘ └──────────┘ │
└──────────────────────────────────────────────────────┘
```

### 3.2 Komponenty wizualne

**BoardGrid** - najważniejszy komponent wizualny:
- Siatka CSS Grid (nagłówki + 5 rzędów × 6 kolumn)
- Każda komórka ma:
  - Ikonę emoji (🏠🌲💧⬜🏭)
  - Punkty w prawym górnym rogu
  - Różne kolory tła dla typów
  - Hover effect (powiększenie 1.05x)

**Podświetlenia:**
- **Żółte** - aktywny wiersz (suma kości)
- **Fioletowe** - alternatywne kolumny
- **Niebieskie** - wybór wiersza przy sumie 2/12
- **Pomarańczowe** - tymczasowe zmiany (przed zapisem)

### 3.3 Responsive design

```css
@media (max-width: 768px) {
  .game-container {
    flex-direction: column;  /* Układamy pionowo */
  }
  .cell {
    width: 50px;   /* Mniejsze komórki */
    height: 50px;
  }
}
```

---

## 4. Kluczowe algorytmy

### 4.1 Rzut kośćmi

Prosty generator liczb losowych z walidacją:

```typescript
rollDice() {
  // Blokada - tylko 1 rzut na rundę
  if (this.diceRolledThisRound) {
    console.warn('Już rzuciłeś kostkami!')
    return
  }

  // Generuj 2 kostki (1-6)
  this.dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ]
  
  this.currentPhase = 'building'
  this.diceRolledThisRound = true
  this.selectedRowIndex = null  // Reset wyboru wiersza
}
```

**Dlaczego tak?**  
Najpierw sprawdzamy, czy nie było już rzutu (`diceRolledThisRound`). Potem generujemy dwie liczby 1-6 i przechodzimy w fazę budowania. Reset `selectedRowIndex` jest ważny, bo przy nowym rzucie gracz musi ponownie wybrać wiersz jeśli trafi 2 lub 12.

### 4.2 Walidacja kolumn - logika podstawowa

To jest serce gry. Algorytm określa, które kolumny są dostępne dla danego projektu:

```typescript
allowedColumns: (state: GameState) => {
  const info = { 
    primary: [] as number[],    // Główne kolumny
    alt: [] as number[],        // Alternatywne
    anyForSquare: false         // Plac wszędzie?
  }

  const [die1, die2] = state.dice
  
  // Określ typ projektu na podstawie kości
  if (state.selectedProject === 'house') {
    // Dom = 1 lub 4
    // Jeśli die1=1, to kolumna=die2
    // Jeśli die2=1, to kolumna=die1
    if (die1 === 1 || die1 === 4) info.primary.push(die2)
    if (die2 === 1 || die2 === 4) info.primary.push(die1)
  }
  
  // ... podobnie dla forest (2,5) i lake (3,6)
  
  // Plac - specjalny przypadek
  if (state.selectedProject === 'square' && die1 === die2) {
    info.anyForSquare = true  // Dubel = plac wszędzie
    return info
  }
  
  return info
}
```

**Logika myślenia:**  
Jedna kostka definiuje **typ** projektu, druga **kolumnę**. Przy kościach `3,5`:
- Jeśli wybieram staw (3) → kolumna 5
- Jeśli wybieram las (5) → kolumna 3

Przy dublu oczek (np. `4,4`) plac może być **wszędzie** (`anyForSquare = true`).

### 4.3 Algorytm alternatywnych kolumn

Gdy kolumna podstawowa jest pełna, szukamy najbliższej wolnej:

```typescript
// Znajdź kolumny alternatywne
info.primary.forEach((col) => {
  if (!colHasSpace(col)) {
    // Szukaj w promieniu 1, 2, 3...
    for (let r = 1; r < 6; r++) {
      const left = ((col - 1 - r + 6) % 6) + 1
      const right = ((col - 1 + r) % 6) + 1
      
      const leftFree = colHasSpace(left)
      const rightFree = colHasSpace(right)
      
      // Reguła a) - jedna pełna, druga wolna
      if (leftFree && !rightFree) {
        info.alt.push(left)
        break
      }
      if (!leftFree && rightFree) {
        info.alt.push(right)
        break
      }
      
      // Reguły b) i c) - obie wolne
      if (leftFree && rightFree) {
        const leftCount = countFreeSpaces(left)
        const rightCount = countFreeSpaces(right)
        
        if (leftCount > rightCount) {
          info.alt.push(left)      // Tylko lewa
        } else if (rightCount > leftCount) {
          info.alt.push(right)     // Tylko prawa
        } else {
          info.alt.push(left, right)  // Obie
        }
        break
      }
    }
  }
})
```

**Jak to działa?**  
Zawijamy planszę w okrąg (`% 6`), więc kolumna 1 sąsiaduje z 6. Sprawdzamy po kolei odległość 1, 2, 3... aż znajdziemy wolną. Jeśli obie strony mają wolne miejsca, liczymy je i wybieramy tę z większą liczbą (lub obie, jeśli równo).

### 4.4 Grupowanie i punktacja BFS

To najbardziej złożony algorytm - liczy punkty za połączone projekty:

```typescript
calculateRoundScore() {
  const grouped = new Set<string>()  // Zapamiętuję co już policzyłem
  
  // BFS - przeszukiwanie wszerz
  const groupProjects = (startRow: number, startCol: number, type: CellType) => {
    const queue = [[startRow, startCol]]
    const visited = new Set<string>()
    let groupPoints = 0
    
    while (queue.length > 0) {
      const [row, col] = queue.shift()!
      const cell = board[row][col]
      
      groupPoints += cell.points  // Dodaj punkty z tego pola
      
      // Sprawdź 4 sąsiadów (N, S, E, W)
      const neighbors = [
        [row - 1, col],  // Góra
        [row + 1, col],  // Dół
        [row, col - 1],  // Lewo
        [row, col + 1],  // Prawo
      ]
      
      for (const [nRow, nCol] of neighbors) {
        const key = `${nRow},${nCol}`
        if (visited.has(key)) continue
        
        const neighbor = board[nRow]?.[nCol]
        if (neighbor?.type === type && neighbor.occupied) {
          visited.add(key)
          grouped.add(key)
          queue.push([nRow, nCol])
        }
      }
    }
    
    return groupPoints
  }
  
  // Dla każdego pola w punktowanym wierszu
  for (let col = 0; col < 6; col++) {
    const cell = board[scoredRow][col]
    if (cell.occupied && !grouped.has(`${scoredRow},${col}`)) {
      const score = groupProjects(scoredRow, col, cell.type)
      roundScore += score
    }
  }
}
```

**BFS to klasyka:**  
Zamiast rekurencji używam kolejki. Zaczynam od jednego pola, dodaję punkty, sprawdzam sąsiadów. Jeśli sąsiad jest tego samego typu, dodaję go do kolejki. `visited` zapobiega zapętleniu, `grouped` zapobiega podwójnemu liczeniu grup.

### 4.5 Bonusy końcowe - place i fabryki

Po 9 rundach liczę bonusy za place i fabryki:

```typescript
calculateFinalScore() {
  // Funkcja sprawdzająca sąsiadów N,S,E,W
  const getNeighbors = (row, col) => {
    const types = []
    for (const [r, c] of [[row-1,col], [row+1,col], [row,col-1], [row,col+1]]) {
      const cell = board[r]?.[c]
      if (cell?.occupied) types.push(cell.type)
    }
    return types
  }

  // Plac: +10 jeśli sąsiaduje z domem, lasem I stawem
  if (cell.type === 'square') {
    const n = getNeighbors(row, col)
    if (n.includes('house') && n.includes('forest') && n.includes('lake')) {
      squareBonus += 10
    }
  }
  
  // Fabryka: +10 za las/staw, kary za dom/plac
  if (cell.type === 'factory') {
    const n = getNeighbors(row, col)
    
    if (n.includes('house') || n.includes('square')) {
      const houseCount = n.filter(x => x === 'house').length
      const squareCount = n.filter(x => x === 'square').length
      factoryBonus -= (houseCount * 2 + squareCount * 5)
    } else if (n.includes('forest') || n.includes('lake')) {
      factoryBonus += 10
    }
  }
}
```

**Strategia:**  
Place są trudne - muszą mieć wszystkie 3 typy w sąsiedztwie. Fabryki to balans ryzyka: +10 za las/staw, ale -2 za każdy dom i -5 za każdy plac w okolicy.

---

## 5. Architektura i state management

### 5.1 Pinia Store

Cała logika gry jest w jednym store - `GameStore.ts` (1393 linii). Wybraliśmy Pinię zamiast Vuex, bo:

- Lepsza integracja z TypeScript
- Prostsze API (bez mutations)
- Automatyczne devtools

**Główne sekcje store:**

```typescript
export const useGameStore = defineStore('game', {
  state: () => ({
    currentRound: 0,
    dice: [null, null],
    currentPhase: 'planning' | 'building' | 'bonus' | 'scoring',
    players: [],
    selectedProject: null,
    tempChanges: [],
    // ... itd
  }),
  
  actions: {
    rollDice() { /* ... */ },
    placeProjectTemp() { /* ... */ },
    saveChanges() { /* ... */ },
    calculateRoundScore() { /* ... */ },
    // ... 20+ akcji
  },
  
  getters: {
    diceSum: (state) => state.dice[0] + state.dice[1],
    canRollDice: (state) => !state.diceRolledThisRound,
    allowedColumns: (state) => { /* skomplikowana logika */ },
    // ... 10+ getterów
  }
})
```

### 5.2 Przepływ danych

```
User Action (kliknięcie)
    ↓
Component emit event
    ↓
GameBoard.vue handler
    ↓
Store action
    ↓
State mutation
    ↓
Getters recalculation
    ↓
Computed properties update
    ↓
DOM re-render
```

Vue automatycznie śledzi zależności i przelicza tylko to, co się zmieniło.

### 5.3 Najważniejsze decyzje projektowe

**1. Single source of truth**  
Cały stan gry w jednym miejscu (`GameStore`). Komponenty tylko wyświetlają i emitują eventy.

**2. Fazy gry**  
Rozróżnienie `planning`, `building`, `bonus`, `scoring` upraszcza logikę - każda faza ma inne zasady.

**3. Tymczasowe zmiany**  
`tempChanges[]` przechowuje ruchy przed zapisem. Gracz może je anulować (`clearChanges`).

**4. Walidacja w 2 miejscach**  
- **Gettery** określają, które kolumny są dozwolone
- **Actions** sprawdzają, czy można postawić projekt

To daje natychmiastowy feedback UI (podświetlenia) + finalną walidację przy kliknięciu.

---

## 6. Największe wyzwania

### 6.1 Logika alternatywnych kolumn

To było najtrudniejsze. W zasadach papierowych jest napisane "szukaj najbliższej", ale co jeśli obie strony mają wolne miejsca? Musieliśmy dodać reguły:

- Jeśli jedna strona ma więcej miejsc → tylko ta
- Jeśli równo → gracz wybiera (obie podświetlone)

Implementacja z zawijaniem planszy (`% 6`) i liczeniem wolnych miejsc zajęła kilka iteracji.

### 6.2 Obsługa dubli

Gra ma 3 typy dubli:

1. **Dubel oczek** (3,3 / 4,4 / 5,5 / 6,6) → plac gdziekolwiek
2. **Dubel projektowy** (1,4 / 2,5 / 3,6) → fabryka w obu kolumnach
3. **Sumy 2 i 12** → gracz wybiera wiersz

Każdy wymaga innej logiki. Debugowanie zajęło sporo czasu, bo łatwo coś przeoczyć.

### 6.3 BFS dla grupowania

Początkowo próbowaliśmy rekurencji, ale Vue ma problemy z głęboką rekurencją (stack overflow przy dużych grupach). BFS z kolejką jest bezpieczniejsze i łatwiejsze do debugowania.

### 6.4 TypeScript strict mode

Wszystkie typy muszą być zdefiniowane - czasem frustrujące, ale łapie błędy przed uruchomieniem. Warto było.

---

## 7. Screenshoty i przykłady

### 7.1 Plansza w trakcie gry

```
Nagłówki kolumn:     1    2    3    4    5    6
                   ┌────┬────┬────┬────┬────┬────┐
Wiersz 3,4 (3pkt)  │ 🏠 │    │ 💧 │ 💧 │    │ 🏠 │
                   ├────┼────┼────┼────┼────┼────┤
Wiersz 5,6 (1pkt)  │    │ 🌲 │    │    │ 🌲 │    │
                   ├────┼────┼────┼────┼────┼────┤
Wiersz 7 (3pkt)    │ 💧 │    │ 🏠 │ 🏠 │    │ 💧 │ ← Aktywny
                   ├────┼────┼────┼────┼────┼────┤
Wiersz 8,9 (1pkt)  │    │ 🌲 │    │    │ 🌲 │    │
                   ├────┼────┼────┼────┼────┼────┤
Wiersz 10,11 (3p)  │ 🏠 │    │ 💧 │ 💧 │    │ 🏠 │
                   └────┴────┴────┴────┴────┴────┘
```

Wiersz 7 jest żółty (podświetlony), bo wypadła suma 7 na kościach.

### 7.2 Przykład punktacji

**Runda 5: suma kości = 7 (wiersz 3)**

Wiersz 3: `💧 | _ | 🏠 | 🏠 | _ | 💧`

Grupowanie:
- Staw lewy (1 pole, 2 pkt) → **2 pkt**
- Dom środek (2 pola, 1+1 pkt) → **2 pkt** (grupa!)
- Staw prawy (1 pole, 2 pkt) → **2 pkt**

**Suma: 6 punktów**

Gdyby domy były oddzielone, każdy by dał 1 pkt (razem 2). Ale są razem, więc **grupowanie się opłaca**.

---

## 8. Podsumowanie

### 8.1 Co się udało

- **Pełna funkcjonalność** - wszystkie zasady gry zaimplementowane
- **Czytelny kod** - TypeScript + dobre nazewnictwo
- **Responsywność** - działa na telefonie
- **Płynna rozgrywka** - brak bugów, intuicyjny UX

### 8.2 Co można by poprawić

- **Internationalization** - aktualnie UI po polsku, można dodać i18n
- **Animacje** - przejścia między fazami mogłyby być płynniejsze
- **Historia ruchów** - możliwość cofnięcia się
- **Multiplayer** - WebSockets + współdzielona plansza

### 8.3 Czego się nauczyliśmy

1. **Vue 3 Composition API** - bardziej elastyczne niż Options API
2. **Pinia** - prostsza od Vuex, lepsza dla TypeScript
3. **Algorytmy grafowe** - BFS w praktyce
4. **State management** - jak zarządzać złożonym stanem aplikacji
5. **TypeScript strict** - wymaga więcej pracy, ale łapie błędy wcześniej

### 8.4 Świadome wybory

- **Jedna plansza zamiast wielu graczy** - uproszczenie dla MVP
- **Emoji zamiast grafik** - szybszy development, działa wszędzie
- **CSS Grid zamiast Canvas** - łatwiejsze stylowanie i responsywność
- **Store-centric architecture** - łatwiejsze testowanie i debugging

---

## 9. Kod źródłowy i dokumentacja

**Repozytorium:** https://github.com/TurboSebo/my-little-town

**Kluczowe pliki:**
- `src/stores/GameStore.ts` - cała logika (1393 linii)
- `src/components/BoardGrid.vue` - główna plansza
- `README.md` - pełna dokumentacja techniczna (579 linii)

**Statystyki:**
- ~3000 linii kodu (TypeScript + Vue)
- ~800 linii CSS
- 9 komponentów Vue
- 25+ akcji w store
- 12 getterów

---

## 10. Uruchomienie projektu krok po kroku

```bash
# 1. Wymagania
node --version  # Powinna być 20+ lub 22+

# 2. Clone
git clone https://github.com/TurboSebo/my-little-town.git
cd my-little-town

# 3. Install
npm install

# 4. Dev server
npm run dev

# 5. Otwórz w przeglądarce
# http://localhost:5173

# 6. Production build
npm run build
npm run preview  # Podgląd buildu
```

**Typowe problemy:**
- **Port zajęty** - Vite automatycznie znajdzie inny
- **Node za stary** - zaktualizuj do 20.19.0+
- **TypeScript errors** - `npm run type-check` pokazuje szczegóły

---

## Podsumowanie autorów

Ten projekt to efekt kilkudziesięciu godzin pracy. Największym wyzwaniem było przeniesienie złożonych zasad gry planszowej do kodu, zachowując przy tym czytelność i możliwość dalszego rozwijania. Udało się stworzyć w pełni funkcjonalną grę, która odwzorowuje mechanikę oryginału.

**Autorzy:** Marek Otulak, Sebastian Kałuża  
**PSAM 2025**

---