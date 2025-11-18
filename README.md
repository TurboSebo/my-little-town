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
