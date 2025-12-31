import React from 'react';
import type { SpritzeState, CarryOverSpritze, SpritzeType } from '../../types';
import {
  SpritzeDisplayContainer,
  SpritzeCount,
  SpritzeTypes,
  CarryOverIndicator
} from './SpritzeDisplay.styles';

interface SpritzeDisplayProps {
  spritzeState: SpritzeState;
  carryOverSpritzes: CarryOverSpritze[];
  mode: 'normal' | 'custom';
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
}) => {
  let activeSpritzes = 0;
  let spritzeTypesList: string[] = [];

  if (mode === 'normal') {
    spritzeTypesList = spritzeState.selectedTypes || [];
    const announcements = spritzeState.announcedBy?.length || 0;
    activeSpritzes = spritzeTypesList.length + announcements;
  } else {
    const customSpritzes = spritzeState.customCount || 0;
    const announcements = spritzeState.announcedBy?.length || 0;
    activeSpritzes = customSpritzes + announcements;
  }

  const totalSpritzes = activeSpritzes + carryOverSpritzes.length;

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
      aria-label={`${totalSpritzes === 1 ? '1 Spritze' : `${totalSpritzes} Spritzes`}`}
    >
      <SpritzeCount>
        {totalSpritzes} {totalSpritzes === 1 ? 'Spritze' : 'Spritzes'}
      </SpritzeCount>
      
      {mode === 'normal' && spritzeTypesList.length > 0 && (
        <SpritzeTypes>
          {spritzeTypesList.map(type => spritzeLabels[type as SpritzeType]).join(' ')}
        </SpritzeTypes>
      )}
      
      {mode === 'custom' && (spritzeState.customCount || 0) > 0 && (
        <SpritzeTypes>
          Custom: {spritzeState.customCount || 0}
        </SpritzeTypes>
      )}
      
      {(spritzeState.announcedBy?.length || 0) > 0 && (
        <SpritzeTypes>
          A: {(spritzeState.announcedBy || []).length}
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