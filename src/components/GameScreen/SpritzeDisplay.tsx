import React, { useState, useCallback } from 'react';
import type { SpritzeState, CarryOverSpritze, SpritzeType } from '../../types';
import {
  SpritzeDisplayContainer,
  SpritzeCount,
  SpritzeTypes,
  SpritzePill,
  CarryOverIndicator,
  CustomInput
} from './SpritzeDisplay.styles';

interface SpritzeDisplayProps {
  spritzeState: SpritzeState;
  carryOverSpritzes: CarryOverSpritze[];
  mode: 'normal' | 'custom';
  isLocked: boolean;
  onChange?: (spritzeState: SpritzeState) => void;
}

// Human-readable labels for spritze types
const spritzeLabels: Record<SpritzeType, string> = {
  below_90: '< 90',
  below_60: '< 60',
  below_30: '< 30',
  schwarz: '0',
  against_queens: '♛',
  solo: 'Solo',
  announced: 'A'
};

export const SpritzeDisplay: React.FC<SpritzeDisplayProps> = ({
  spritzeState,
  carryOverSpritzes,
  mode,
  isLocked,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    String(spritzeState.customCount ?? 0)
  );

  const handleCustomCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Parse and update - allow any number including 0
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && onChange) {
      onChange({
        ...spritzeState,
        customCount: numValue
      });
    } else if (value === '' && onChange) {
      // Empty input = 0
      onChange({
        ...spritzeState,
        customCount: 0
      });
    }
  }, [spritzeState, onChange]);

  // For custom mode, ignore carry-overs and announcements
  let activeSpritzes = 0;
  let spritzeTypesList: string[] = [];

  if (mode === 'normal') {
    spritzeTypesList = spritzeState.selectedTypes || [];
    const announcements = spritzeState.announcedBy?.length || 0;
    activeSpritzes = spritzeTypesList.length + announcements;
  } else {
    // Custom mode: only use customCount, no carry-overs or announcements
    activeSpritzes = spritzeState.customCount || 0;
  }

  // In custom mode, don't add carry-overs to total
  const totalSpritzes = mode === 'custom' 
    ? activeSpritzes 
    : activeSpritzes + carryOverSpritzes.length;

  // Custom mode: show editable input
  if (mode === 'custom') {
    return (
      <SpritzeDisplayContainer
        role="region"
        aria-label="Custom spritze count"
      >
        {isLocked ? (
          <>
            <SpritzeCount>
              {totalSpritzes} {totalSpritzes === 1 ? 'Spritze' : 'Spritzen'}
            </SpritzeCount>
          </>
        ) : (
          <>
            <CustomInput
              type="number"
              min="0"
              value={inputValue}
              onChange={handleCustomCountChange}
              placeholder="0"
              aria-label="Enter number of spritzes"
            />
            <SpritzeCount style={{ fontSize: '12px', marginTop: '4px' }}>
              {totalSpritzes} {totalSpritzes === 1 ? 'Spritze' : 'Spritzen'}
            </SpritzeCount>
          </>
        )}
      </SpritzeDisplayContainer>
    );
  }

  // Normal mode: show display with types and carry-overs
  if (totalSpritzes === 0) {
    return (
      <SpritzeDisplayContainer
        role="status"
        aria-live="polite"
        aria-label="No spritzes"
      >
        <SpritzeCount>-</SpritzeCount>
      </SpritzeDisplayContainer>
    );
  }

  return (
    <SpritzeDisplayContainer
      role="status"
      aria-live="polite"
      aria-label={`${totalSpritzes === 1 ? '1 Spritze' : `${totalSpritzes} Spritzen`}`}
    >
      <SpritzeCount>
        {totalSpritzes} {totalSpritzes === 1 ? 'Spritze' : 'Spritzen'}
      </SpritzeCount>

      {spritzeTypesList.length > 0 && (
        <SpritzeTypes>
          {spritzeTypesList.map(type => (
            <SpritzePill key={type}>{spritzeLabels[type as SpritzeType]}</SpritzePill>
          ))}
        </SpritzeTypes>
      )}

      {(spritzeState.announcedBy?.length || 0) > 0 && (
        <SpritzeTypes>
          <SpritzePill>A: {(spritzeState.announcedBy || []).length}</SpritzePill>
        </SpritzeTypes>
      )}

      {carryOverSpritzes.length > 0 && (
        <CarryOverIndicator>
          {(() => {
            const lossCarryOvers = carryOverSpritzes.filter(co => co.type === 'loss' || co.type === undefined);
            const announcementCarryOvers = carryOverSpritzes.filter(co => co.type === 'announcement');
            const parts = [];
            if (lossCarryOvers.length > 0) {
              parts.push(`L: ${lossCarryOvers.length}`);
            }
            if (announcementCarryOvers.length > 0) {
              parts.push(`A: ${announcementCarryOvers.length}`);
            }
            return `Carry-over: ${parts.join(', ')}`;
          })()}
        </CarryOverIndicator>
      )}
    </SpritzeDisplayContainer>
  );
};