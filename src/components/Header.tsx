import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  activePolitician?: 'carney' | 'poilievre';
  onPoliticianChange?: (politician: 'carney' | 'poilievre') => void;
}

const Header: React.FC<HeaderProps> = ({ activePolitician, onPoliticianChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Show after 100px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Regular header with logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center bg-carney px-4 py-2">
              <img 
                src="/uploads/679d23fc682f2bf860558cc6_build_canada-wordmark.svg" 
                alt="Build Canada" 
                className="h-8"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/memos" className="text-gray-600 hover:text-gray-900 font-medium">
                Memos
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky politician selector */}
      {activePolitician && onPoliticianChange && (
        <div 
          className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 transform ${
            isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <div className="flex flex-col items-center justify-center px-6 py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onPoliticianChange('carney')}
                className={`text-xl md:text-2xl font-oswald tracking-wider transition-colors duration-200
                  ${activePolitician === 'carney' ? 'text-carney' : 'text-carney/50 hover:text-carney/80'}
                  lg:text-carney lg:hover:text-carney/80 relative`}
              >
                MARK CARNEY
                <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 text-carney text-xs lg:hidden">▼</span>
              </button>
              <div className="h-8 w-0.5 bg-gray-300 mx-2 rotate-12"></div>
              <button 
                onClick={() => onPoliticianChange('poilievre')}
                className={`text-xl md:text-2xl font-oswald tracking-wider transition-colors duration-200
                  ${activePolitician === 'poilievre' ? 'text-poilievre' : 'text-poilievre/50 hover:text-poilievre/80'}
                  lg:text-poilievre lg:hover:text-poilievre/80 relative`}
              >
                PIERRE POILIEVRE
                <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 text-poilievre text-xs lg:hidden">▼</span>
              </button>
            </div>
            <div className="text-gray-600 text-sm mt-4 text-center max-w-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
              Track and compare political promises made during the 2025 Canadian election cycle
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="text-gray-600 text-sm mt-4 text-center max-w-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Use the buttons above or swipe left/right to switch between candidates. Click on categories to compare policies. Click promise cards for details and sources.
        </div>
      )}
    </>
  );
};

export default Header;
