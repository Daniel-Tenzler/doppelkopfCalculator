import { ThemeProvider } from './components/ThemeProvider'
import { EntryScreen } from './components/EntryScreen'
import { GameScreen } from './components/GameScreen'
import { useGameState } from './hooks/useGameState'
import { useEffect, useCallback } from 'react'
import type { GameConfig } from './types'

// Error fallback component for graceful error handling
const ErrorFallback = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    padding: '24px',
    textAlign: 'center'
  }}>
    <h2>Something went wrong!</h2>
    <p>{error}</p>
    <button onClick={onRetry} style={{ 
      padding: '8px 16px', 
      backgroundColor: '#007bff', 
      color: 'white', 
      border: 'none', 
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
      Retry
    </button>
  </div>
)

// Loading component
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh' 
  }}>
    <div>Loading game...</div>
  </div>
)

function App() {
  const { 
    gameState, 
    startGame, 
    resetGame,
    isLoading,
    error,
    toggleWinner,
    updateSpritze,
    acceptRound,
    resetRound
  } = useGameState()

  useEffect(() => {
    // Check localStorage for existing game on mount is handled by useGameState hook
  }, [])

  const handleGameStart = useCallback(async (config: GameConfig) => {
    try {
      await startGame(config)
    } catch (err) {
      console.error('Failed to start game:', err)
    }
  }, [startGame])

  const handleReset = useCallback(async () => {
    try {
      await resetGame()
    } catch (err) {
      console.error('Failed to reset game:', err)
    }
  }, [resetGame])

  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  // Simple rendering logic based on game state
  if (isLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider>
        <ErrorFallback error={error} onRetry={handleRetry} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      {gameState ? (
        <GameScreen 
          gameState={gameState} 
          onReset={handleReset}
          toggleWinner={toggleWinner}
          updateSpritze={updateSpritze}
          acceptRound={acceptRound}
          resetRound={resetRound}
        />
      ) : (
        <EntryScreen onGameStart={handleGameStart} />
      )}
    </ThemeProvider>
  )
}

export default App