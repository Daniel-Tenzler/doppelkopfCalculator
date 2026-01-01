import styled from 'styled-components';
import { GRID_LAYOUT, LAYOUT } from '../constants';

export const RoundRowContainer = styled.div`
  display: grid;
  grid-template-columns: ${GRID_LAYOUT.COLUMNS};
  gap: ${GRID_LAYOUT.GAP};
  padding: ${GRID_LAYOUT.PADDING} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 450px) {
    /* Card-based layout for mobile */
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    margin-bottom: 12px;
    border-bottom: none; /* Remove the default border-bottom */
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
  
  @media (max-width: 450px) {
    margin: 0 0 16px 0;
    padding: 16px;
    background: ${({ theme }) => theme.colors.primary + '15'};
    border: 2px solid ${({ theme }) => theme.colors.primary + '40'};
  }
`;