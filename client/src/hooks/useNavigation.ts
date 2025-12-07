import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { App } from '@capacitor/app';

interface UseNavigationOptions {
  enableSwipeBack?: boolean;
  enableHardwareBack?: boolean;
  swipeThreshold?: number;
  swipeDirection?: 'left' | 'right' | 'both';
}

// بسيط: مكدس داخلي للمسارات في الذاكرة
const routeStack: string[] = [];

export const useNavigation = (options: UseNavigationOptions = {}) => {
  const [location, setLocation] = useLocation();
  const lastPushed = useRef<string | null>(null);
  const {
    enableSwipeBack = true,
    enableHardwareBack = true,
    swipeThreshold = 50,
    swipeDirection = 'right'
  } = options;

  // إدارة المكدس عند تغيّر المسار
  useEffect(() => {
    if (location && location !== lastPushed.current) {
      // لا تكرر نفس المسار
      if (routeStack.length === 0 || routeStack[routeStack.length - 1] !== location) {
        routeStack.push(location);
        lastPushed.current = location;
      }
    }
  }, [location]);

  // Handle hardware back button
  useEffect(() => {
    if (!enableHardwareBack) return;

    const handleBackButton = () => {
      console.log('Back button pressed, location:', location);
      
      // If on home page, allow app exit
      if (location === '/' || location === '') {
        console.log('On home page, exiting app');
        App.exitApp();
        return;
      }
      
      // Otherwise, navigate to home
      console.log('Navigating to home');
      setLocation('/');
    };

    // Handle browser back button (popstate event)
    const handlePopState = (event: PopStateEvent) => {
      console.log('Popstate event triggered, location:', location);
      event.preventDefault();
      
      // If on home page, allow app exit
      if (location === '/' || location === '') {
        console.log('On home page, exiting app');
        App.exitApp();
        return;
      }
      
      // Otherwise, navigate to home
      console.log('Navigating to home');
      setLocation('/');
    };

    // Register both listeners
    let listener: any = null;
    
    try {
      if (App && typeof App.addListener === 'function') {
        App.addListener('backButton', handleBackButton).then((l: any) => {
          listener = l;
        }).catch((error: any) => {
          console.warn('App.addListener error:', error);
        });
      }
    } catch (error) {
      console.warn('App.addListener not available:', error);
    }
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      try {
        if (listener && typeof listener.remove === 'function') {
          listener.remove(); // Only remove this specific listener
        }
      } catch (error) {
        console.warn('Error removing listener:', error);
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enableHardwareBack, location, setLocation]);

  // Handle swipe gestures
  useEffect(() => {
    if (!enableSwipeBack) return;

    let startX = 0;
    let startY = 0;
    let isSwipeStarted = false;
    let swipeIndicator: HTMLElement | null = null;

    const createSwipeIndicator = () => {
      if (swipeIndicator) return;
      
      swipeIndicator = document.createElement('div');
      swipeIndicator.className = 'swipe-back-indicator';
      document.body.appendChild(swipeIndicator);
    };

    const showSwipeIndicator = () => {
      if (!swipeIndicator) createSwipeIndicator();
      swipeIndicator?.classList.add('active');
    };

    const hideSwipeIndicator = () => {
      swipeIndicator?.classList.remove('active');
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isSwipeStarted = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (!isSwipeStarted) {
        // Check if it's a horizontal swipe from edge
        const isFromEdge = startX < 50 || startX > window.innerWidth - 50;
        
        if (isFromEdge && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          isSwipeStarted = true;
          showSwipeIndicator();
          
          // Add visual feedback
          document.body.style.transition = 'transform 0.1s ease-out';
          document.body.style.transform = `translateX(${deltaX * 0.2}px)`;
        }
      } else {
        // Update visual feedback
        document.body.style.transform = `translateX(${deltaX * 0.2}px)`;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwipeStarted) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Reset visual feedback
      document.body.style.transition = 'transform 0.3s ease-out';
      document.body.style.transform = 'translateX(0)';
      hideSwipeIndicator();

      // Check if swipe meets threshold
      if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Check swipe direction
        const isRightSwipe = deltaX > 0;
        const isLeftSwipe = deltaX < 0;

        if (
          (swipeDirection === 'right' && isRightSwipe) ||
          (swipeDirection === 'left' && isLeftSwipe) ||
          (swipeDirection === 'both' && (isRightSwipe || isLeftSwipe))
        ) {
          // Navigate back with animation
          document.body.style.transition = 'transform 0.3s ease-out';
          document.body.style.transform = 'translateX(100%)';
          
          setTimeout(() => {
            // Pop من المكدس إن أمكن، وإلا للرئيسية
            if (routeStack.length > 1) {
              routeStack.pop();
              const prev = routeStack[routeStack.length - 1];
              setLocation(prev);
              lastPushed.current = prev;
            } else if (location !== '/') {
              setLocation('/');
              lastPushed.current = '/';
            }
            // Reset transform after navigation
            setTimeout(() => {
              document.body.style.transition = '';
              document.body.style.transform = '';
            }, 100);
          }, 150);
        }
      }

      isSwipeStarted = false;
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Reset any ongoing transforms
      document.body.style.transition = '';
      document.body.style.transform = '';
      
      // Clean up swipe indicator
      if (swipeIndicator) {
        swipeIndicator.remove();
        swipeIndicator = null;
      }
    };
  }, [enableSwipeBack, swipeThreshold, swipeDirection]);

  // Navigation helper functions
  const goBack = useCallback(() => {
    if (routeStack.length > 1) {
      routeStack.pop();
      const prev = routeStack[routeStack.length - 1];
      setLocation(prev);
      lastPushed.current = prev;
    } else if (location !== '/') {
      setLocation('/');
      lastPushed.current = '/';
    }
  }, [location, setLocation]);

  const goTo = useCallback((path: string) => {
    setLocation(path);
  }, [setLocation]);

  return {
    goBack,
    goTo
  };
};
