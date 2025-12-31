import styled from 'styled-components';
import { LAYOUT, COMPONENT_SIZES } from './constants';

export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: ${LAYOUT.CONTAINER_PADDING_Y};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${LAYOUT.BORDER_RADIUS_LARGE};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.error};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
`;

export const GameScreenContainer = styled.div`
  display: flex;
  gap: ${LAYOUT.SECTION_GAP};
  padding: ${LAYOUT.CONTAINER_PADDING_Y} ${LAYOUT.CONTAINER_PADDING_X};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  max-width: ${LAYOUT.CONTAINER_MAX_WIDTH};
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    gap: 24px;
    padding: 32px 24px;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: ${LAYOUT.SECTION_GAP};
    padding: 24px 20px;
  }
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    gap: 20px;
  }
`;

export const SidebarContainer = styled.div`
  flex: 0 0 ${COMPONENT_SIZES.SIDEBAR_WIDTH};
  min-width: ${COMPONENT_SIZES.SIDEBAR_WIDTH};
  
  @media (max-width: 1200px) {
    flex: 0 0 320px;
    min-width: 320px;
  }
  
  @media (max-width: 1024px) {
    flex: none;
    width: 100%;
    min-width: auto;
  }
`;

export const TableContainer = styled.div`
  flex: 1;
  min-width: 0; /* Prevent flex item from overflowing */
  display: flex;
  flex-direction: column;
  min-height: ${COMPONENT_SIZES.TABLE_MIN_HEIGHT};
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;