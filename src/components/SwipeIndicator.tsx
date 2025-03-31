import React, { useState, useEffect } from 'react';

interface SwipeIndicatorProps {
  activePolitician: 'carney' | 'poilievre';
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | null;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ 
  activePolitician, 
  isSwiping, 
  swipeDirection 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isSwiping) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isSwiping]);

  if (!visible) return null;

  // Determine which politician we're swiping toward
  const swipingToward = swipeDirection === 'left' ? 'poilievre' : 'carney';
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center lg:hidden">
      <div 
        className={`flex items-center justify-center gap-8 px-10 py-6 rounded-full bg-black/90 backdrop-blur-lg shadow-lg transition-all duration-300
                  ${swipeDirection === 'left' ? 'translate-x-10' : '-translate-x-10'}`}
      >
        <div className={`flex flex-col items-center justify-center`}>
          <div className={`text-2xl font-oswald ${swipingToward === 'carney' ? 'text-carney' : 'text-white/30'}`}>
            CARNEY
          </div>
          {swipingToward === 'carney' && (
            <div className="text-carney mt-1">▲</div>
          )}
        </div>
        
        <div className="h-12 w-0.5 bg-white/20 rotate-12"></div>
        
        <div className={`flex flex-col items-center justify-center`}>
          <div className={`text-2xl font-oswald ${swipingToward === 'poilievre' ? 'text-poilievre' : 'text-white/30'}`}>
            POILIEVRE
          </div>
          {swipingToward === 'poilievre' && (
            <div className="text-poilievre mt-1">▲</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeIndicator; 