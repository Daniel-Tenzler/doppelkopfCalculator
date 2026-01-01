import React from 'react';
import type { SpritzeType } from '../../../types';
import { useThemeContext } from '../../../context/ThemeContext';
//import { validation } from '../../constants';
//import { spritzeTypeLabels } from '../../constants';
import {
  Container,
  Title,
  RadioGroup,
  RadioLabel,
  RadioInput,
  //CheckboxGroup,
  //CheckboxLabel,
  //CheckboxInput,
  //NumberInput,
  //CustomModeSection,
  //HelperText
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
  //enabledTypes,
  //customSpritzeCount = 0,
  onModeChange,
  //onTypeToggle,
  //onCustomCountChange
}) => {
  useThemeContext(); // Ensure theme context is available for styled components

  /*const handleCustomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(validation.minCustomSpritzeCount, 
                                Math.min(validation.maxCustomSpritzeCount, value));
    onCustomCountChange(clampedValue);
  };*/

  return (
    <Container>
      <Title>Spritzen Modus</Title>

      <RadioGroup>
        <RadioLabel>
          <RadioInput
            type="radio"
            name="spritze-mode"
            value="normal"
            checked={mode === 'normal'}
            onChange={() => onModeChange('normal')}
          />
          Normaler Modus - benutze vordefinierte Spritzen
        </RadioLabel>

        <RadioLabel>
          <RadioInput
            type="radio"
            name="spritze-mode"
            value="custom"
            checked={mode === 'custom'}
            onChange={() => onModeChange('custom')}
          />
          Benutzerdefinierter Modus - Anzahl der Spritzen eingeben
        </RadioLabel>
      </RadioGroup>


      {/** currently broken.
       mode === 'normal' && (
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
      )*/}


      {/** currently broken. 
       mode === 'custom' && (
        <CustomModeSection>
          <label>Benutzerdefinierte Spritzen Anzahl:</label>
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
      )*/}
    </Container>
  );
};