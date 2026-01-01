import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: 
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.primary});
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
      
    &::after {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 18px;
    gap: 14px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: clamp(14px, 2vw, 16px);
    gap: 12px;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: clamp(16px, 2vw, 18px);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 8px);
  
  &::before {
    content: '🎯';
    font-size: clamp(14px, 1.8vw, 16px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(15px, 1.8vw, 17px);
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vw, 12px);
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 14px);
  font-size: clamp(14px, 1.8vw, 15px);
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: clamp(8px, 1.5vw, 12px);
  border-radius: clamp(6px, 1vw, 8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: clamp(44px, 6vw, 48px);
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}08`};
    transform: translateX(4px);
  }
  
  &:active {
    transform: translateX(2px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(13px, 1.6vw, 14px);
    padding: clamp(6px, 1.2vw, 10px);
    min-height: clamp(40px, 5.5vw, 44px);
  }
  
  @media (max-width: 450px) {
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 48px; /* Touch target minimum */
    padding: 10px 12px;
  }
`;

export const RadioInput = styled.input`
  margin: 0;
  cursor: pointer;
  width: clamp(16px, 2vw, 18px);
  height: clamp(16px, 2vw, 18px);
  min-width: clamp(16px, 2vw, 18px);
  min-height: clamp(16px, 2vw, 18px);
  accent-color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:checked {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: clamp(14px, 1.8vw, 16px);
    height: clamp(14px, 1.8vw, 16px);
    min-width: clamp(14px, 1.8vw, 16px);
    min-height: clamp(14px, 1.8vw, 16px);
  }
`;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(180px, 35vw, 220px), 1fr));
  gap: clamp(12px, 2vw, 16px);
  margin-top: clamp(12px, 2vw, 16px);
  padding-top: clamp(12px, 2vw, 16px);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(clamp(160px, 40vw, 200px), 1fr));
    gap: clamp(10px, 1.5vw, 14px);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: clamp(8px, 1.2vw, 12px);
    margin-top: clamp(10px, 1.5vw, 14px);
    padding-top: clamp(10px, 1.5vw, 14px);
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 14px);
  font-size: clamp(13px, 1.8vw, 15px);
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: clamp(6px, 1.2vw, 10px);
  border-radius: clamp(6px, 1vw, 8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: clamp(40px, 5.5vw, 44px);
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}08`};
    transform: translateX(2px);
  }
  
  &:active {
    transform: translateX(1px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(12px, 1.6vw, 14px);
    padding: clamp(5px, 1vw, 8px);
    min-height: clamp(36px, 5vw, 40px);
  }
`;

export const CheckboxInput = styled.input`
  margin: 0;
  cursor: pointer;
  width: clamp(14px, 1.8vw, 16px);
  height: clamp(14px, 1.8vw, 16px);
  min-width: clamp(14px, 1.8vw, 16px);
  min-height: clamp(14px, 1.8vw, 16px);
  accent-color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:checked {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: clamp(12px, 1.6vw, 14px);
    height: clamp(12px, 1.6vw, 14px);
    min-width: clamp(12px, 1.6vw, 14px);
    min-height: clamp(12px, 1.6vw, 14px);
  }
`;

export const NumberInput = styled.input`
  width: clamp(80px, 12vw, 100px);
  padding: clamp(8px, 1.2vw, 12px) clamp(12px, 2vw, 16px);
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: clamp(6px, 1vw, 8px);
  font-size: clamp(13px, 1.8vw, 15px);
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.card};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: clamp(40px, 5.5vw, 44px);
  text-align: center;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 
      0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`},
      0 1px 3px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderDark};
  }
  
  &:hover:not(:focus) {
    background: ${({ theme }) => theme.colors.surface};
  }
  
  @media (max-width: 480px) {
    width: clamp(70px, 10vw, 90px);
    padding: clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 14px);
    font-size: clamp(12px, 1.6vw, 14px);
    min-height: clamp(36px, 5vw, 40px);
  }
  
  @media (max-width: 450px) {
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 48px; /* Touch target minimum */
    width: 100px;
  }
`;

export const CustomModeSection = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 16px);
  margin-top: clamp(12px, 2vw, 16px);
  padding-top: clamp(12px, 2vw, 16px);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  
  label {
    font-size: clamp(13px, 1.8vw, 15px);
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: clamp(4px, 0.8vw, 6px);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: clamp(10px, 1.5vw, 14px);
  }
  
  @media (max-width: 480px) {
    margin-top: clamp(10px, 1.5vw, 14px);
    padding-top: clamp(10px, 1.5vw, 14px);
    
    label {
      font-size: clamp(12px, 1.6vw, 14px);
    }
  }
`;

export const HelperText = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(11px, 1.5vw, 13px);
  opacity: 0.8;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: clamp(2px, 0.4vw, 4px);
  
  &::before {
    content: 'ℹ';
    font-style: normal;
    font-size: clamp(10px, 1.3vw, 12px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(10px, 1.3vw, 12px);
  }
`;