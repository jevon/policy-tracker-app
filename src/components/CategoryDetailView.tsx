import React from 'react';
import PromiseCard, { PromiseData } from './PromiseCard';
// Import Radix Tooltip components
import * as Tooltip from '@radix-ui/react-tooltip';

// --- Interfaces (Reverted - No UniquePoint/uniquePolicies) ---
interface ComparisonPoint {
    point: string;
    carney_stance: string;
    poilievre_stance: string;
    carney_citations: string[];
    poilievre_citations: string[];
}

interface ComparisonOutput {
    category: string;
    candidateA: {
        name: string;
        summary: string;
    };
    candidateB: {
        name: string;
        summary: string;
    };
    comparison: {
        differences: ComparisonPoint[];
        similarities: ComparisonPoint[];
    };
}
// --- End Interfaces ---

interface CategoryDetailViewProps {
    comparisonData: ComparisonOutput | null;
    isLoading: boolean;
    error: string | null;
    filteredCarneyPromises: PromiseData[];
    filteredPoilievrePromises: PromiseData[];
    allCarneyPromises: PromiseData[];
    allPoilievrePromises: PromiseData[];
    onCitationClick: (details: { promise: PromiseData; politician: 'carney' | 'poilievre' }) => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
    comparisonData,
    isLoading,
    error,
    filteredCarneyPromises,
    filteredPoilievrePromises,
    allCarneyPromises,
    allPoilievrePromises,
    onCitationClick
}) => {
    // Add state for similarities visibility
    const [showSimilarities, setShowSimilarities] = React.useState(false);

    // Helper to render citations as clickable buttons with tooltips
    const renderCitations = (ids: string[], politician: 'carney' | 'poilievre') => {
        if (!ids || ids.length === 0) return null;

        const sourceList = politician === 'carney' ? allCarneyPromises : allPoilievrePromises;

        return (
            <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                <span className="text-xxs text-gray-500 mr-1">Source(s):</span>
                <Tooltip.Provider delayDuration={100}>
                    {ids.map((id, index) => {
                        const promise = sourceList.find(p => p.id === id);
                        if (!promise) return null;

                        return (
                            <Tooltip.Root key={id}>
                                <Tooltip.Trigger asChild>
                                    <button 
                                        onClick={() => onCitationClick({ promise, politician })}
                                        className="text-xxs font-mono px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-300 transition-colors"
                                    >
                                        [{index + 1}]
                                    </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                     <Tooltip.Content 
                                        className="bg-gray-900 text-white text-xs rounded p-2 shadow-lg max-w-xs z-50 font-montserrat leading-relaxed"
                                        sideOffset={5}
                                        align="center"
                                     >
                                        {promise.description || promise.quote}
                                        <Tooltip.Arrow className="fill-gray-900" />
                                     </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        );
                    })}
                 </Tooltip.Provider>
            </div>
        );
    };

    // Function to render the two columns of promises
    const renderPromiseColumns = () => (
        // Added section title and divider
        <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Browse Promises in Detail</h3>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Carney Promises Column */}
                <div className="w-full lg:w-1/2">
                    <h4 className="text-lg font-oswald tracking-wider text-red-700 mb-4">MARK CARNEY</h4>
                    {filteredCarneyPromises.length > 0 ? (
                        <div className="space-y-4">
                            {filteredCarneyPromises.map(promise => (
                                <PromiseCard key={promise.id} promise={promise} politician="carney" />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-md">No specific promises found for Mark Carney in this category.</p>
                    )}
                </div>
                {/* Poilievre Promises Column */}
                <div className="w-full lg:w-1/2">
                    <h4 className="text-lg font-oswald tracking-wider text-blue-700 mb-4">PIERRE POILIEVRE</h4>
                     {filteredPoilievrePromises.length > 0 ? (
                        <div className="space-y-4">
                            {filteredPoilievrePromises.map(promise => (
                                <PromiseCard key={promise.id} promise={promise} politician="poilievre" />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-md">No specific promises found for Pierre Poilievre in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );

    // Loading State - Centered with modern styling
    if (isLoading) {
        return (
            <div className="mt-8 p-10 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center min-h-[200px]">
                {/* Optional: Add a spinner SVG here */}
                <p className="text-gray-500 animate-pulse mt-2">Loading AI comparison...</p>
            </div>
        );
    }

    // Error State - Clearer error message styling
    if (error) {
        return (
            <div className="mt-8 p-8 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm flex flex-col items-center text-center">
                 {/* Optional: Add an error icon SVG here */}
                <p className="font-semibold mb-1">Failed to Load Comparison</p>
                <p className="text-sm">Error: {error}</p>
            </div>
        );
    }

    // No Data State (Only renders promises, or a message if no promises either)
    if (!comparisonData) {
        if (filteredCarneyPromises.length > 0 || filteredPoilievrePromises.length > 0) {
             return (
                <div className="mt-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
                    <p className="text-center text-gray-600 mb-6 italic">AI comparison data is not available for this category.</p>
                    {renderPromiseColumns()}
                </div>
             );
        } else {
            return (
                 <div className="mt-8 p-8 bg-white rounded-lg shadow-md border border-gray-200 text-center">
                     <p className="text-gray-500">No promises or AI comparison data found for this category.</p>
                 </div>
            );
        }
    }

    // --- Main Render Logic (Data available) --- 

    return (
        <div className="mt-8 p-8 md:p-10 bg-white rounded-lg shadow-md border border-gray-200">
            {/* Main Title - Removed "AI COMPARISON: " prefix */}
            <h2 className="text-3xl md:text-4xl font-title tracking-wide mb-10 text-center text-gray-800">{comparisonData.category.toUpperCase()}</h2>

            {/* --- AI Analysis Section --- */}
            <div className="bg-gray-50/70 p-6 rounded-lg border border-gray-100 mb-10">
                 <h3 className="text-lg font-semibold mb-6 text-gray-600 text-center uppercase tracking-wider">Policy Summaries</h3>
                 {/* Summaries Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-5 border border-red-200 rounded-lg bg-white shadow-sm">
                        <h4 className="text-lg font-oswald tracking-wider text-red-800 mb-3">MARK CARNEY</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparisonData.candidateA.summary}</p>
                    </div>
                    <div className="p-5 border border-blue-200 rounded-lg bg-white shadow-sm">
                        <h4 className="text-lg font-oswald tracking-wider text-blue-800 mb-3">PIERRE POILIEVRE</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{comparisonData.candidateB.summary}</p>
                    </div>
                </div>

                {/* Differences */} 
                <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-600 flex items-center gap-2">
                        <span className="text-orange-500 text-xl">≠</span> Key Differences
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-orange-200">
                            <thead>
                                <tr className="bg-orange-50">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Point</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-red-700">Carney</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">Poilievre</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-orange-200">
                                {comparisonData.comparison.differences.map((diff, index) => (
                                    <tr key={`diff-${index}`} className="hover:bg-orange-50/50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{diff.point}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            <p>{diff.carney_stance}</p>
                                            {renderCitations(diff.carney_citations, 'carney')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            <p>{diff.poilievre_stance}</p>
                                            {renderCitations(diff.poilievre_citations, 'poilievre')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Similarities */} 
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                            <span className="text-green-500 text-xl">≈</span> Key Similarities
                        </h4>
                        <button
                            onClick={() => setShowSimilarities(!showSimilarities)}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                        >
                            {showSimilarities ? 'Hide' : 'Show'} Similarities
                            <span className="ml-1">{showSimilarities ? '▲' : '▼'}</span>
                        </button>
                    </div>
                    {showSimilarities && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200">
                                <thead>
                                    <tr className="bg-green-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">Point</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-700">Carney</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">Poilievre</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {comparisonData.comparison.similarities.map((sim, index) => (
                                        <tr key={`sim-${index}`} className="hover:bg-green-50/50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{sim.point}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <p>{sim.carney_stance}</p>
                                                {renderCitations(sim.carney_citations, 'carney')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <p>{sim.poilievre_stance}</p>
                                                {renderCitations(sim.poilievre_citations, 'poilievre')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
            {/* --- End AI Analysis Section --- */}

            {/* --- Raw Promises Section --- */} 
            { renderPromiseColumns() }

        </div>
    );
};

export default CategoryDetailView; 