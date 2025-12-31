import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlayerCard } from './PlayerCard';
import type { Player } from '../../types';
import {
  SidebarContainer,
  SidebarHeader,
  SidebarTitle,
  PlayerList,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  ActionSection,
  ResetButton,
  ThemeToggleContainer,
  ThemeToggleLabel,
  ThemeToggle,
  Overlay,
  Modal,
  ModalTitle,
  ModalText,
  ModalButtons,
  ModalButton
} from './PlayerSidebar.styles';

interface PlayerSidebarProps {
  players: Player[];
  onReset: () => void;
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark';
}

export function PlayerSidebar({ 
  players, 
  onReset, 
  onThemeToggle, 
  currentTheme 
}: PlayerSidebarProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showResetConfirm) {
        setShowResetConfirm(false);
      }
    };
    
    if (showResetConfirm) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showResetConfirm]);

  // Error handling for invalid player data
  if (!players || !Array.isArray(players)) {
    console.error('Invalid players data:', players);
    return (
      <SidebarContainer>
        <SidebarHeader>
          <SidebarTitle>Players</SidebarTitle>
        </SidebarHeader>
        <PlayerList>
          <EmptyState>
            <EmptyStateText>Error loading players</EmptyStateText>
          </EmptyState>
        </PlayerList>
      </SidebarContainer>
    );
  }

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    onReset();
    setShowResetConfirm(false);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  return (
    <>
      <SidebarContainer>
        <SidebarHeader>
          <SidebarTitle>Players</SidebarTitle>
        </SidebarHeader>
        
        <PlayerList>
          {players.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>👥</EmptyStateIcon>
              <EmptyStateText>No players configured</EmptyStateText>
            </EmptyState>
          ) : (
            players.map((player) => (
              <PlayerCard
                key={player.id}
                name={player.name}
                color={player.color}
                totalScore={player.totalScore}
                position={player.position}
              />
            ))
          )}
        </PlayerList>

        <ActionSection>
          <ResetButton onClick={handleResetClick}>
            Reset Game
          </ResetButton>
          
          <ThemeToggleContainer>
            <ThemeToggleLabel>
              {currentTheme === 'light' ? 'Light' : 'Dark'} Mode
            </ThemeToggleLabel>
            <ThemeToggle 
              $isDark={currentTheme === 'dark'}
              onClick={onThemeToggle}
              aria-label={`Toggle theme. Currently ${currentTheme} mode`}
              role="switch"
              aria-checked={currentTheme === 'dark'}
            />
          </ThemeToggleContainer>
        </ActionSection>
      </SidebarContainer>

      {showResetConfirm && createPortal(
        <Overlay 
          $visible={showResetConfirm}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          aria-describedby="reset-modal-description"
        >
          <Modal>
            <ModalTitle id="reset-modal-title">Reset Game</ModalTitle>
            <ModalText id="reset-modal-description">
              Are you sure you want to reset the game? This will clear all current 
              game data and return to the setup screen. This action cannot be undone.
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={handleResetCancel}>
                Cancel
              </ModalButton>
              <ModalButton $variant="primary" onClick={handleResetConfirm}>
                Reset Game
              </ModalButton>
            </ModalButtons>
          </Modal>
        </Overlay>,
        document.body
      )}
    </>
  );
}

