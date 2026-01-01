import styled from 'styled-components';
import { COMPONENT_SIZES, LAYOUT } from '../constants';

export const SpritzeDisplayContainer = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  min-height: ${COMPONENT_SIZES.MIN_CELL_HEIGHT};
  display: flex;
  flex-direction: column;
  min-height: 100px;
  height: fit-content;
  align-self: center;
  gap: 6px;
`;

export const SpritzeCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const SpritzeTypes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  align-items: center;
`;

export const SpritzePill = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.primary + '15'};
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 500;
`;

export const CarryOverIndicator = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.carryOver};
  text-align: center;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.carryOver + '15'};
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-block;
  align-self: center;
  margin-top: 2px;
`;

export const CustomInput = styled.input`
  padding: 8px 12px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;