# Code Comment Translation Guide for GameStore.ts

This document provides English translations for all Polish code comments in GameStore.ts.
Use this as a reference when updating the comments.

## Function-Level Comments

### Game Flow Functions
- `rollDice()` - "Rzut kostkami - dozwolony tylko raz na rundę" → "Roll dice - allowed only once per round"
- `startGame()` - "Rozpocznij grę" → "Start game"
- `nextRound()` - "Przejście do następnej rundy" → "Proceed to next round"
- "Z fazy bonus: zapisz bonus, przejdź do następnej rundy" → "From bonus phase: save bonus, proceed to next round"
- "Standardowy przepływ: building -> next round" → "Standard flow: building -> next round"

### Project Management
- `selectProject()` - "Wybór projektu z legendy" → "Project selection from legend"
- "Nie pozwalaj wybrać bonusowego projektu, jeśli już został użyty" → "Don't allow selecting bonus project if already used"
- `placeProjectTemp()` - "Umieszczenie projektu na planszy (tymczasowo)" → "Place project on board (temporarily)"
- "Faza planowania: brak rzutów, gracz może postawić 2 różne podstawowe projekty" → "Planning phase: no dice rolls, player can place 2 different basic projects"
- "Gracz może postawić MAX 1 projekt bonusowy w fazie bonus" → "Player can place MAX 1 bonus project in bonus phase"
- "Sprawdź czy pole puste (zajęte pola to te z occupied=true)" → "Check if cell is empty (occupied cells have occupied=true)"
- "Poniżej: faza building - wymagane zasady o kolumnach" → "Below: building phase - column rules required"

### Validation
- "Walidacja duplikatów - nie pozwalaj na postawienie tego samego projektu więcej niż raz w rundzie" → "Duplicate validation - don't allow placing same project more than once per round"
- "Przy dublu projektowym - jeśli już postawiono projekt, fabryka musi być w drugiej kolumnie" → "With project doubles - if project already placed, factory must be in different column"
- "Sprawdź czy już postawiono projekt w tej rundzie" → "Check if project already placed this round"

### Changes Management
- `clearTempChanges()` - "Usunięcie wszystkich tymczasowych zmian" → "Clear all temporary changes"
- `saveChanges()` - "Zapisanie zmian na planszy" → "Save changes to board"
- "Jeśli któryś z zapisanych projektów jest projektem bonusowym i jesteśmy w fazie bonus, zarejestruj użycie tego typu projektu" → "If any saved project is a bonus project and we're in bonus phase, register usage of that project type"
- "Zarejestruj użycie rundy bonusowej" → "Register bonus round usage"
- "Jeśli to runda bonusowa (3,6,9) i jesteśmy w fazie building po standardowym zapisie projektów, przejdź do fazy bonusowej aby umożliwić postawienie darmowego projektu bonusowego" → "If it's a bonus round (3,6,9) and we're in building phase after standard project save, transition to bonus phase to allow placing free bonus project"

### Scoring
- `calculateRoundScore()` - "Obliczanie punktów za rundę z grupowaniem projektów" → "Calculate round score with project grouping"
- "Funkcja BFS do grupowania projektów" → "BFS function for grouping projects"
- "Dodaj punkty tylko z pól mających punktację" → "Add points only from fields with scoring"
- "Sprawdź sąsiadów N,S,E,W" → "Check neighbors N,S,E,W"
- "Tylko projekty podstawowe kwalifikują się do grupowania" → "Only basic projects qualify for grouping"
- "Inne typy (factory, square) - tylko punkty stałe" → "Other types (factory, square) - fixed points only"

### End-Game Scoring
- `calculateFinalScore()` - "Obliczanie końcowych punktów (place i fabryki)" → "Calculate final points (squares and factories)"
- "Funkcja sprawdzająca sąsiadów N,S,E,W" → "Function checking neighbors N,S,E,W"
- "Jeśli sąsiaduje z domem lub placem → wynik podstawowy = 0" → "If adjacent to house or square → base result = 0"
- "Za każdy DOM → -2 punkty" → "For each HOUSE → -2 points"
- "Za każdy PLAC → -5 punktów" → "For each SQUARE → -5 points"
- "Sąsiaduje z lasem lub stawem → +10 punktów" → "Adjacent to forest or lake → +10 points"
- "Zapisz bonusy do wyświetlenia" → "Save bonuses for display"

