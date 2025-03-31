import React from 'react';
import { FileText } from 'lucide-react';

interface TranscriptLinkProps {
  url: string;
  politician: 'carney' | 'poilievre';
}

const TranscriptLink: React.FC<TranscriptLinkProps> = ({ url, politician }) => {
  const linkClasses = politician === 'carney' ? 'carney-link text-carney hover:text-rose' : 'poilievre-link text-poilievre hover:text-gray-600';
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 ${linkClasses} font-medium hover:opacity-90 transition-opacity`}
    >
      <FileText size={16} className="inline-block" />
      <span>Read Transcript</span>
    </a>
  );
};

export default TranscriptLink;
