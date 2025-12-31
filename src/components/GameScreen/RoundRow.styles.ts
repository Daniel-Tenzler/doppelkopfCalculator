import styled from 'styled-components';
import { GRID_LAYOUT, LAYOUT } from './constants';

export const RoundRowContainer = styled.div`
  display: grid;
  grid-template-columns: ${GRID_LAYOUT.COLUMNS};
  gap: ${GRID_LAYOUT.GAP};
  padding: ${GRID_LAYOUT.PADDING} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CurrentRoundRow = styled(RoundRowContainer)`
  border-radius: ${LAYOUT.BORDER_RADIUS};
  padding: 0;
  margin: -8px;
  padding: 8px;
  border: none;
  margin-top: 18px;
  background: ${({ theme }) => theme.colors.primary + '10'};
`;