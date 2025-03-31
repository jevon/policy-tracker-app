import React from 'react';

export interface PromiseData {
  id: string;
  description: string;
  quote?: string;
  category?: string;
  confidence_level?: 'High' | 'Medium' | 'Low';
  transcript_id?: string;
  transcript_title?: string;
  transcript_date?: string;
  transcript_url: string;
  timestamp?: string;
  timestamp_seconds?: number;
  timestamp_url?: string;
  videoUrl?: string;
}

interface PromiseCardProps {
  promise: PromiseData;
  politician: 'carney' | 'poilievre';
  onClick?: () => void;
  isModal?: boolean;
}

const PromiseCard: React.FC<PromiseCardProps> = ({ promise, politician, onClick, isModal = false }) => {
  const cardClass = politician === 'carney' 
    ? 'bg-white border-l-4 border-carney hover:bg-rose/5' 
    : 'bg-white border-l-4 border-poilievre hover:bg-blue-50/50';
  
  return (
    <div 
      className={`${cardClass} rounded-lg p-5 mb-4 relative overflow-hidden transition-colors duration-200
                 ${onClick ? 'cursor-pointer' : ''}
                 ${isModal ? 'mb-0' : ''}`}
      onClick={onClick}
    >
      {promise.category && (
        <div className={`text-xs font-semibold mb-2 inline-block px-2 py-0.5 rounded-full
                        ${politician === 'carney' ? 'bg-rose/10 text-rose' : 'bg-blue-100 text-blue-700'}`}>
          {promise.category}
        </div>
      )}
      
      <h3 className="text-gray-900 text-xl font-oswald tracking-wide leading-tight mb-3">
        {promise.description}
      </h3>
      
      {promise.quote && (
        <div className="text-gray-600 text-sm italic mb-4 border-l-2 pl-3 py-1 border-gray-200">
          "{promise.quote}"
        </div>
      )}
      
      {promise.transcript_date && (
        <div className="text-gray-500 text-xs mb-3">Promised on {promise.transcript_date}</div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 text-sm mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <a 
            href={promise.timestamp_url || promise.transcript_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-sm flex items-center gap-1 ${politician === 'carney' ? 'text-rose hover:text-rose/80' : 'text-blue-700 hover:text-blue-900'} transition-colors`}
            onClick={(e) => e.stopPropagation()}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="16" 
              height="16" 
              fill="currentColor"
              className="flex-shrink-0"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            {promise.transcript_title}
            {promise.timestamp && (
              <span className="text-gray-500 ml-1">({promise.timestamp})</span>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromiseCard;
