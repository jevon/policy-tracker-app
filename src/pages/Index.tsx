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
import Modal from '@/components/Modal';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePolitician, setActivePolitician] = useState<'carney' | 'poilievre'>('carney');
  const [selectedPromise, setSelectedPromise] = useState<{ promise: PromiseData; politician: 'carney' | 'poilievre' } | null>(null);
  
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
  
  const filterPromises = (promises: PromiseData[]): PromiseData[] => {
    return promises.filter(promise => {
      const matchesSearch = 
        !searchTerm ||
        promise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (promise.quote && promise.quote.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (promise.category && promise.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  };
  
  const filteredCarneyPromises = filterPromises(carneyPromises);
  const filteredPoilievrePromises = filterPromises(poilievrePromises);

  // Group promises by date
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

  const carneyGroupedPromises = groupPromisesByDate(filteredCarneyPromises);
  const poilievreGroupedPromises = groupPromisesByDate(filteredPoilievrePromises);

  // Get all unique dates
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

  // Handle initial mount effect - now checks for URL directly via sessionStorage
  useEffect(() => {
    console.log("Initial Mount Effect: Running");
    setMounted(true);

    // Try to get promise ID from sessionStorage (set by direct URL if available)
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

  }, [carneyPromises, poilievrePromises]); // Depends on promise data to find promise

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
          <h2 className="text-3xl md:text-4xl font-bebas tracking-wide mb-4 animate-fade-in">
            CAMPAIGN PLATFORM TRACKER
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-montserrat animate-fade-in">
            Comprehensive analysis of policy commitments by Mark Carney and Pierre Poilievre. 
            Each entry includes official statements, source documentation, and reference links.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a 
              href="/how-it-works" 
              className="inline-block text-gray-500 hover:text-gray-700 text-sm font-montserrat transition-colors duration-200 animate-fade-in"
              style={{ animationDelay: '0.8s' }}
            >
              How does this work? →
            </a>
            <a 
              href="/why-important" 
              className="inline-block text-gray-500 hover:text-gray-700 text-sm font-montserrat transition-colors duration-200 animate-fade-in"
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
          setSelectedCategory={setSelectedCategory}
        />
        
        {/* Temporarily removed search bar
        <PromiseSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={allCategories}
        />
        */}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`w-full lg:w-1/2 transition-all duration-300 ${activePolitician === 'carney' ? 'block' : 'hidden lg:block'}`}>
            {Object.keys(carneyGroupedPromises).sort((a, b) => {
              if (a === 'Unknown Date') return 1;
              if (b === 'Unknown Date') return -1;
              return new Date(b).getTime() - new Date(a).getTime();
            }).map(date => (
              <div key={date} className="mb-4 last:mb-0">
                <PoliticianColumn 
                  promises={carneyGroupedPromises[date]}
                  politician="carney"
                  backgroundImage={`${import.meta.env.BASE_URL}uploads/bg-red-texture.png`}
                  category={selectedCategory}
                  date={date}
                  onPromiseClick={(promise) => {
                    setSelectedPromise({ promise, politician: 'carney' });
                    // Create shareable URL with the promise ID
                    const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
                    const shareUrl = `${baseUrl}?promise=${promise.id}`;
                    // For copy-to-clipboard functionality if needed later
                    sessionStorage.setItem('promiseShareUrl', shareUrl);
                  }}
                />
              </div>
            ))}
          </div>
          
          <div className={`w-full lg:w-1/2 transition-all duration-300 ${activePolitician === 'poilievre' ? 'block' : 'hidden lg:block'}`}>
            {Object.keys(poilievreGroupedPromises).sort((a, b) => {
              if (a === 'Unknown Date') return 1;
              if (b === 'Unknown Date') return -1;
              return new Date(b).getTime() - new Date(a).getTime();
            }).map(date => (
              <div key={date} className="mb-4 last:mb-0">
                <PoliticianColumn 
                  promises={poilievreGroupedPromises[date]}
                  politician="poilievre"
                  backgroundImage={`${import.meta.env.BASE_URL}uploads/bg-blue-texture.png`}
                  category={selectedCategory}
                  date={date}
                  onPromiseClick={(promise) => {
                    setSelectedPromise({ promise, politician: 'poilievre' });
                    // Create shareable URL with the promise ID
                    const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
                    const shareUrl = `${baseUrl}?promise=${promise.id}`;
                    // For copy-to-clipboard functionality if needed later
                    sessionStorage.setItem('promiseShareUrl', shareUrl);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
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
