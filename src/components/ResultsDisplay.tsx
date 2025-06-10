'use client'
import React, { useEffect, useRef, useState } from 'react';
import { TypingResult } from '@/types';

interface ResultsDisplayProps {
  result: TypingResult;
  onNextTest?: () => void;
  onBackToSelection?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onNextTest, onBackToSelection }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white relative font-mono z-50 flex items-center justify-center">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950"></div>
      
      {/* Floating Geometric Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        />
        <div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-60"
          style={{ transform: `translate(${-scrollY * 0.15}px, ${scrollY * 0.08}px)` }}
        />
        <div 
          className="absolute top-1/2 left-3/4 w-3 h-3 border border-blue-300/20"
          style={{ transform: `rotate(${45 + scrollY * 0.1}deg) translate(${-scrollY * 0.1}px, ${scrollY * 0.12}px)` }}
        />
      </div>
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-float-delayed" />
      </div>
      
      {/* Mouse Follower */}
      <div 
        className="fixed w-80 h-80 bg-gradient-radial from-blue-500/6 to-transparent rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      />

      <div className={`relative z-10 w-full max-w-5xl mx-auto p-4 sm:p-6 transition-all duration-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        {/* Main Results Container */}
        <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-700 p-6 sm:p-8">
          {/* Background Orbs */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-300 mb-3 font-mono">
                Test Results
              </h2>
              <div className="text-gray-400 text-sm sm:text-base font-mono">
                Completed on {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                { label: 'WPM', value: result.wpm, color: 'blue', icon: '◆', suffix: '' },
                { label: 'Accuracy', value: result.accuracy, color: 'white', icon: '◊', suffix: '%' },
                { label: 'Time', value: result.duration.toFixed(1), color: 'gray', icon: '※', suffix: 's' },
                { label: 'Characters', value: result.textLength, color: 'blue', icon: '◈', suffix: '' }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`group relative p-4 sm:p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-700 hover:scale-105 hover:-translate-y-2 animate-fade-in`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                      {stat.icon}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-2 font-mono group-hover:text-gray-300 transition-colors">
                      {stat.label}
                    </div>
                    <div className={`text-xl sm:text-2xl md:text-3xl font-black font-mono ${
                      stat.color === 'blue' ? 'text-blue-300 group-hover:text-blue-200' :
                      stat.color === 'white' ? 'text-white group-hover:text-gray-100' :
                      'text-gray-300 group-hover:text-gray-200'
                    } transition-colors duration-300`}>
                      {stat.value}{stat.suffix}
                    </div>
                  </div>
                  
                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${
                    stat.color === 'blue' ? 'from-blue-400 to-transparent' :
                    stat.color === 'white' ? 'from-white to-transparent' :
                    'from-gray-400 to-transparent'
                  } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </div>
              ))}
            </div>

            {/* Performance Insights */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-6 hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-700">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white font-mono flex items-center">
                    <span className="mr-3 text-2xl">◇</span>
                    Performance Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-400 text-lg">▸</span>
                      <span className="text-gray-300 font-mono text-sm sm:text-base">{getSpeedFeedback(result.wpm)}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-white text-lg">▸</span>
                      <span className="text-gray-300 font-mono text-sm sm:text-base">{getAccuracyFeedback(result.accuracy)}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-gray-400 text-lg">▸</span>
                      <span className="text-gray-300 font-mono text-sm sm:text-base">
                        You typed {Math.round(result.textLength / result.duration)} characters per second.
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-white to-blue-400 transform scale-x-0 hover:scale-x-100 transition-transform duration-1000 origin-center"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    onNextTest?.();
                  }, 400);
                }}
                disabled={isTransitioning}
                className={`group relative inline-block hover:scale-110 transition-all duration-500 ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white overflow-hidden rounded-xl font-mono">
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 bg-size-200 animate-gradient ${
                    isTransitioning ? 'animate-gradient-fast' : 'group-hover:animate-gradient-fast'
                  }`}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center space-x-3 text-black">
                    {isTransitioning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 rounded-full animate-spin border-t-black"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Next Text</span>
                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                      </>
                    )}
                  </span>
                </div>
              </button>
              
              <button
                onClick={onBackToSelection}
                disabled={isTransitioning}
                className={`group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-500 hover:scale-110 font-mono text-white font-medium ${
                  isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span>Back to Selection</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">←</span>
                </span>
              </button>
            </div>
          </div>
          
          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-white to-blue-400 transform scale-x-0 hover:scale-x-100 transition-transform duration-1000 origin-center"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-3deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-gradient-fast {
          animation: gradient 1.5s ease infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

// Helper functions for feedback
function getSpeedFeedback(wpm: number): string {
  if (wpm >= 80) return "Excellent speed! You're a typing master!";
  if (wpm >= 60) return "Great speed! Above the average typist.";
  if (wpm >= 40) return "Good speed. You're at a typical typing level.";
  return "Keep practicing to improve your typing speed.";
}

function getAccuracyFeedback(accuracy: number): string {
  if (accuracy >= 98) return "Exceptional accuracy! Minimal errors.";
  if (accuracy >= 95) return "Very good accuracy. Just a few mistakes.";
  if (accuracy >= 90) return "Good accuracy. Try to be more precise.";
  return "Focus on accuracy before speed for better results.";
}

export default ResultsDisplay;