### Bonus Management
- "Użycie bonusu w rundzie 3, 6 lub 9" → "Bonus usage in round 3, 6, or 9"
- "W fazie bonusowej projekt bonusowy można postawić gdziekolwiek" → "In bonus phase, bonus project can be placed anywhere"

## Validation Functions

### Column Validation
- "Helper - zlicz liczbę wolnych pól w kolumnie" → "Helper - count number of free cells in column"
- "Reguła a) Jedna pełna, druga z wolnym polem" → "Rule a) One full, other with free space"
- "Reguły b) i c) - obie mają wolne pola" → "Rules b) and c) - both have free spaces"
- "Reguła b) - lewa ma więcej, tylko lewa dozwolona" → "Rule b) - left has more, only left allowed"
- "Reguła b) - prawa ma więcej, tylko prawa dozwolona" → "Rule b) - right has more, only right allowed"
- "Reguła c) - taka sama liczba, obie dozwolone (gracz wybiera)" → "Rule c) - same number, both allowed (player chooses)"

### Dice Rules
- "Przy dublu projektowym: fabryka może być w die1 LUB die2" → "With project double: factory can be in die1 OR die2"
- "Dubel zwykły (nie projektowy)" → "Regular double (not project)"
- "Odwrócona logika - kostka definiuje TYP, druga KOLUMNĘ" → "Inverted logic - die defines TYPE, other defines COLUMN"
- "Jeśli die1 = typ projektu, to kolumna = die2" → "If die1 = project type, then column = die2"
- "Jeśli die2 = typ projektu, to kolumna = die1" → "If die2 = project type, then column = die1"

### Project Placement Rules
- "W fazie planowania wymagane są dokładnie 2 różne podstawowe projekty" → "In planning phase, exactly 2 different basic projects required"
- "W fazie bonus: gracz mógł postawić 0 lub 1 projekt, zawsze OK" → "In bonus phase: player could place 0 or 1 project, always OK"
- "Walidacja duplikatów - sprawdź czy gracz nie postawił tego samego projektu więcej niż raz w tej rundzie" → "Duplicate validation - check if player didn't place same project more than once this round"
- "Minimalne wymaganie: w rundach zwykłych 2 projekty, w rundach 3/6/9 - 2 projekty (bonus jest osobno)" → "Minimum requirement: in regular rounds 2 projects, in rounds 3/6/9 - 2 projects (bonus is separate)"
- "Obsługa szczególnych przypadków:" → "Handling special cases:"

### Alternative Column Logic
- "Sprawdź czy kolumna primary jest pełna i użyto alternatywnej" → "Check if primary column is full and alternative was used"
- "Sprawdź dublet projektowy (np. 1+4) - wymagamy, żeby obie kolumny miały ustawione projekty/factory zgodnie z regułą" → "Check project double (e.g. 1+4) - we require both columns to have projects/factory set according to rule"
- "Jedna lub obie kolumny pełne - użyto alternatywnej kolumny" → "One or both columns full - alternative column used"
- "Sprawdź czy projekty są w dozwolonych kolumnach (primary lub alternatywne)" → "Check if projects are in allowed columns (primary or alternative)"
- "Dodaj alternatywne dla pełnych" → "Add alternatives for full columns"
- "Sprawdź czy wszystkie projekty są w dozwolonych kolumnach" → "Check if all projects are in allowed columns"
- "Obie kolumny mają wolne miejsca - standardowa walidacja" → "Both columns have free spaces - standard validation"
- "Dopuszczalna kombinacja: projekt + factory (albo dwa projekty różnych typów)" → "Allowed combination: project + factory (or two projects of different types)"
- "W standardowym przypadku wymagamy dokładnie 2 projektów (może być factory jeśli dozwolony)" → "In standard case we require exactly 2 projects (can be factory if allowed)"

