import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { PlayerInput } from './PlayerInput';
import { SpritzeModeSelector } from './SpritzeModeSelector';
import type { GameConfig, PlayerConfig, SpritzeType } from '../../types';
import { useThemeContext } from '../../context/ThemeContext';
import { defaultPlayerColors, defaultEnabledTypes, validation } from '../../constants';

interface EntryScreenProps {
  onGameStart: (config: GameConfig) => void;
}

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadowHeavy};
  padding: 32px;
  max-width: 800px;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PlayersSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$variant === 'secondary' ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.$variant === 'secondary' ? props.theme.colors.primary : props.theme.colors.textOnSurface};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${props.theme.colors.primary}` : 'none'};
  
  &:hover {
    background: ${props => props.$variant === 'secondary' ? props.theme.colors.surface : props.theme.colors.primaryHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
`;



export const EntryScreen: React.FC<EntryScreenProps> = ({ onGameStart }) => {
  useThemeContext(); // Ensure theme context is available for styled components
  
  const [players, setPlayers] = useState<PlayerConfig[]>([
    { name: '', color: defaultPlayerColors[0] },
    { name: '', color: defaultPlayerColors[1] },
    { name: '', color: defaultPlayerColors[2] },
    { name: '', color: defaultPlayerColors[3] }
  ]);
  
  const [spritzeMode, setSpritzeMode] = useState<'normal' | 'custom'>('normal');
  const [enabledTypes, setEnabledTypes] = useState<SpritzeType[]>(defaultEnabledTypes);
  const [customSpritzeCount, setCustomSpritzeCount] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<boolean[]>([false, false, false, false]);

  const updatePlayerName = useCallback((index: number, name: string) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[index] = { ...newPlayers[index], name };
      return newPlayers;
    });
    
    // Clear validation error when user starts typing
    if (name.trim()) {
      setValidationErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = false;
        return newErrors;
      });
    }
  }, []);

  const updatePlayerColor = useCallback((index: number, color: string) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[index] = { ...newPlayers[index], color };
      return newPlayers;
    });
  }, []);

  const handleSpritzeTypeToggle = useCallback((type: SpritzeType) => {
    setEnabledTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  const handleCustomSpritzeCountChange = useCallback((count: number) => {
    setCustomSpritzeCount(count);
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors = players.map(player => {
      const name = player.name.trim();
      return name.length < validation.minPlayerNameLength || name.length > validation.maxPlayerNameLength;
    });
    setValidationErrors(errors);
    return errors.every(error => !error);
  }, [players]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const config: GameConfig = {
      players: players.map(player => ({
        name: player.name.trim(),
        color: player.color
      })),
      spritzeMode,
      enabledSpritzeTypes: spritzeMode === 'normal' ? enabledTypes : undefined,
      customSpritzeCount: spritzeMode === 'custom' ? customSpritzeCount : undefined
    };

    onGameStart(config);
  }, [players, spritzeMode, enabledTypes, customSpritzeCount, validateForm, onGameStart]);

  const hasValidationErrors = validationErrors.some(error => error);
  const canSubmit = players.every(player => player.name.trim()) && !hasValidationErrors;

  return (
    <Container>
      <Card>
        <Header>
          <Title>Doppelkopf Scorer</Title>
          <Subtitle>Track your Doppelkopf games with ease</Subtitle>
        </Header>

        <form onSubmit={handleSubmit}>
          <PlayersSection>
            <SectionTitle>Players</SectionTitle>
            <PlayersGrid>
              {players.map((player, index) => (
                <PlayerInput
                  key={index}
                  playerNumber={index + 1}
                  value={player.name}
                  color={player.color}
                  onNameChange={(name) => updatePlayerName(index, name)}
                  onColorChange={(color) => updatePlayerColor(index, color)}
                  hasError={validationErrors[index]}
                />
              ))}
            </PlayersGrid>
          </PlayersSection>

          <SpritzeModeSelector
            mode={spritzeMode}
            enabledTypes={enabledTypes}
            customSpritzeCount={customSpritzeCount}
            onModeChange={setSpritzeMode}
            onTypeToggle={handleSpritzeTypeToggle}
            onCustomCountChange={handleCustomSpritzeCountChange}
          />

          <ButtonGroup>
            <Button type="submit" disabled={!canSubmit}>
              Start Game
            </Button>
          </ButtonGroup>
        </form>
      </Card>
    </Container>
  );
};