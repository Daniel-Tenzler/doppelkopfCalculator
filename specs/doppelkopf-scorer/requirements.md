# Requirements Document

## Introduction

A single-device, shared-screen web application for calculating scores during live Doppelkopf card game sessions. The app tracks player scores, handles Spritze multipliers, and provides round-by-round scoring with undo capability.

## Glossary

- **Scorer**: The web application for tracking Doppelkopf game scores
- **Player**: One of four participants in the game
- **Round**: A single hand of play resulting in 0-4 winners
- **Spritze**: A scoring multiplier that doubles round points
- **Carry_Over_Spritze**: A Spritze automatically applied to a losing player for 2 subsequent rounds
- **Round_Points**: Points awarded to winners (base 10 × 2^total_spritzes)
- **Game_Table**: The main scoring grid displaying all rounds and player scores
- **Normal_Mode**: Spritze mode using predefined checkbox selections
- **Custom_Mode**: Spritze mode using manual numeric input

## Requirements

### Requirement 1: Game Setup

**User Story:** As a player, I want to configure a new game with player names, colors, and Spritze mode, so that I can start tracking scores for our session.

#### Acceptance Criteria

1. WHEN the application loads, THE Scorer SHALL display an entry screen with 4 player name input fields
2. WHEN configuring players, THE Scorer SHALL provide a color selection option for each player
3. WHEN selecting Spritze mode, THE Scorer SHALL offer Normal Mode with predefined Spritze type checkboxes
4. WHEN selecting Spritze mode, THE Scorer SHALL offer Custom Mode with a numeric Spritze input field
5. WHEN all required fields are completed and submitted, THE Scorer SHALL transition to the game screen
6. IF a player name is empty, THEN THE Scorer SHALL prevent game start and indicate the missing field

### Requirement 2: Player Score Display

**User Story:** As a player, I want to see all player names, total scores, and current positions, so that I can track the game standings at a glance.

#### Acceptance Criteria

1. THE Scorer SHALL display player names in a left column of the game screen
2. THE Scorer SHALL display each player's cumulative total score next to their name
3. THE Scorer SHALL display each player's current position based on total score ranking
4. WHEN scores change, THE Scorer SHALL update positions to reflect new rankings
5. WHEN two or more players have equal scores, THE Scorer SHALL display them with the same position

### Requirement 3: Round Management

**User Story:** As a player, I want to create, accept, and undo rounds, so that I can accurately record each hand played.

#### Acceptance Criteria

1. WHEN a new round starts, THE Scorer SHALL add a new row to the Game_Table with an incremented round number
2. WHEN hovering over the current round number, THE Scorer SHALL display an accept button
3. WHEN the accept button is clicked, THE Scorer SHALL finalize the current round and calculate scores
4. WHEN hovering over the previous round number, THE Scorer SHALL display a reset button
5. WHEN the reset button is clicked, THE Scorer SHALL revert exactly the last accepted round
6. IF a user attempts to reset any round other than the immediately previous one, THEN THE Scorer SHALL prevent the action
7. WHEN a round is reset, THE Scorer SHALL remove any Carry_Over_Spritzes originating from that round
8. WHEN a round is reset, THE Scorer SHALL recalculate all affected player totals

### Requirement 4: Winner Selection

**User Story:** As a player, I want to mark 0-4 winners per round, so that points are awarded correctly.

#### Acceptance Criteria

1. WHEN a round is active, THE Scorer SHALL display a checkbox in each player's column to mark them as winner
2. THE Scorer SHALL allow 0 to 4 players to be marked as winners in a single round
3. WHEN a round is accepted, THE Scorer SHALL display the round points for each winner
4. WHEN a round is accepted, THE Scorer SHALL display "-" for non-winners
5. WHEN a round is accepted, THE Scorer SHALL add the round points to each winner's cumulative total

### Requirement 5: Spritze Handling in Normal Mode

**User Story:** As a player, I want to select predefined Spritze types via checkboxes, so that multipliers are applied correctly.

#### Acceptance Criteria

1. WHILE in Normal_Mode, THE Scorer SHALL display checkboxes for all predefined Spritze types in column 7
2. WHEN a Spritze checkbox is checked, THE Scorer SHALL add that Spritze to column 6
3. THE Scorer SHALL include special Spritze types for losers below 90/60/30/0 points and winning against queens
4. WHEN a round is accepted, THE Scorer SHALL lock all Spritze selections for that round
5. THE Scorer SHALL display both active Spritzes and Carry_Over_Spritzes in column 6

### Requirement 6: Spritze Handling in Custom Mode

**User Story:** As a player, I want to enter a custom number of Spritzes, so that I can use house rules or simplified scoring.

#### Acceptance Criteria

1. WHILE in Custom_Mode, THE Scorer SHALL display a numeric input field for Spritze count
2. WHEN a number is entered, THE Scorer SHALL display that count in column 6
3. WHEN a round is accepted, THE Scorer SHALL lock the Spritze input for that round
4. WHILE in Custom_Mode, THE Scorer SHALL NOT display the Spritze checkbox column (column 7)

### Requirement 7: Score Calculation

**User Story:** As a player, I want scores calculated automatically with Spritze multipliers, so that I don't have to do mental math.

#### Acceptance Criteria

1. THE Scorer SHALL use a base point value of 10 per round
2. THE Scorer SHALL calculate Round_Points as 10 × 2^total_spritzes
3. WHEN multiple Spritzes are present, THE Scorer SHALL stack them additively before applying the multiplier
4. THE Scorer SHALL award full Round_Points to each winner (not divided)
5. WHEN a player loses, THE Scorer SHALL automatically apply a Carry_Over_Spritze for 2 subsequent rounds
6. THE Scorer SHALL include Carry_Over_Spritzes in the total Spritze count for calculation

### Requirement 8: Game Persistence

**User Story:** As a player, I want my game to persist across browser sessions, so that I can continue after interruptions.

#### Acceptance Criteria

1. THE Scorer SHALL store the current game state in local storage
2. WHEN the application loads with existing game data, THE Scorer SHALL restore the game state
3. WHEN the reset button in the left column is clicked, THE Scorer SHALL display a confirmation overlay
4. WHEN reset is confirmed, THE Scorer SHALL clear local storage and refresh to the entry screen

### Requirement 9: Visual Theme

**User Story:** As a player, I want a clean, paper-like interface with optional dark mode, so that the app is pleasant to use during game sessions.

#### Acceptance Criteria

1. THE Scorer SHALL display a paper-like, clean, modern visual design
2. THE Scorer SHALL use minimal animations
3. THE Scorer SHALL provide a dark/light mode toggle in the left column
4. WHEN the theme is toggled, THE Scorer SHALL immediately update the visual appearance
5. THE Scorer SHALL persist the theme preference across sessions