## Getters

### canProceedToNextRound
- "Nie można przejść dalej jeśli są niezapisane zmiany" → "Cannot proceed if there are unsaved changes"
- "W fazie bonus: gracz mógł postawić 0 lub 1 projekt bonusowy, zawsze może przejść dalej" → "In bonus phase: player could place 0 or 1 bonus project, can always proceed"
- "W fazie planowania (runda 0) — gracz musi zapisać dokładnie 2 projekty" → "In planning phase (round 0) — player must save exactly 2 projects"
- "W fazie building: potrzebne są 2 projekty na zwykłe rundy" → "In building phase: 2 projects needed for regular rounds"

### canEnterBonus
- "Czy można przejść do fazy bonusowej (po zapisie w rundach 3, 6, 9)" → "Can enter bonus phase (after saving in rounds 3, 6, 9)"

### canRollDice
- "W fazie planowania nie można rzucać kostkami" → "Cannot roll dice in planning phase"

### availableProjects
- "Faza planowania: zawsze trzy podstawowe projekty dostępne" → "Planning phase: always three basic projects available"
- "Faza bonus - tylko projekty podstawowe (house/forest/lake) niezależnie od kości" → "Bonus phase - only basic projects (house/forest/lake) regardless of dice"
- "Faza budowania - projekty zależne od kości" → "Building phase - projects dependent on dice"

### allowedColumns
- "Zwraca informację o dozwolonych kolumnach:" → "Returns information about allowed columns:"
- "Helper - zlicz liczbę wolnych pól w kolumnie" → "Helper - count number of free cells in column"
- "Jeśli gracz wybrał projekt (nie null), oblicz dozwolone kolumny dla tego projektu" → "If player selected project (not null), calculate allowed columns for that project"
- "Dla podstawowych projektów (house/forest/lake): mapuj na kolumny (1,4)/(2,5)/(3,6)" → "For basic projects (house/forest/lake): map to columns (1,4)/(2,5)/(3,6)"
- "Dla square/factory: dostępne wszędzie jeśli kosci są równe / dubel" → "For square/factory: available everywhere if dice are equal / double"
- "Logika: kostka definiuje TYP projektu, druga kostka definiuje KOLUMNĘ" → "Logic: die defines project TYPE, other die defines COLUMN"
- "Przykład: kości 3,2 + wybrano las(2) → podświetl kolumnę 3 (bo 2 na kostce = las, więc 3 = kolumna)" → "Example: dice 3,2 + forest(2) selected → highlight column 3 (because 2 on die = forest, so 3 = column)"
- "Dom = 1 lub 4. Jeśli die1=1 lub 4, kolumna=die2. Jeśli die2=1 lub 4, kolumna=die1." → "House = 1 or 4. If die1=1 or 4, column=die2. If die2=1 or 4, column=die1."
- "Przy dublu (np. 1,1 lub 4,4) obie kostki definiują ten sam typ i kolumnę" → "With double (e.g. 1,1 or 4,4) both dice define same type and column"
- "Plac jest dostępny wszędzie jeśli kości równe" → "Square is available everywhere if dice are equal"
- "Fabryka przy dublu projektowym - dostępna w obu kolumnach" → "Factory with project double - available in both columns"
- "Poza dublem projektowym fabryka niedostępna" → "Outside project double, factory unavailable"
- "Szukaj alternatywnych kolumn TYLKO dla primary które są pełne" → "Search for alternative columns ONLY for primary that are full"
- "Jeśli nie ma wybranego projektu, zwróć podstawowe primary (kosci)" → "If no project selected, return basic primary (dice)"

## Usage Instructions

To update GameStore.ts:
1. Search for each Polish comment pattern
2. Replace with corresponding English translation from this guide
3. Maintain code structure and formatting
4. Keep console.log/warn messages in Polish (user-facing)
5. Only translate code comments (// or /* */)

## Status
- ✅ Translation guide complete
- ⏳ Pending: Apply translations to GameStore.ts
- 📝 Note: Console messages intentionally left in Polish for Polish-speaking users
