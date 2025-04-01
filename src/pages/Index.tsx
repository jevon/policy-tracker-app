import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import PoliticianColumn from '@/components/PoliticianColumn';
import PromiseSearch from '@/components/PromiseSearch';
import PromiseCard, { PromiseData } from '@/components/PromiseCard';
import carneyPromisesData from '@/data/carneyPromises.json';
import poilievrePromisesData from '@/data/poilievrePromises.json';
import { useSwipe } from '@/hooks/useSwipe';
import SwipeIndicator from '@/components/SwipeIndicator';
import TopicComparison from '@/components/TopicComparison';
import CategoryDetailView from '@/components/CategoryDetailView';
import Modal from '@/components/Modal';

// --- Interfaces for AI Comparison Data (Reverted) ---
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

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePolitician, setActivePolitician] = useState<'carney' | 'poilievre'>('carney');
  const [selectedPromise, setSelectedPromise] = useState<{ promise: PromiseData; politician: 'carney' | 'poilievre' } | null>(null);
  
  // State for AI comparison data
  const [comparisonData, setComparisonData] = useState<ComparisonOutput | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState<boolean>(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  
  // Memoize promise data processing
  const carneyPromises: PromiseData[] = useMemo(() => carneyPromisesData.map((promise) => ({
    ...promise,
    id: promise.id || `carney-${promise.transcript_id || Date.now()}`,
    confidence_level: (promise.confidence_level || 'Medium') as 'High' | 'Medium' | 'Low',
    category: promise.category || 'Uncategorized',
    description: promise.description || '',
    quote: promise.quote || '',
    transcript_date: promise.transcript_date || 'Unknown Date',
    transcript_title: promise.transcript_title || 'Unknown Title',
    transcript_url: promise.transcript_url || `https://www.youtube.com/watch?v=${promise.transcript_id || ''}`
  })), []); // Dependency array is empty as source data doesn't change
  
  const poilievrePromises: PromiseData[] = useMemo(() => poilievrePromisesData.map((promise) => ({
    ...promise,
    id: promise.id || `poilievre-${promise.transcript_id || Date.now()}`,
    confidence_level: (promise.confidence_level || 'Medium') as 'High' | 'Medium' | 'Low',
    category: promise.category || 'Uncategorized',
    description: promise.description || '',
    quote: promise.quote || '',
    transcript_date: promise.transcript_date || 'Unknown Date',
    transcript_title: promise.transcript_title || 'Unknown Title',
    transcript_url: promise.transcript_url || `https://www.youtube.com/watch?v=${promise.transcript_id || ''}`
  })), []); // Dependency array is empty as source data doesn't change
  
  const allCategories = Array.from(new Set([
    ...carneyPromises.map(promise => promise.category),
    ...poilievrePromises.map(promise => promise.category)
  ].filter(Boolean) as string[]));
  
  // Filter promises based *only* on search term (for the main list view)
  const filterBySearchTerm = (promises: PromiseData[]): PromiseData[] => {
    return promises.filter(promise => {
      const matchesSearch = 
        !searchTerm ||
        promise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (promise.quote && promise.quote.toLowerCase().includes(searchTerm.toLowerCase()));
        // Removed category matching here, as it's handled separately
      return matchesSearch;
    });
  };
  const filteredCarneyPromisesBySearch = filterBySearchTerm(carneyPromises);
  const filteredPoilievrePromisesBySearch = filterBySearchTerm(poilievrePromises);

  // Derive promises filtered by the *selected category*
  const filteredCarneyPromisesForCategory = useMemo(() => {
      if (!selectedCategory) return [];
      return carneyPromises.filter(p => p.category === selectedCategory);
  }, [selectedCategory, carneyPromises]);

  const filteredPoilievrePromisesForCategory = useMemo(() => {
      if (!selectedCategory) return [];
      return poilievrePromises.filter(p => p.category === selectedCategory);
  }, [selectedCategory, poilievrePromises]);

  // Group promises by date (using search-filtered lists for the main view)
  const groupPromisesByDate = (promises: PromiseData[]): Record<string, PromiseData[]> => {
    return promises.reduce((acc, promise) => {
      const date = promise.transcript_date || 'Unknown Date';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(promise);
      return acc;
    }, {} as Record<string, PromiseData[]>);
  };

  const carneyGroupedPromises = groupPromisesByDate(filteredCarneyPromisesBySearch);
  const poilievreGroupedPromises = groupPromisesByDate(filteredPoilievrePromisesBySearch);

  // Get all unique dates (based on search-filtered lists)
  const allDates = Array.from(new Set([
    ...Object.keys(carneyGroupedPromises),
    ...Object.keys(poilievreGroupedPromises)
  ])).sort((a, b) => {
    if (a === 'Unknown Date') return 1;
    if (b === 'Unknown Date') return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Handle politician switching with swipes in a memoized callback
  const handleSwipeLeft = () => {
    // Swipe left means switch to Poilievre
    setActivePolitician('poilievre');
  };
  
  const handleSwipeRight = () => {
    // Swipe right means switch to Carney
    setActivePolitician('carney');
  };
  
  // Initialize swipe detection
  const { isSwiping, swipeDirection } = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    minSwipeDistance: 50,
  });

  // --- Category Selection Handler with URL Update ---
  const handleCategorySelect = (category: string | null) => {
    const currentCategory = selectedCategory; // Store current before update
    setSelectedCategory(category);

    // Update URL
    const url = new URL(window.location.href);
    const categorySlug = category ? category.toLowerCase().replace(/\s+/g, '-') : null;

    if (categorySlug) {
        // Only push state if the category actually changed to avoid duplicate history entries
        if (category !== currentCategory) {
            url.searchParams.set('category', categorySlug);
            window.history.pushState({ category: categorySlug }, '', url.toString());
        }
    } else {
        // If deselecting, remove the parameter and go back to base path
        url.searchParams.delete('category');
        window.history.pushState({}, '', url.pathname); // Use pathname to clear query string
    }
  };
  // --- End Category Selection Handler ---

  // Handle initial mount effect - includes reading category from URL
  useEffect(() => {
    console.log("Initial Mount Effect: Running");
    
    // Check for category in URL *before* mounting
    const params = new URLSearchParams(window.location.search);
    const categorySlugFromUrl = params.get('category');
    let initialCategory: string | null = null;

    if (categorySlugFromUrl) {
        console.log(`Initial Mount Effect: Found category slug in URL: ${categorySlugFromUrl}`);
        // Find the full category name matching the slug
        initialCategory = allCategories.find(cat => cat.toLowerCase().replace(/\s+/g, '-') === categorySlugFromUrl) || null;
        if (initialCategory) {
            console.log(`Initial Mount Effect: Setting initial category state to: ${initialCategory}`);
            setSelectedCategory(initialCategory); // Set state *before* mount
        } else {
            console.warn(`Initial Mount Effect: Category slug "${categorySlugFromUrl}" found in URL but does not match known categories.`);
            // Optionally clear the invalid URL param
            const url = new URL(window.location.href);
            url.searchParams.delete('category');
            window.history.replaceState({}, '', url.pathname);
        }
    }

    setMounted(true); // Now mount the component

    // Note: If both promise and category are in URL, category takes precedence for view, 
    // but promise modal might still open if ID matches.
    const promiseId = sessionStorage.getItem('selectedPromiseId');
    console.log(`Initial Mount Effect: checking for promise ID in sessionStorage: ${promiseId}`);

    if (promiseId) {
      // Find the promise in either politician's promises
      const carneyPromise = carneyPromises.find(p => p.id === promiseId);
      const poilievrePromise = poilievrePromises.find(p => p.id === promiseId);

      if (carneyPromise) {
        console.log("Initial Mount Effect: Found Carney promise, setting state.");
        setSelectedPromise({ promise: carneyPromise, politician: 'carney' });
      } else if (poilievrePromise) {
        console.log("Initial Mount Effect: Found Poilievre promise, setting state.");
        setSelectedPromise({ promise: poilievrePromise, politician: 'poilievre' });
      } else {
        console.log("Initial Mount Effect: Invalid promise ID in storage.");
      }
      
      // Clear the storage after processing
      sessionStorage.removeItem('selectedPromiseId');
    }

    // Preload textures
    console.log("Initial Mount Effect: Preloading textures.");
    const blueTexture = new Image();
    const redTexture = new Image();
    const basePath = import.meta.env.BASE_URL;
    blueTexture.src = `${basePath}uploads/bg-blue-texture.png`;
    redTexture.src = `${basePath}uploads/bg-red-texture.png`;

    // Add popstate listener to handle back/forward navigation for category
    const handlePopState = (event: PopStateEvent) => {
        const stateCategorySlug = event.state?.category;
        const categoryFromSlug = allCategories.find(cat => cat.toLowerCase().replace(/\s+/g, '-') === stateCategorySlug) || null;
        console.log(`Popstate event: Setting category to ${categoryFromSlug} (from slug: ${stateCategorySlug})`);
        setSelectedCategory(categoryFromSlug); // Update state based on history state
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };

    // Dependencies: allCategories is needed to map slug back to name
  }, [allCategories, carneyPromises, poilievrePromises]); 

  // --- Fetch AI Comparison Data --- 
  useEffect(() => {
    if (selectedCategory) {
      const fetchComparisonData = async () => {
        setIsComparisonLoading(true);
        setComparisonError(null);
        setComparisonData(null); // Clear previous data

        const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
        const url = `/data/comparisons/${categorySlug}.json`;
        
        console.log(`Fetching comparison data for ${selectedCategory} from ${url}`);

        try {
          const response = await fetch(url);
          if (!response.ok) {
            // If file not found (404), it likely means no comparison was generated (e.g., no promises in category)
            // Treat this as a non-error case, but with no data.
            if (response.status === 404) {
                console.log(`Comparison file not found for ${selectedCategory} (slug: ${categorySlug}). No comparison data available.`);
                setComparisonData(null);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
            const data: ComparisonOutput = await response.json();
            setComparisonData(data);
            console.log(`Successfully fetched comparison data for ${selectedCategory}`);
          }
        } catch (error) {
          console.error("Error fetching comparison data:", error);
          setComparisonError(`Failed to load comparison data for ${selectedCategory}.`);
          setComparisonData(null);
        } finally {
          setIsComparisonLoading(false);
        }
      };

      fetchComparisonData();
    } else {
      // Clear data if no category is selected
      setComparisonData(null);
      setIsComparisonLoading(false);
      setComparisonError(null);
    }
  }, [selectedCategory]);
  // --- End Fetch AI Comparison Data ---

  if (!mounted) {
    return <div className="min-h-screen bg-beige"></div>;
  }

  return (
    <div className="min-h-screen bg-beige text-gray-800 pb-20">
      <Header activePolitician={activePolitician} onPoliticianChange={setActivePolitician} />
      <SwipeIndicator 
        activePolitician={activePolitician}
        isSwiping={isSwiping}
        swipeDirection={swipeDirection}
      />
      <div className="container mx-auto px-4 mt-6">
        <div className="mb-6 text-center">
          <div className="inline-block px-3 py-1 bg-rose/20 backdrop-blur-sm rounded-full text-gray-800 text-sm font-medium mb-4 animate-fade-in">
            2025 FEDERAL ELECTION REALTIME PLATFORMS
          </div>
          <h2 className="text-3xl md:text-4xl font-title tracking-wide mb-4 animate-fade-in">
            CAMPAIGN PLATFORM TRACKER
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Comprehensive analysis of policy commitments by Mark Carney and Pierre Poilievre. 
            Each entry includes official statements, source documentation, and reference links.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a 
              href="/how-it-works" 
              className="inline-block text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200 animate-fade-in"
              style={{ animationDelay: '0.8s' }}
            >
              How does this work? →
            </a>
            <a 
              href="/why-important" 
              className="inline-block text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200 animate-fade-in"
              style={{ animationDelay: '0.9s' }}
            >
              Why is this important? →
            </a>
          </div>
        </div>
        
        <TopicComparison 
          carneyPromises={carneyPromises}
          poilievrePromises={poilievrePromises}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        {/* --- Conditional Rendering for Category Detail --- */} 
        {selectedCategory && (
            <CategoryDetailView 
                comparisonData={comparisonData}
                isLoading={isComparisonLoading}
                error={comparisonError}
                filteredCarneyPromises={filteredCarneyPromisesForCategory}
                filteredPoilievrePromises={filteredPoilievrePromisesForCategory}
                allCarneyPromises={carneyPromises}
                allPoilievrePromises={poilievrePromises}
                onCitationClick={setSelectedPromise}
            />
        )}
        {/* --- End Conditional Rendering --- */} 

        {/* Render the full promise lists (potentially grouped by date) when NO category is selected */} 
        {!selectedCategory && (
            <div className="flex flex-col lg:flex-row gap-8 mt-8"> { /* Added margin top */}
                <div className={`w-full lg:w-1/2 transition-all duration-300 ${activePolitician === 'carney' ? 'block' : 'hidden lg:block'}`}>
                    {allDates.map(date => (
                        <div key={`carney-${date}`} className="mb-4 last:mb-0">
                        <PoliticianColumn 
                            promises={carneyGroupedPromises[date] || []}
                            politician="carney"
                            backgroundImage={`${import.meta.env.BASE_URL}uploads/bg-red-texture.png`}
                            date={date}
                            onPromiseClick={(promise) => setSelectedPromise({ promise, politician: 'carney' })}
                        />
                        </div>
                    ))}
                </div>
                
                <div className={`w-full lg:w-1/2 transition-all duration-300 ${activePolitician === 'poilievre' ? 'block' : 'hidden lg:block'}`}>
                     {allDates.map(date => (
                        <div key={`poilievre-${date}`} className="mb-4 last:mb-0">
                        <PoliticianColumn 
                            promises={poilievreGroupedPromises[date] || []}
                            politician="poilievre"
                            backgroundImage={`${import.meta.env.BASE_URL}uploads/bg-blue-texture.png`}
                            date={date}
                            onPromiseClick={(promise) => setSelectedPromise({ promise, politician: 'poilievre' })}
                        />
                        </div>
                    ))}
                </div>
            </div>
        )}
        {/* --- End Full Promise List Rendering --- */} 
        
      </div>
      
      <footer className="mt-24 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-gray-600 text-center">
          <p className="text-sm">Policy Explorer - Tracking Political Promises in the 2025 Canadian Election</p>
          <p className="mt-2 text-sm">This site is for informational purposes only and does not endorse any politician.</p>
          
          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-gray-700 text-sm font-medium mb-3">Brought to you by:</p>
            <a 
              href="https://buildcanada.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-90"
            >
              <img 
                src={`${import.meta.env.BASE_URL}uploads/build-canada-logo.png`} 
                alt="Build Canada" 
                className="h-16 md:h-20 shadow-md transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>
        </div>
      </footer>

      <Modal 
        isOpen={!!selectedPromise}
        onClose={() => {
          setSelectedPromise(null);
          // Clear any stored promise ID and maintain the base path
          sessionStorage.removeItem('promiseShareUrl');
          // Use the base path from environment
          const basePath = import.meta.env.BASE_URL;
          window.history.replaceState(null, null, basePath);
        }}
      >
        {selectedPromise && (
          <div className="flex flex-col">
            <PromiseCard 
              promise={selectedPromise.promise}
              politician={selectedPromise.politician}
              isModal={true}
            />
            <div className="mt-4 flex justify-center">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-rose/20 hover:bg-rose/30 rounded-md text-sm text-gray-800 transition-colors"
                onClick={() => {
                  const shareUrl = sessionStorage.getItem('promiseShareUrl');
                  if (shareUrl) {
                    navigator.clipboard.writeText(shareUrl)
                      .then(() => {
                        // You could add a toast notification here
                        alert('Link copied to clipboard!');
                      })
                      .catch(err => {
                        console.error('Failed to copy: ', err);
                      });
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Share Link
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Index;
