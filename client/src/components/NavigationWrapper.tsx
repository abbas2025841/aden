import React from 'react';
import { useNavigation } from '@/hooks/useNavigation';

interface NavigationWrapperProps {
  children: React.ReactNode;
  enableSwipeBack?: boolean;
  enableHardwareBack?: boolean;
  swipeDirection?: 'left' | 'right' | 'both';
}

export const NavigationWrapper: React.FC<NavigationWrapperProps> = ({
  children,
  enableSwipeBack = true,
  enableHardwareBack = true,
  swipeDirection = 'right'
}) => {
  useNavigation({
    enableSwipeBack,
    enableHardwareBack,
    swipeDirection
  });

  return <>{children}</>;
};

export default NavigationWrapper;
