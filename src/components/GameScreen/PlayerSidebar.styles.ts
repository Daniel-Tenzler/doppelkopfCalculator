import styled from 'styled-components';
import { LAYOUT, COMPONENT_SIZES } from './constants';

export const SidebarContainer = styled.div`
  width: ${COMPONENT_SIZES.SIDEBAR_WIDTH};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${LAYOUT.BORDER_RADIUS_LARGE};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadowLight};
  padding: ${LAYOUT.CARD_PADDING};
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  
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

export const SidebarHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

export const SidebarTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.4px;
`;

export const PlayerList = styled.div`
  flex: 1;
  margin-bottom: 32px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.4;
`;

export const EmptyStateText = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  line-height: 1.5;
`;

export const ActionSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 28px;
`;

export const ResetButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${LAYOUT.BORDER_RADIUS};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: ${({ theme }) => theme.colors.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${LAYOUT.BORDER_RADIUS};
`;

export const ThemeToggleLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export const ThemeToggle = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 56px;
  height: 32px;
  background: ${({ $isDark, theme }) => 
    $isDark ? theme.colors.primary : theme.colors.border};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: ${({ $isDark }) => $isDark ? '28px' : '4px'};
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 40px;
  border-radius: ${LAYOUT.BORDER_RADIUS_LARGE};
  max-width: 480px;
  width: 90%;
  box-shadow: ${({ theme }) => theme.shadowHeavy};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalTitle = styled.h3`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

export const ModalText = styled.p`
  margin: 0 0 32px 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

export const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: 1px solid ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.error : theme.colors.border};
  background: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.error : 'transparent'};
  color: ${({ theme, $variant }) => 
    $variant === 'primary' ? 'white' : theme.colors.text};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    ${({ theme, $variant }) => 
      $variant === 'primary' 
        ? `
          background: ${theme.colors.error};
          opacity: 0.9;
        `
        : `
          background: ${theme.colors.borderLight};
          border-color: ${theme.colors.borderDark};
        `
    }
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;