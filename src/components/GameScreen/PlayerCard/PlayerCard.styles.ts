import styled from 'styled-components';
import { LAYOUT } from '../constants';

export const PlayerCardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: ${LAYOUT.CARD_PADDING};
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  box-shadow: ${({ theme }) => theme.shadowLight};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow};
    border-color: ${({ theme }) => theme.colors.borderDark};
  }
`;

export const ColorIndicator = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 3px solid ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

export const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PlayerName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.3px;
`;

export const PlayerScore = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
  font-weight: 500;
`;

export const PlayerPosition = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;