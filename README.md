# Doppelkopf Scorer

A web application for tracking scores during Doppelkopf card game sessions. Built with React, TypeScript, and styled-components.

## Features

- Configure 4 players with names and colors
- Two Spritze modes:
  - Normal mode with predefined types (below 90/60/30 points, schwarz, against queens, solo, announced)
  - Custom mode with manual numeric input
- Create, accept, and undo rounds with automatic score calculation
- Display player standings and position rankings
- Game state persists in local storage
- Light and dark theme toggle with persistent preferences

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/doppelkopf.git
cd doppelkopf

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building

```bash
# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## Usage

1. **Start a New Game**: Enter player names, select colors, and choose Spritze mode
2. **Play Rounds**: Select winners (0-4 players) and configure Spritzes for each round
3. **Accept Rounds**: Click the accept button to finalize scores and move to the next round
4. **Track Standings**: View real-time player positions and total scores
5. **Undo Mistakes**: Reset the previous round if needed (only the immediately previous round can be undone)

## Spritze System

The game uses a doubling multiplier system:
- Base points: 10 per round
- Formula: `Round Points = 10 × 2^(Total Spritzes)`
- Spritzes stack additively from active selections and carry-over spritzes
- Carry-over spritzes are applied to losing players for 2 subsequent rounds

## Technology Stack

- React 19
- TypeScript
- Vite
- Styled Components
- ESLint

## Project Structure

```
src/
├── components/           # React components
│   ├── EntryScreen/     # Game setup interface
│   ├── GameScreen/      # Active game interface
│   └── ThemeProvider.tsx # Theme context and provider
├── context/             # React contexts
├── hooks/               # Custom React hooks
├── logic/               # Game logic and calculations
├── services/            # External integrations (localStorage)
├── theme/               # Theme definitions
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint and TypeScript checks
- `npm run preview` - Preview production build locally

## License

This project is open source and available under the [MIT License](LICENSE).
