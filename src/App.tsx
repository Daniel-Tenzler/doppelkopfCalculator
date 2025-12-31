import { ThemeProvider } from './components/ThemeProvider'
import { EntryScreen } from './components/EntryScreen'
import type { GameConfig } from './types'

function App() {
  const handleGameStart = (config: GameConfig) => {
    console.log('Game started with configuration:', config)
    alert(`Game started successfully with ${config.players.length} players!`)
  }

  return (
    <ThemeProvider>
      <EntryScreen onGameStart={handleGameStart} />
    </ThemeProvider>
  )
}

export default App
