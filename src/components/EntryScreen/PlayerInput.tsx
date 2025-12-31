import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { validation } from '../../constants';
import {
  Container,
  InputGroup,
  Label,
  TextInput,
  ColorPicker,
  ErrorMessage
} from './PlayerInput.styles';

interface PlayerInputProps {
  playerNumber: number;
  value: string;
  color: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  hasError?: boolean;
}





export const PlayerInput: React.FC<PlayerInputProps> = ({
  playerNumber,
  value,
  color,
  onNameChange,
  onColorChange,
  hasError = false
}) => {
  // Theme context is needed for styled components
  useThemeContext();
  
  return (
    <Container>
      <InputGroup>
        <Label>Spieler {playerNumber}:</Label>
        <TextInput
          type="text"
          value={value}
          onChange={(e) => {
            // Enforce maximum length
            const newValue = e.target.value.slice(0, validation.maxPlayerNameLength);
            onNameChange(newValue);
          }}
          placeholder={`Spieler-${playerNumber}-Namen eingeben`}
          $hasError={hasError}
          maxLength={validation.maxPlayerNameLength}
          pattern={validation.playerNamePattern}
          title={`Player name (${validation.minPlayerNameLength}-${validation.maxPlayerNameLength} characters, letters and special characters only)`}
        />
        <ColorPicker
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          title={`Player ${playerNumber} color`}
        />
      </InputGroup>
      {hasError && (
        <ErrorMessage>Player name is required</ErrorMessage>
      )}
    </Container>
  );
};