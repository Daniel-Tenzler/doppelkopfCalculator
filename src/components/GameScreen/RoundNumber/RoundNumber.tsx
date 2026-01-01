import React, { useState, useCallback } from 'react';

import {
  RoundNumberCell,
  ActionButton
} from './RoundNumber.styles';

interface RoundNumberProps {
  roundNumber: number;
  isCurrentRound: boolean;
  isPreviousRound: boolean;
  onAccept: () => void;
  onReset: () => void;
}

export const RoundNumber: React.FC<RoundNumberProps> = ({
  roundNumber,
  isCurrentRound,
  isPreviousRound,
  onAccept,
  onReset,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasAction = isCurrentRound || isPreviousRound;

  // Consolidated action handler
  const handleAction = useCallback(() => {
    if (isCurrentRound) {
      onAccept();
    } else if (isPreviousRound) {
      onReset();
    }
  }, [isCurrentRound, isPreviousRound, onAccept, onReset]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && hasAction) {
      e.preventDefault();
      handleAction();
    }
  }, [hasAction, handleAction]);

  const getActionAriaLabel = () => {
    if (isCurrentRound) return `Accept round ${roundNumber}`;
    if (isPreviousRound) return `Reset round ${roundNumber}`;
    return '';
  };

  return (
    <RoundNumberCell
      $isCurrentRound={isCurrentRound}
      $isPreviousRound={isPreviousRound}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={hasAction ? handleAction : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={hasAction ? 0 : -1}
      role="button"
      aria-label={getActionAriaLabel()}
      aria-disabled={!hasAction}
    >
      <span aria-hidden="true">{roundNumber}</span>
      {isHovered && hasAction && (
        <ActionButton
          className={isCurrentRound ? 'accept' : 'reset'}
          onClick={handleAction}
          aria-label={getActionAriaLabel()}
        >
          {isCurrentRound ? '✓' : '↺'}
        </ActionButton>
      )}
    </RoundNumberCell>
  );
};