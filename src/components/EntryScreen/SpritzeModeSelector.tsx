import React from 'react';
import type { SpritzeType } from '../../types';
import { useThemeContext } from '../../context/ThemeContext';
import { spritzeTypeLabels, validation } from '../../constants';
import {
  Container,
  Title,
  RadioGroup,
  RadioLabel,
  RadioInput,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxInput,
  NumberInput,
  CustomModeSection,
  HelperText
} from './SpritzeModeSelector.styles';

interface SpritzeModeSelectorProps {
  mode: 'normal' | 'custom';
  enabledTypes: SpritzeType[];
  customSpritzeCount?: number;
  onModeChange: (mode: 'normal' | 'custom') => void;
  onTypeToggle: (type: SpritzeType) => void;
  onCustomCountChange: (count: number) => void;
}



export const SpritzeModeSelector: React.FC<SpritzeModeSelectorProps> = ({
  mode,
  enabledTypes,
  customSpritzeCount = 0,
  onModeChange,
  onTypeToggle,
  onCustomCountChange
}) => {
  useThemeContext(); // Ensure theme context is available for styled components

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
          <HelperText>
            (0-{validation.maxCustomSpritzeCount})
          </HelperText>
        </CustomModeSection>
      )}
    </Container>
  );
};