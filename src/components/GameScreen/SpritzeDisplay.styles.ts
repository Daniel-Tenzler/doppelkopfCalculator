import styled from 'styled-components';
import { COMPONENT_SIZES, LAYOUT } from './constants';

export const SpritzeDisplayContainer = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  min-height: ${COMPONENT_SIZES.MIN_CELL_HEIGHT};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SpritzeCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const SpritzeTypes = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 1.4;
`;

export const CarryOverIndicator = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.carryOver};
  text-align: center;
  font-weight: 600;
`;