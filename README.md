# Doppelkopf Scorer

A dual-platform application for tracking scores during Doppelkopf card game sessions. Built with React, TypeScript, and Tauri for both web and native desktop experiences.

## Features

### Core Game Features

- Configure 4 players with names and colors
- Two Spritze modes:
  - Normal mode with predefined types (below 90/60/30 points, schwarz, against queens, solo, announced)
  - Custom mode with manual numeric input
- Create, accept, and undo rounds with automatic score calculation
- Display player standings and position rankings
- Game state persists across sessions
- Light and dark theme toggle with persistent preferences

### Platform Features

- **Web Application**: Browser-based with responsive design
- **Desktop Application**: Native performance with file system storage
- **Cross-Platform Data**: Seamless game state sync between platforms
- **Auto-Save**: Intelligent storage based on platform capabilities
- **Native Integration**: Desktop menus, window controls, and system integration

## Development Status

### Completed Features

- Dual-platform architecture (Web + Desktop)
- Cross-platform storage with graceful fallbacks
- Native desktop integration (menus, window controls)
- Responsive design for all screen sizes
- Production-ready build system
- Comprehensive error handling and TypeScript safety

### In Progress

- Multiple game session management (storage backend ready)
- Solo scoring adjustments (game logic enhancement)

### Future Enhancements

- Internationalization support (currently mixed English/German)
- PWA service worker for offline web access
- Cloud sync between devices
- Advanced game statistics and analytics
- Tournament mode support
- Custom themes and styling options

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Rust toolchain (for desktop builds) - install from [rustup.rs](https://rustup.rs/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/doppelkopf.git
cd doppelkopf

# Install dependencies
npm install
# or
yarn install

# Install Tauri CLI (for desktop development)
npm install -g @tauri-apps/cli
```

### Development

#### Web Development
```bash
# Start web development server
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Desktop Development
```bash
# Start desktop development server
npm run tauri:dev
# or
yarn tauri:dev
```
This opens a native desktop window with hot reload.

### Building

#### Web Production Build
```bash
# Build for web deployment
npm run build
# or
yarn build

# Preview web build locally
npm run preview
# or
yarn preview
```
Outputs to `dist/` folder.

#### Desktop Production Build
```bash
# Build desktop application
npm run tauri:build
# or
yarn tauri:build
```
Outputs platform-specific installers to `src-tauri/target/release/bundle/`.

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

### Frontend

- React 19 - Modern UI framework
- TypeScript 5.9 - Type-safe development
- Vite 7.2 - Fast build tool and dev server
- Styled Components 6 - CSS-in-JS styling
- ESLint - Code quality and linting

### Desktop Platform

- Tauri 2.9 - Lightweight desktop app framework
- Rust - Secure and performant backend
- Cross-platform native APIs

### Development Tools

- Vite Plugin React - React integration
- Cross-env - Cross-platform script support
- TypeScript ESLint - Enhanced type checking

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
├── services/            # Platform integrations & utilities
│   ├── localStorage.ts          # Web storage
│   ├── crossPlatformStorage.ts  # Unified storage API
│   └── desktopFeatures.ts       # Desktop-specific features
├── theme/               # Theme definitions
├── types/               # TypeScript type definitions
└── utils/               # Utility functions

src-tauri/               # Tauri desktop backend
├── src/
│   ├── lib.rs           # Main Tauri application
│   └── main.rs          # Application entry point
├── Cargo.toml           # Rust dependencies
└── tauri.conf.json      # Tauri configuration
```

## Development Scripts

### Web Development

- `npm run dev` - Start web development server with hot reload
- `npm run build` - Build web version (outputs to `dist/`)
- `npm run preview` - Preview web build locally

### Desktop Development

- `npm run tauri:dev` - Start desktop development with hot reload
- `npm run tauri:build` - Build complete desktop application
- `npm run build:tauri` - Build frontend specifically for Tauri

### Quality Assurance

- `npm run lint` - Run ESLint and TypeScript checks

### Build Outputs

- **Web**: `dist/` folder - Ready for static hosting
- **Desktop**: `src-tauri/target/release/bundle/` - Platform-specific installers

## Platform Differences

### Web Version

- **Storage**: Browser localStorage
- **Deployment**: Static hosting (Vercel, Netlify, GitHub Pages, etc.)
- **Access**: Any modern web browser
- **Size**: ~2MB total bundle
- **Features**: Full game functionality, responsive design

### Desktop Version

- **Storage**: File system in system app data directory
- **Deployment**: Native installers (.msi, .app, .deb, .AppImage)
- **Access**: Native desktop application
- **Size**: ~15MB (includes Tauri runtime)
- **Features**: All web features + native integration, menus, window controls

### Data Compatibility
Both versions use identical data structures, enabling seamless experience switching between platforms.

## Deployment

### Web Deployment
```bash
# Build and deploy to any static hosting service
npm run build
# Upload the dist/ folder to your hosting provider
```

### Desktop Distribution
```bash
# Build for distribution
npm run tauri:build

# Find installers in:
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/deb/ and .app/
```

### CI/CD Considerations

- **Web**: Standard Node.js build pipeline
- **Desktop**: Requires Rust toolchain and Tauri CLI
- **Dual Builds**: Can build both versions in same pipeline with separate steps

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment and maintenance guide
- **[TAURI_INTEGRATION.md](TAURI_INTEGRATION.md)** - Technical details of desktop integration
- **[CRITICAL_FIXES.md](CRITICAL_FIXES.md)** - Important bug fixes and improvements

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. See [LICENSE.md](LICENSE.md) for details.
