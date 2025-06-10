'use client'
import React, { useState, useRef, useEffect } from 'react';
import useTypingTest from '@/hooks/useTypingTest';
import KeyboardVisualization from './KeyboardVisualization';
import ResultsDisplay from './ResultsDisplay';
import { TypingResult } from '@/types';
import Link from 'next/link';

interface TypingTestProps {
  texts: string[];
  onTestStart?: () => void;
  onTestEnd?: () => void;
  testStarted?: boolean;
  onTestComplete?: (result: TypingResult) => void;
  currentLevel?: string;
  onLevelChange?: (level: string) => void;
  isDropdownOpen?: boolean;
}

const TypingTest: React.FC<TypingTestProps> = ({ 
  texts, 
  onTestStart, 
  onTestEnd, 
  testStarted = false,
  onTestComplete,
  currentLevel = 'beginner',
  onLevelChange,
  isDropdownOpen = false
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const testText = texts[currentTextIndex] || 'Loading...';
  
  const {
    state,
    result,
    pressedKeys,
    startTest,
    resetTest,
    handleKeyDown,
    handleKeyUp,
    currentWPM,
    currentAccuracy
  } = useTypingTest(testText);

  useEffect(() => {
    setIsLoaded(true);
    if (state.isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isActive]);

  // Handle test completion and save result
  useEffect(() => {
    if (result && onTestComplete) {
      onTestComplete(result);
    }
  }, [result, onTestComplete]);

  // Handle test start
  const handleStartTest = () => {
    startTest();
    setHasStartedOnce(true);
    if (onTestStart) {
      onTestStart();
    }
  };

  // Function to start a new test with a different text (sequential)
  const startNewTest = () => {
    setIsTransitioning(true);
    
    // Fade out current content
    setTimeout(() => {
      const newIndex = (currentTextIndex + 1) % texts.length;
      setCurrentTextIndex(newIndex);
      resetTest();
    }, 300);
    
    // Start new test and fade in
    setTimeout(() => {
      startTest();
      setIsTransitioning(false);
    }, 600);
  };

  // Reset hasStartedOnce when going back to selection
  const handleBackToSelection = () => {
    resetTest();
    setHasStartedOnce(false); // Reset so start button appears again
    if (onTestEnd) {
      onTestEnd();
    }
  };

  // Get level color for display
  const getLevelDisplayColor = (level: string) => {
    const colors: Record<string, string> = {
      all: 'text-white bg-gradient-to-r from-red-500/20 via-blue-500/20 to-purple-500/20 border-white/30',
      beginner: 'text-green-400 bg-green-500/20 border-green-400/30',
      intermediate: 'text-blue-400 bg-blue-500/20 border-blue-400/30',
      advanced: 'text-orange-400 bg-orange-500/20 border-orange-400/30',
      expert: 'text-red-400 bg-red-500/20 border-red-400/30',
      programming: 'text-purple-400 bg-purple-500/20 border-purple-400/30',
      numbers: 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30',
      punctuation: 'text-pink-400 bg-pink-500/20 border-pink-400/30',
      special: 'text-indigo-400 bg-indigo-500/20 border-indigo-400/30'
    };
    return colors[level] || colors.beginner;
  };

  // Highlight correctly typed and incorrect characters
  const renderText = () => {
    return (
      <div className="text-xl md:text-2xl leading-relaxed font-mono tracking-wide whitespace-pre-wrap">
        {state.currentText.split('').map((char, index) => {
          let className = "transition-all duration-200";
          
          if (index < state.typedText.length) {
            // Character has been typed
            if (state.typedText[index] === char) {
              className += " text-blue-300 bg-blue-500/10 rounded-sm"; // Correct character
            } else {
              className += " text-red-400 bg-red-500/20 rounded-sm"; // Incorrect character
            }
          } else if (index === state.typedText.length) {
            className += " bg-white/20 text-white animate-pulse rounded-sm"; // Current position
          } else {
            className += " text-gray-400"; // Untyped characters
          }
          
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`w-full transition-all duration-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Back Button - only show during test */}
      {testStarted && (
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={handleBackToSelection}
            className="group inline-flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-500 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-500">
              <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
            </div>
            <span className="font-mono text-sm group-hover:underline underline-offset-4">Back to Level Selection</span>
          </button>
          
          {/* Current Level Display */}
          <div className={`border backdrop-blur-md rounded-xl px-4 py-2 ${getLevelDisplayColor(currentLevel)}`}>
            <div className="flex items-center space-x-3 text-sm font-mono">
              <span className="font-bold capitalize">
                {currentLevel === 'all' ? 'All Levels' : `${currentLevel} Level`}
              </span>
              <span className="opacity-60">•</span>
              <span className="opacity-80">Text {currentTextIndex + 1} of {texts.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Stats Section - only show during test */}
      {testStarted && (
        <div className="flex justify-center gap-12 mb-12">
          {[
            { label: 'WPM', value: currentWPM, color: 'blue' },
            { label: 'Accuracy', value: `${currentAccuracy}%`, color: 'white' },
            { label: 'Progress', value: `${state.currentText.length > 0 ? Math.floor((state.typedText.length / state.currentText.length) * 100) : 0}%`, color: 'gray' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center"
            >
              <div className="text-sm text-gray-400 mb-2 font-mono">
                {stat.label}
              </div>
              <div className={`text-3xl md:text-4xl font-black font-mono ${
                stat.color === 'blue' ? 'text-blue-300' :
                stat.color === 'white' ? 'text-white' :
                'text-gray-300'
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons - Always visible */}
      <div className="flex justify-start gap-4 mb-12 flex-wrap">
        {!state.isActive && !state.isComplete && !hasStartedOnce && (
          <button
            onClick={handleStartTest}
            className="group relative inline-block hover:scale-105 transition-all duration-500"
          >
            <div className="relative px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-xl font-mono">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 bg-size-200 animate-gradient"></div>
              
              <span className="relative z-8 flex items-center space-x-3 text-black">
                <span>Start Test</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </div>
          </button>
        )}
        
        {(state.isActive || state.isComplete) && (
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={startNewTest}
              className="group px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-mono text-white font-medium"
            >
              <span className="flex items-center space-x-2">
                <span>Next Text</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
            
            <button
              onClick={handleBackToSelection}
              className="group px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-mono text-white font-medium"
            >
              <span className="flex items-center space-x-2">
                <span>Change Level</span>
                <span className="group-hover:rotate-180 transition-transform duration-300">↻</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Text Display Area - More Spacious */}
      {testStarted && (
        <div className="relative mb-12">
          <div className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl p-12 md:p-16 shadow-2xl transition-all duration-700 overflow-hidden ${
            isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
          }`}>
            {/* Loading Animation Overlay */}
            {isTransitioning && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-400/30 rounded-full animate-spin border-t-blue-400"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-white/20"></div>
                  </div>
                  <div className="text-white/80 font-mono text-sm animate-pulse"></div>
                </div>
              </div>
            )}
            
            <div className="relative z-10">
              {renderText()}
            </div>
          </div>
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute h-0"
        autoFocus
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        disabled={!state.isActive}
      />

      {/* Keyboard visualization - More Compact */}
      {testStarted && (
        <div className="mb-12">
          <KeyboardVisualization pressedKeys={pressedKeys} />
        </div>
      )}

      {/* Results display */}
      {result && (
        <div className="animate-fade-in">
          <ResultsDisplay 
            result={result} 
            onNextTest={startNewTest}
            onBackToSelection={handleBackToSelection}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes slideOutDown {
          from { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
          to { 
            opacity: 0; 
            transform: translateY(-30px) scale(0.95); 
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-slide-out-down {
          animation: slideOutDown 0.3s ease-out forwards;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TypingTest;