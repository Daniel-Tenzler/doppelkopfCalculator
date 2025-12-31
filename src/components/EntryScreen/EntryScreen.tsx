import React, { useState, useCallback } from 'react';
import { PlayerInput } from './PlayerInput';
import { SpritzeModeSelector } from './SpritzeModeSelector';
import type { GameConfig, PlayerConfig, SpritzeType } from '../../types';
import { useThemeContext } from '../../context/ThemeContext';
import { defaultPlayerColors, defaultEnabledTypes, validation } from '../../constants';
import {
  Container,
  Card,
  Header,
  Title,
  Subtitle,
  PlayersSection,
  SectionTitle,
  PlayersGrid,
  Button,
  ButtonGroup
} from './EntryScreen.styles';

interface EntryScreenProps {
  onGameStart: (config: GameConfig) => void;
}


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