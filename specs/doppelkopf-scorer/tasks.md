# Implementation Plan: Doppelkopf Scorer

## Overview

This plan implements a React-based scoring companion for Doppelkopf card games. Tasks are organized to build core logic first, then UI components, ensuring each step produces working code.

## Tasks

- [x] 1. Project setup and core types
  - [x] 1.1 Initialize Vite + React + TypeScript project with styled-components
    - Run `npm create vite@latest` with React + TypeScript template
    - Install styled-components and @types/styled-components
    - _Requirements: Tech stack from design_

  - [x] 1.2 Create core type definitions
    - Create `src/types/index.ts` with all interfaces: Player, Round, GameState, SpritzeState, SpritzeType, CarryOverSpritze, GameConfig, PlayerConfig, PlayerRoundResult
    - _Requirements: Data Models from design_

- [x] 2. Score calculation module
  - [x] 2.1 Implement score calculation functions
    - Create `src/logic/scoreCalculator.ts`
    - Implement `calculateRoundPoints(totalSpritzes: number): number` - returns 10 × 2^totalSpritzes
    - Implement `countTotalSpritzes(spritzeState, carryOverSpritzes, mode): number`
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 3. Position calculation module
  - [x] 3.1 Implement position calculation
    - Create `src/logic/positionCalculator.ts`
    - Implement `calculatePositions(players: Player[]): Player[]` - assigns positions based on score ranking with tie handling
    - _Requirements: 2.3, 2.5_

- [x] 4. Carry-over Spritze module
  - [x] 4.1 Implement carry-over Spritze logic
    - Create `src/logic/spritzeManager.ts`
    - Implement `generateCarryOverSpritzes(round, allPlayerIds): CarryOverSpritze[]` - creates carry-over for each loser
    - Implement `processCarryOverSpritzes(carryOvers): CarryOverSpritze[]` - decrements counters, filters expired
    - Implement `removeCarryOversFromRound(carryOvers, originRoundIndex): CarryOverSpritze[]`
    - _Requirements: 7.5, 3.7_

- [x] 5. Round management module
  - [x] 5.1 Implement round management functions
    - Create `src/logic/roundManager.ts`
    - Implement `createNewRound(currentRounds): Round` - creates round with incremented number
    - Implement `acceptRound(gameState, roundIndex): GameState` - finalizes round, calculates scores, generates carry-overs
    - Implement `resetLastRound(gameState): GameState` - reverts last round, removes carry-overs, recalculates scores
    - Implement `canResetRound(gameState, roundIndex): boolean` - validates only last round can be reset
    - _Requirements: 3.1, 3.3, 3.5, 3.6, 3.7, 3.8, 4.5_

- [x] 6. Checkpoint - Verify Core logic
  - Review implementation of core logic modules.

- [x] 7. Persistence module
  - [x] 7.1 Implement local storage service
    - Create `src/services/localStorage.ts`
    - Implement `saveGameState(state: GameState): void`
    - Implement `loadGameState(): GameState | null`
    - Implement `clearGameState(): void`
    - Implement `saveTheme(theme: 'light' | 'dark'): void`
    - Implement `loadTheme(): 'light' | 'dark'`
    - Handle JSON parse errors gracefully
    - _Requirements: 8.1, 8.2, 8.4, 9.5_

- [x] 8. Game state hook
  - [x] 8.1 Implement useGameState hook
    - Create `src/hooks/useGameState.ts`
    - Manage game state with useState
    - Auto-persist to localStorage on state changes
    - Expose: gameState, startGame, addRound, toggleWinner, updateSpritze, acceptRound, resetRound, resetGame
    - _Requirements: 3.1, 3.3, 3.5, 4.1, 5.2, 6.2_

- [x] 9. Theme provider
  - [x] 9.1 Implement theme system
    - Create `src/theme/index.ts` with light and dark theme objects
    - Create `src/hooks/useTheme.ts` hook for theme management
    - Create `src/components/ThemeProvider.tsx` wrapper component
    - Define paper-like color palette for both themes
    - _Requirements: 9.1, 9.3, 9.4_

