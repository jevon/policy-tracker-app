import React, { useState, useMemo } from 'react';
import { PromiseData } from './PromiseCard';
import PieChart from './PieChart';

interface TopicComparisonProps {
  carneyPromises: PromiseData[];
  poilievrePromises: PromiseData[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

interface CategoryData {
  category: string;
  carneyPercentage: number;
  poilievrePercentage: number;
  relativeConcentration: number; // Positive means Carney has higher concentration, negative means Poilievre
}

const TopicComparison: React.FC<TopicComparisonProps> = ({ 
  carneyPromises, 
  poilievrePromises,
  selectedCategory,
  setSelectedCategory
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryData = useMemo(() => {
    // Count promises by category
    const carneyCategories: Record<string, number> = {};
    const poilievreCategories: Record<string, number> = {};
    
    // Count Carney promises by category
    carneyPromises.forEach(promise => {
      const category = promise.category || 'Uncategorized';
      carneyCategories[category] = (carneyCategories[category] || 0) + 1;
    });
    
    // Count Poilievre promises by category
    poilievrePromises.forEach(promise => {
      const category = promise.category || 'Uncategorized';
      poilievreCategories[category] = (poilievreCategories[category] || 0) + 1;
    });
    
    // Calculate total promises
    const carneyTotal = carneyPromises.length;
    const poilievreTotal = poilievrePromises.length;
    
    // Get all unique categories
    const allCategories = new Set([
      ...Object.keys(carneyCategories),
      ...Object.keys(poilievreCategories)
    ]);
    
    // Filter out "Other" category
    const filteredCategories = Array.from(allCategories).filter(cat => 
      cat !== 'Other' && cat !== 'Uncategorized'
    );
    
    // Calculate percentages and relative concentration
    const result: CategoryData[] = filteredCategories.map(category => {
      const carneyCount = carneyCategories[category] || 0;
      const poilievreCount = poilievreCategories[category] || 0;
      
      const carneyPercentage = Math.round((carneyCount / carneyTotal) * 100);
      const poilievrePercentage = Math.round((poilievreCount / poilievreTotal) * 100);
      
      // Calculate relative concentration (how much more/less one has than the other)
      let relativeConcentration = 0;
      if (carneyPercentage > 0 && poilievrePercentage > 0) {
        const ratio = carneyPercentage / poilievrePercentage;
        relativeConcentration = Math.round((ratio - 1) * 100);
      } else if (carneyPercentage > 0) {
        relativeConcentration = 100; // Carney has some, Poilievre has none
      } else if (poilievrePercentage > 0) {
        relativeConcentration = -100; // Poilievre has some, Carney has none
      }
      
      return {
        category,
        carneyPercentage,
        poilievrePercentage,
        relativeConcentration
      };
    });
    
    // Sort by absolute value of relative concentration (highest difference first)
    return result.sort((a, b) => 
      Math.abs(b.relativeConcentration) - Math.abs(a.relativeConcentration)
    ).slice(0, 5); // Take top 5 categories with biggest differences
  }, [carneyPromises, poilievrePromises]);
  
  if (categoryData.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full mb-8 bg-beige rounded-lg p-4">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-white/50 lg:hidden"
        >
          {isExpanded ? 'Hide' : 'Show'} 
          <span className="ml-1">{isExpanded ? '▲' : '▼'}</span>
        </button>
      </div>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="lg:min-w-0">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-6 px-4 py-2 bg-white/50 rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[rgb(220,38,38)]"></div>
                <span className="text-gray-700 text-xs">Carney</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[rgb(37,99,235)]"></div>
                <span className="text-gray-700 text-xs">Poilievre</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryData.map(data => (
              <button 
                key={data.category} 
                onClick={() => setSelectedCategory(selectedCategory === data.category ? null : data.category)}
                className={`flex flex-col items-center rounded-lg p-3 transition-all
                  ${selectedCategory === data.category 
                    ? 'bg-white border border-rose/20' 
                    : 'bg-white/50 border border-transparent hover:border-gray-300'}`}
              >
                <div className="text-gray-800 font-medium text-sm mb-3 truncate max-w-full">{data.category}</div>
                
                <div className="relative">
                  <PieChart 
                    carneyPercentage={data.carneyPercentage}
                    poilievrePercentage={data.poilievrePercentage}
                    size={70}
                    showLabel={false}
                  />
                  
                  <div className="absolute bottom-0 right-0 bg-white rounded-full px-2 py-1 text-xs shadow-sm">
                    <span className={`font-semibold ${
                      data.carneyPercentage > data.poilievrePercentage 
                        ? 'text-[rgb(220,38,38)]' 
                        : 'text-[rgb(37,99,235)]'
                    }`}>
                      {Math.abs(data.relativeConcentration)}%
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Additional category selectors */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Economy', 'Other', 'Defense', 'Housing', 'Environment', 'Healthcare', 'Education', 'Immigration']
              .filter(category => !categoryData.some(data => data.category === category))
              .map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`px-3 py-1 rounded-full text-sm transition-all
                    ${selectedCategory === category 
                      ? 'bg-white border border-rose/20 text-gray-800' 
                      : 'bg-white/50 border border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800'}`}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicComparison; 