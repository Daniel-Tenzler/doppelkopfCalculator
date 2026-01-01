import styled from 'styled-components';
import { COMPONENT_SIZES, Z_INDEX, LAYOUT } from '../constants';

interface RoundNumberCellProps {
  $isCurrentRound: boolean;
  $isPreviousRound: boolean;
}

export const RoundNumberCell = styled.div<RoundNumberCellProps>`
  position: relative;
  padding: 12px 8px;
  width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  min-height: ${COMPONENT_SIZES.MIN_CELL_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isCurrentRound, $isPreviousRound }) => ($isCurrentRound || $isPreviousRound) ? 'pointer' : 'default'};
  overflow: hidden;
  height: 100px;
  align-self: center;

  &:hover {
    background: ${({ $isCurrentRound, $isPreviousRound, theme }) => ($isCurrentRound || $isPreviousRound) ? theme.colors.primary + '20' : theme.colors.surface};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ActionButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: ${Z_INDEX.ACTION_BUTTON};
  white-space: nowrap;
  max-width: 90%;

  &.accept {
    background: ${({ theme }) => theme.colors.success};
    color: white;
    
    &:hover, &:focus {
      background: ${({ theme }) => theme.colors.success}dd;
      outline: 1px solid ${({ theme }) => theme.colors.success};
    }
  }

  &.reset {
    background: ${({ theme }) => theme.colors.error};
    color: white;
    
    &:hover, &:focus {
      background: ${({ theme }) => theme.colors.error}dd;
      outline: 1px solid ${({ theme }) => theme.colors.error};
    }
  }
`;