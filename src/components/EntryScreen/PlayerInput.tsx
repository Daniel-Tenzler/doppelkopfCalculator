import React from 'react';
import styled from 'styled-components';
import { useThemeContext } from '../../context/ThemeContext';
import { validation } from '../../constants';

interface PlayerInputProps {
  playerNumber: number;
  value: string;
  color: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  hasError?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadow};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  min-width: 80px;
`;

const TextInput = styled.input<{ $hasError?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.card};
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(252, 129, 129, 0.2)' : 'rgba(49, 130, 206, 0.2)'};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  background: none;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
`;



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
        <Label>Player {playerNumber}:</Label>
        <TextInput
          type="text"
          value={value}
          onChange={(e) => {
            // Enforce maximum length
            const newValue = e.target.value.slice(0, validation.maxPlayerNameLength);
            onNameChange(newValue);
          }}
          placeholder={`Enter player ${playerNumber} name`}
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