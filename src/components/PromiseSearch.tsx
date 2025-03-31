import React from 'react';

interface PromiseSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
}

const PromiseSearch: React.FC<PromiseSearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search promises..."
          className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose/30 transition-all"
        />
      </div>
    </div>
  );
};

export default PromiseSearch;
