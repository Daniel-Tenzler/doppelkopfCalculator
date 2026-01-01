import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: clamp(12px, 3vw, 16px);
  }
  
  @media (max-width: 480px) {
    padding: clamp(8px, 2vw, 12px);
    align-items: flex-start;
    padding-top: clamp(24px, 6vw, 32px);
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 48px;
  max-width: 800px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05),
      0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 1400px) {
    max-width: 800px;
    padding: 44px;
  }
  
  @media (max-width: 1200px) {
    max-width: 700px;
    padding: 40px;
  }
  
  @media (max-width: 768px) {
    padding: clamp(20px, 4vw, 24px);
    border-radius: 12px;
    max-width: 500px;
  }
  
  @media (max-width: 480px) {
    padding: clamp(16px, 3vw, 20px);
    margin: 0 clamp(8px, 2vw, 12px);
    width: calc(100% - clamp(16px, 4vw, 24px));
    border-radius: 10px;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(24px, 5vw, 40px);
  
  @media (max-width: 480px) {
    margin-bottom: clamp(20px, 4vw, 32px);
  }
`;

export const Title = styled.h1`
  font-size: clamp(24px, 2.5vw, 28px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.text} 0%, ${({ theme }) => theme.colors.textSecondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: clamp(22px, 3vw, 26px);
    margin-bottom: clamp(6px, 1vw, 8px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(20px, 3vw, 24px);
  }
`;

export const Subtitle = styled.p`
  font-size: clamp(14px, 1.2vw, 16px);
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: clamp(13px, 1.5vw, 15px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(13px, 1.8vw, 14px);
  }
`;

export const PlayersSection = styled.div`
  margin-bottom: clamp(24px, 4vw, 32px);
  
  @media (max-width: 480px) {
    margin-bottom: clamp(20px, 3vw, 28px);
  }
`;

export const SectionTitle = styled.h2`
  font-size: clamp(18px, 1.8vw, 20px);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 3px;
    height: 20px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: clamp(17px, 2vw, 19px);
    gap: clamp(6px, 1vw, 8px);
    margin-bottom: clamp(12px, 1.5vw, 14px);
  }
  
  @media (max-width: 480px) {
    font-size: clamp(16px, 2.2vw, 18px);
    margin-bottom: 12px;
  }
`;

export const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 40vw, 280px), 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: clamp(14px, 1.2vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${({ $variant, theme }) => $variant === 'secondary' ? 'transparent' : theme.colors.primary};
  color: ${({ $variant, theme }) => $variant === 'secondary' ? theme.colors.primary : theme.colors.textOnSurface};
  border: ${({ $variant, theme }) => $variant === 'secondary' ? `2px solid ${theme.colors.primary}` : 'none'};
  position: relative;
  overflow: hidden;
  min-height: 44px;
  min-width: 120px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: ${({ $variant, theme }) => $variant === 'secondary' ? `${theme.colors.primary}10` : theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}40`};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      background: ${({ $variant, theme }) => $variant === 'secondary' ? 'transparent' : theme.colors.primary};
      transform: none;
      box-shadow: none;
    }
  }
  
  @media (max-width: 768px) {
    padding: clamp(10px, 1.5vw, 12px) clamp(20px, 3vw, 24px);
    font-size: clamp(13px, 1.5vw, 14px);
    min-height: 42px;
  }
  
  @media (max-width: 480px) {
    padding: clamp(10px, 1.8vw, 14px) clamp(20px, 3.5vw, 28px);
    font-size: clamp(13px, 1.8vw, 15px);
    min-height: 40px;
    border-radius: 6px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 16px);
  justify-content: center;
  margin-top: clamp(32px, 5vw, 40px);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: clamp(10px, 1.5vw, 14px);
    margin-top: clamp(28px, 4vw, 36px);
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: clamp(8px, 1.2vw, 12px);
    margin-top: clamp(24px, 3.5vw, 32px);
  }
`;