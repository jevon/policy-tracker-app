import React from 'react';
import PromiseCard, { PromiseData } from './PromiseCard';

interface PoliticianColumnProps {
  promises: PromiseData[];
  politician: 'carney' | 'poilievre';
  backgroundImage: string;
  category?: string | null;
  date: string;
  onPromiseClick?: (promise: PromiseData) => void;
}

const PoliticianColumn: React.FC<PoliticianColumnProps> = ({ 
  promises, 
  politician,
  backgroundImage,
  category,
  date,
  onPromiseClick
}) => {
  // Filter promises by category if one is selected
  const filteredPromises = category 
    ? promises.filter(promise => promise.category === category) 
    : promises;
  
  const columnClass = politician === 'carney' 
    ? 'bg-rose/5' 
    : 'bg-blue-50/50';
  
  return (
    <div className={`w-full h-full relative animate-fade-in ${columnClass}`} 
         style={{ 
           animationDelay: politician === 'poilievre' ? '0.2s' : '0.4s'
         }}>
      <div className="pt-4 md:pt-6 relative z-10 h-full flex flex-col">
        {/* Date delimiter */}
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="h-[1px] flex-grow bg-gray-200"></div>
          <div className="text-gray-500 text-sm font-medium whitespace-nowrap">
            {date === 'Unknown Date' ? date : new Date(date + 'T00:00:00').toLocaleDateString('en-CA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="h-[1px] flex-grow bg-gray-200"></div>
        </div>

        <div className="space-y-4 relative z-10">
          {filteredPromises.map((promise, index) => (
            <div 
              key={promise.id} 
              style={{ animationDelay: `${0.1 * (index + 1)}s` }} 
              className="animate-scale-in px-4"
            >
              <PromiseCard 
                promise={promise} 
                politician={politician}
                onClick={() => onPromiseClick?.(promise)}
              />
            </div>
          ))}

          {filteredPromises.length === 0 && (
            <div className="px-4">
              <div className="text-gray-500 text-center py-8 border border-gray-200 rounded-lg bg-white flex flex-col items-center justify-center">
                <div className="mb-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm">
                  {category 
                    ? `No promises found in the ${category} category`
                    : "No promises or commitments detected on this day"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliticianColumn;
