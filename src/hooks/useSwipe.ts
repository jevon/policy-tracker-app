import { useEffect, useState, useCallback } from 'react';

interface SwipeProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
}

interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
  touchStart: number | null;
  touchEnd: number | null;
}

export const useSwipe = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  minSwipeDistance = 50 
}: SwipeProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    touchStart: null,
    touchEnd: null
  });
  
  // Memoize the handlers to prevent unnecessary re-renders
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setSwipeState(prev => ({
      ...prev,
      touchEnd: null,
      touchStart: e.targetTouches[0].clientX,
      isSwiping: true
    }));
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    setSwipeState(prev => {
      if (!prev.touchStart) return prev;
      
      const currentX = e.targetTouches[0].clientX;
      const diff = prev.touchStart - currentX;
      
      return {
        ...prev,
        touchEnd: currentX,
        direction: diff > 0 ? 'left' : 'right',
        isSwiping: true
      };
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setSwipeState(prev => {
      if (!prev.touchStart || !prev.touchEnd) {
        return { ...prev, isSwiping: false };
      }
      
      const distance = prev.touchStart - prev.touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }
      
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
      
      return { ...prev, isSwiping: false };
    });
    
    // Clear direction after animation time
    setTimeout(() => {
      setSwipeState(prev => ({
        ...prev,
        direction: null,
        touchStart: null,
        touchEnd: null
      }));
    }, 300);
  }, [minSwipeDistance, onSwipeLeft, onSwipeRight]);
  
  const handleTouchCancel = useCallback(() => {
    setSwipeState({
      isSwiping: false,
      direction: null,
      touchStart: null,
      touchEnd: null
    });
  }, []);

  useEffect(() => {
    // Using document instead of a specific element for better coverage
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);
  
  return {
    isSwiping: swipeState.isSwiping,
    swipeDirection: swipeState.direction
  };
}; 