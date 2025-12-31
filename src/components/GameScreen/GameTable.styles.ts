import styled from 'styled-components';
import { GRID_LAYOUT, COMPONENT_SIZES, LAYOUT } from './constants';

export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 40px;
  color: ${({ theme }) => theme.colors.error};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${LAYOUT.BORDER_RADIUS_LARGE};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  line-height: 1.5;
`;

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${LAYOUT.BORDER_RADIUS_LARGE};
  box-shadow: ${({ theme }) => theme.shadowLight};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${GRID_LAYOUT.COLUMNS};
  gap: ${GRID_LAYOUT.GAP};
  padding: 24px ${GRID_LAYOUT.PADDING};
  background: ${({ theme }) => theme.colors.paper};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

export const HeaderCell = styled.div<{ $width?: string, $start?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $start }) => ($start ? 'start' : 'center')};
  text-align: center;
  padding: 16px 12px;
  min-height: ${COMPONENT_SIZES.MIN_CELL_HEIGHT};
  width: ${({ $width }) => $width || 'auto'};
  font-weight: 600;
  font-size: 13px;
`;

export const PlayerHeaderCell = styled(HeaderCell)`
  justify-content: flex-start;
  gap: 16px;
  text-align: left;
`;

export const PlayerColorIndicator = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

export const RoundsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px ${GRID_LAYOUT.PADDING} ${GRID_LAYOUT.PADDING};
  min-height: 300px;
  
  /* Modern scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.borderLight};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderDark};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.textMuted};
    }
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.borderDark} ${({ theme }) => theme.colors.borderLight};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  min-height: 300px;
`;

export const EmptyStateText = styled.p`
  margin: 16px 0;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;