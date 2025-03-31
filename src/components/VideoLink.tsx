import React from 'react';
import { Video } from 'lucide-react';

interface VideoLinkProps {
  url: string;
  timestamp?: string;
  politician: 'carney' | 'poilievre';
}

const VideoLink: React.FC<VideoLinkProps> = ({ url, timestamp, politician }) => {
  const linkClasses = politician === 'carney' ? 'carney-link text-carney hover:text-rose' : 'poilievre-link text-poilievre hover:text-gray-600';
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 ${linkClasses} font-medium hover:opacity-90 transition-opacity`}
    >
      <Video size={16} className="inline-block" />
      <span>
        Watch Video{timestamp ? ` (${timestamp})` : ''}
      </span>
    </a>
  );
};

export default VideoLink;