- [x] 10. Entry screen components
  - [x] 10.1 Implement PlayerInput component
    - Create `src/components/EntryScreen/PlayerInput.tsx`
    - Text input for name, color picker for player color
    - Validation state display for empty names
    - _Requirements: 1.1, 1.2, 1.6_

  - [x] 10.2 Implement SpritzeModeSelector component
    - Create `src/components/EntryScreen/SpritzeModeSelector.tsx`
    - Radio buttons for Normal/Custom mode
    - Checkboxes for Spritze types in Normal mode
    - _Requirements: 1.3, 1.4_

  - [x] 10.3 Implement EntryScreen component
    - Create `src/components/EntryScreen/index.tsx`
    - Compose PlayerInput (×4) and SpritzeModeSelector
    - Form validation: all names required
    - Submit handler calls onGameStart with GameConfig
    - _Requirements: 1.1, 1.5, 1.6_

- [x] 11. Checkpoint - Entry screen functional
  - Review implementation of entry screen components.

- [x] 12. Game screen sidebar
  - [x] 12.1 Implement PlayerCard component
    - Create `src/components/GameScreen/PlayerCard.tsx`
    - Display player name, color indicator, total score, position
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 12.2 Implement PlayerSidebar component
    - Create `src/components/GameScreen/PlayerSidebar.tsx`
    - Render PlayerCard for each player
    - Reset button with confirmation overlay
    - Theme toggle switch
    - _Requirements: 2.1, 8.3, 9.3_

- [x] 13. Game table components
  - [ ] 13.1 Implement RoundNumber component
    - Create `src/components/GameScreen/RoundNumber.tsx`
    - Display round number
    - Hover: show accept button (current round) or reset button (previous round)
    - _Requirements: 3.2, 3.4_

  - [x] 13.2 Implement PlayerCell component
    - Create `src/components/GameScreen/PlayerCell.tsx`
    - Active round: checkbox for winner selection
    - Accepted round: display points or "-"
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 13.3 Implement SpritzeDisplay component
    - Create `src/components/GameScreen/SpritzeDisplay.tsx`
    - Show active Spritzes and carry-over Spritzes
    - Normal mode: list of Spritze types
    - Custom mode: numeric count
    - _Requirements: 5.5, 6.2_

  - [x] 13.4 Implement SpritzeCheckboxes component
    - Create `src/components/GameScreen/SpritzeCheckboxes.tsx`
    - Checkboxes for all predefined Spritze types
    - Only rendered in Normal mode
    - Disabled when round is accepted
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.4_

  - [x] 13.5 Implement RoundRow component
    - Create `src/components/GameScreen/RoundRow.tsx`
    - Compose: RoundNumber, PlayerCell (×4), SpritzeDisplay, SpritzeCheckboxes
    - Handle winner toggle, Spritze changes, accept/reset actions
    - _Requirements: 3.1, 4.2_

- [x] 14. Game table assembly
  - [x] 14.1 Implement GameTable component
    - Create `src/components/GameScreen/GameTable.tsx`
    - Render TableHeader and RoundRow for each round
    - 7-column layout as specified
    - _Requirements: Game Table layout from design_

  - [x] 14.2 Implement GameScreen component
    - Create `src/components/GameScreen/index.tsx`
    - Two-column layout: PlayerSidebar (left), GameTable (right)
    - Wire up all state handlers from useGameState
    - _Requirements: Game Screen Layout from design_

- [x] 15. App integration
  - [x] 15.1 Implement App component
    - Update `src/App.tsx`
    - Check localStorage for existing game on mount
    - Route to EntryScreen or GameScreen based on game state
    - Wrap with ThemeProvider
    - _Requirements: 1.5, 8.2_

- [x] 16. Round reset functionality
  - [x] 16.1 Implement round reset integration
    - Wire reset button to resetLastRound in useGameState
    - Ensure carry-over removal and score recalculation
    - _Requirements: 3.5, 3.6, 3.7, 3.8_

- [ ] 17. Final checkpoint
  - Review implementation of all components.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Core logic modules (tasks 2-5) are pure functions
- UI components (tasks 10-14) depend on core logic being complete
