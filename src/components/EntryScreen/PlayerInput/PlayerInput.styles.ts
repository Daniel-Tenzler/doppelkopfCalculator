import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: 
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
      
    &::before {
      transform: scaleX(1);
    }
  }
  
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 
      0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`},
      0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 8px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: clamp(12px, 2vw, 14px);
    gap: 6px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 16px);
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: clamp(8px, 1.5vw, 12px);
  }
`;

export const Label = styled.label`
  font-size: clamp(13px, 1.2vw, 14px);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  min-width: 70px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    font-size: clamp(12px, 1.3vw, 13px);
    min-width: 65px;
    gap: 4px;
  }
  
  @media (max-width: 480px) {
    min-width: auto;
    font-size: clamp(12px, 1.6vw, 13px);
  }
`;

export const TextInput = styled.input<{ $hasError?: boolean }>`
  flex: 1;
  padding: 10px 14px;
  border: 2px solid ${({ $hasError, theme }) => $hasError ? theme.colors.error : theme.colors.border};
  border-radius: 6px;
  font-size: clamp(13px, 1.2vw, 14px);
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.card};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 40px;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 
      0 0 0 3px ${({ $hasError, theme }) => $hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`},
      0 1px 3px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: ${({ $hasError, theme }) => $hasError ? theme.colors.error : theme.colors.borderDark};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    padding: 9px 12px;
    font-size: clamp(12px, 1.3vw, 13px);
    min-height: 38px;
  }
  
  @media (max-width: 480px) {
    padding: clamp(8px, 1.2vw, 12px) clamp(10px, 1.5vw, 14px);
    font-size: clamp(12px, 1.6vw, 14px);
    min-height: 36px;
  }
`;

export const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  background: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 40px;
  min-height: 40px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
    
    &::before {
      opacity: 0.1;
    }
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}40`};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
  }
  
  @media (max-width: 480px) {
    width: clamp(32px, 4.5vw, 36px);
    height: clamp(32px, 4.5vw, 36px);
    min-width: clamp(32px, 4.5vw, 36px);
    min-height: clamp(32px, 4.5vw, 36px);
  }
`;

export const ErrorMessage = styled.div`
  font-size: clamp(11px, 1.5vw, 13px);
  color: ${({ theme }) => theme.colors.error};
  margin-top: clamp(4px, 0.8vw, 6px);
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.8vw, 6px);
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::before {
    content: '⚠';
    font-size: clamp(10px, 1.3vw, 12px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(10px, 1.3vw, 12px);
    margin-top: clamp(3px, 0.6vw, 5px);
  }
`;