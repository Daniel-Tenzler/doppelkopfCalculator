import React, { useMemo } from 'react';

import type { SpritzeState, SpritzeType, Player } from '../../../types';
import {
  SpritzeCheckboxesContainer,
  CheckboxGroup,
  CheckboxLabel,
  SpritzeTypeCheckbox,
  SpritzeLabel,
  StatusText,
  AnnounceSection,
  AnnounceGroup
} from './SpritzeCheckboxes.styles';

interface SpritzeCheckboxesProps {
  spritzeState: SpritzeState;
  isLocked: boolean;
  players: Player[];
  onChange: (spritzeState: SpritzeState) => void;
}

// Define all available spritze types with their labels (excluding 'announced' as it's now player-specific)
const spritzeTypes: Array<{ type: SpritzeType; label: string; description: string }> = [
  { type: 'below_90', label: '< 90', description: 'Loser below 90 points' },
  { type: 'below_60', label: '< 60', description: 'Loser below 60 points' },
  { type: 'below_30', label: '< 30', description: 'Loser below 30 points' },
  { type: 'schwarz', label: '0', description: 'Loser at 0 points (Schwarz)' },
  { type: 'against_queens', label: '♛', description: 'Won against queens' },
  { type: 'solo', label: 'Solo', description: 'Solo game' },
];

export const SpritzeCheckboxes: React.FC<SpritzeCheckboxesProps> = ({
  spritzeState,
  isLocked,
  players,
  onChange,
}) => {
  const selectedTypes = useMemo(() => spritzeState.selectedTypes || [], [spritzeState.selectedTypes]);
  const announcedBy = useMemo(() => spritzeState.announcedBy || [], [spritzeState.announcedBy]);

  const handleSpritzeToggle = (type: SpritzeType) => {
    if (isLocked) return;

    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];

    onChange({
      ...spritzeState,
      selectedTypes: newSelectedTypes,
    });
  };

  const handleAnnounceToggle = (playerId: string) => {
    if (isLocked) return;

    const newAnnouncedBy = announcedBy.includes(playerId)
      ? announcedBy.filter(id => id !== playerId)
      : [...announcedBy, playerId];

    onChange({
      ...spritzeState,
      announcedBy: newAnnouncedBy,
    });
  };

  if (isLocked) {
    return (
      <SpritzeCheckboxesContainer>
        <CheckboxLabel $disabled={true}>
          <span>{selectedTypes.length > 0 ? 'Locked' : '-'}</span>
        </CheckboxLabel>
        {selectedTypes.length > 0 && (
          <StatusText>
            {selectedTypes.length} spritze{selectedTypes.length !== 1 ? 's' : ''}
          </StatusText>
        )}
      </SpritzeCheckboxesContainer>
    );
  }

  return (
    <SpritzeCheckboxesContainer>
      <CheckboxGroup>
        {spritzeTypes.map(({ type, label, description }) => (
          <CheckboxLabel key={type} $disabled={isLocked}>
            <SpritzeTypeCheckbox
              $disabled={isLocked}
              checked={selectedTypes.includes(type)}
              onChange={() => handleSpritzeToggle(type)}
              disabled={isLocked}
              title={description}
            />
            <SpritzeLabel title={description}>{label}</SpritzeLabel>
          </CheckboxLabel>
        ))}
      </CheckboxGroup>

      {/* Player Announcement Checkboxes */}
      <AnnounceSection>
        <AnnounceGroup>
          {players.map(player => (
            <CheckboxLabel key={`announce-${player.id}`} $disabled={isLocked}>
              <SpritzeTypeCheckbox
                $disabled={isLocked}
                checked={announcedBy.includes(player.id)}
                onChange={() => handleAnnounceToggle(player.id)}
                disabled={isLocked}
                title={`${player.name} announced they would win`}
              />
              <SpritzeLabel title={`${player.name} announced they would win`}>
                {player.name.substring(0, 5)}
              </SpritzeLabel>
            </CheckboxLabel>
          ))}
        </AnnounceGroup>
      </AnnounceSection>
    </SpritzeCheckboxesContainer>
  );
};