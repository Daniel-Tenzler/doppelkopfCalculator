import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PlayerCard } from './PlayerCard';
import type { Player } from '../../types';

const SidebarContainer = styled.div`
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  margin-bottom: 24px;
`;

const SidebarTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 20px 0;
`;

const PlayerList = styled.div`
  flex: 1;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 20px;
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
`;

const ThemeToggleLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const ThemeToggle = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${({ $isDark, theme }) => 
    $isDark ? theme.colors.primary : theme.colors.border};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $isDark }) => $isDark ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: ${({ theme }) => theme.shadowHeavy};
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
`;

const ModalText = styled.p`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.error : theme.colors.border};
  background: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.error : 'transparent'};
  color: ${({ theme, $variant }) => 
    $variant === 'primary' ? 'white' : theme.colors.text};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${({ theme, $variant }) => 
      $variant === 'primary' 
        ? `
          background: ${theme.colors.error};
          opacity: 0.9;
        `
        : `
          background: ${theme.colors.borderLight};
          color: ${theme.colors.text};
        `
    }
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

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
      </Overlay>
    </>
  );
}

