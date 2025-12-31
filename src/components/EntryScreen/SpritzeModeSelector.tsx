import React from 'react';
import styled from 'styled-components';
import type { SpritzeType } from '../../types';
import { useThemeContext } from '../../context/ThemeContext';
import { spritzeTypeLabels, validation } from '../../constants';

interface SpritzeModeSelectorProps {
  mode: 'normal' | 'custom';
  enabledTypes: SpritzeType[];
  customSpritzeCount?: number;
  onModeChange: (mode: 'normal' | 'custom') => void;
  onTypeToggle: (type: SpritzeType) => void;
  onCustomCountChange: (count: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadow};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  margin: 0;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxInput = styled.input`
  margin: 0;
  cursor: pointer;
`;

const NumberInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.card};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const CustomModeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
  
  label {
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
`;

export const SpritzeModeSelector: React.FC<SpritzeModeSelectorProps> = ({
  mode,
  enabledTypes,
  customSpritzeCount = 0,
  onModeChange,
  onTypeToggle,
  onCustomCountChange
}) => {
  const { colors } = useThemeContext();

  const handleCustomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(validation.minCustomSpritzeCount, 
                                Math.min(validation.maxCustomSpritzeCount, value));
    onCustomCountChange(clampedValue);
  };

  return (
    <Container>
      <Title>Spritze Mode</Title>
      
      <RadioGroup>
        <RadioLabel>
          <RadioInput
            type="radio"
            name="spritze-mode"
            value="normal"
            checked={mode === 'normal'}
            onChange={() => onModeChange('normal')}
          />
          Normal Mode - Select predefined Spritze types
        </RadioLabel>
        
        <RadioLabel>
          <RadioInput
            type="radio"
            name="spritze-mode"
            value="custom"
            checked={mode === 'custom'}
            onChange={() => onModeChange('custom')}
          />
          Custom Mode - Enter numeric Spritze count
        </RadioLabel>
      </RadioGroup>

      {mode === 'normal' && (
        <CheckboxGroup>
          {(Object.keys(spritzeTypeLabels) as SpritzeType[]).map((type) => (
            <CheckboxLabel key={type}>
              <CheckboxInput
                type="checkbox"
                checked={enabledTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
              />
              {spritzeTypeLabels[type]}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      )}

      {mode === 'custom' && (
        <CustomModeSection>
          <label>Custom Spritze Count:</label>
          <NumberInput
            type="number"
            min={validation.minCustomSpritzeCount}
            max={validation.maxCustomSpritzeCount}
            value={customSpritzeCount}
            onChange={handleCustomCountChange}
          />
          <span style={{ color: colors.textMuted, fontSize: '12px' }}>
            (0-{validation.maxCustomSpritzeCount})
          </span>
        </CustomModeSection>
      )}
    </Container>
  );
};