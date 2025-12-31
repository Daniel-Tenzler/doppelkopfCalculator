import styled from 'styled-components';
import { COMPONENT_SIZES, LAYOUT } from './constants';

export const SpritzeCheckboxesContainer = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  min-height: ${COMPONENT_SIZES.MIN_CELL_HEIGHT};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

interface CheckboxLabelProps {
  $disabled: boolean;
}

export const CheckboxLabel = styled.label<CheckboxLabelProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};

  input[type="checkbox"] {
    width: ${COMPONENT_SIZES.SMALL_CHECKBOX_SIZE};
    height: ${COMPONENT_SIZES.SMALL_CHECKBOX_SIZE};
    accent-color: ${({ theme }) => theme.colors.spritzeActive};
    cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${LAYOUT.BORDER_RADIUS};
  }
`;

interface SpritzeTypeCheckboxProps {
  $disabled: boolean;
}

export const SpritzeTypeCheckbox = styled.input.attrs({ type: 'checkbox' })<SpritzeTypeCheckboxProps>`
  width: ${COMPONENT_SIZES.SMALL_CHECKBOX_SIZE};
  height: ${COMPONENT_SIZES.SMALL_CHECKBOX_SIZE};
  accent-color: ${({ theme }) => theme.colors.spritzeActive};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
`;

export const SpritzeLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

export const StatusText = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: 4px 0;
`;

export const AnnounceSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 8px;
  margin-top: 6px;
`;

export const AnnounceGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;