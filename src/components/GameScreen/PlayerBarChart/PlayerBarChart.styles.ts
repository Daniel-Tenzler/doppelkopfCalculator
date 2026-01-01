import styled from 'styled-components';

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
`;

export const ChartBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BarLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PositionBadge = styled.span<{ $position: number }>`
  font-size: 20px;
  flex-shrink: 0;
  filter: ${({ $position }) => 
    $position > 3 ? 'grayscale(0.5) opacity(0.7)' : 'none'};
`;

export const BarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

export const BarFill = styled.div<{ 
  $color: string; 
  $width: number;
  $isNegative: boolean;
}>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color, $isNegative }) => 
    $isNegative ? `linear-gradient(90deg, ${$color}40, ${$color}80)` : $color};
  border-right: ${({ $isNegative }) => 
    $isNegative ? 'none' : '2px solid rgba(255, 255, 255, 0.3)'};
  transition: width 0.3s ease-out;
  position: relative;
  
  ${({ $isNegative, theme }) => $isNegative && `
    opacity: 0.6;
    background: repeating-linear-gradient(
      45deg,
      ${theme.colors.error}40,
      ${theme.colors.error}40 10px,
      ${theme.colors.error}20 10px,
      ${theme.colors.error}20 20px
    );
  `}
`;

export const ScoreLabel = styled.div<{ $isNegative: boolean }>`
  position: absolute;
  right: 12px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme, $isNegative }) => 
    $isNegative ? theme.colors.error : theme.colors.text};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
