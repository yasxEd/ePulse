'use client'
import React, { useEffect, useState } from 'react';
import TypingTest from './TypingTest';
import { useAnalytics } from '@/hooks/useAnalytics';

interface TestContainerProps {
  onTestStart?: () => void;
  onTestEnd?: () => void;
  testStarted?: boolean;
}

interface TextDatabase {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
  expert: string[];
  programming: string[];
  numbers: string[];
  punctuation: string[];
  special: string[];
}

type LevelOption = keyof TextDatabase | 'all';

const TestContainer: React.FC<TestContainerProps> = ({ 
  onTestStart, 
  onTestEnd, 
  testStarted = false 
}) => {
  const [textDatabase, setTextDatabase] = useState<TextDatabase>({
    beginner: ['The quick brown fox jumps over the lazy dog.'],
    intermediate: ['Programming is a skill best acquired by practice and example rather than from books.'],
    advanced: ['The secret of getting ahead is getting started.'],
    expert: ['Advanced typing requires consistent practice and dedication.'],
    programming: ['function hello() { return "Hello, World!"; }'],
    numbers: ['The year 2024 has 365 days and 12 months.'],
    punctuation: ['Hello, world! How are you today?'],
    special: ['Use strong passwords like: P@ssw0rd123!']
  });

  const [selectedLevel, setSelectedLevel] = useState<LevelOption>('beginner');
  const [currentTexts, setCurrentTexts] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { analytics, addTestResult } = useAnalytics();

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Load texts from JSON file
    fetch('/texts.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: TextDatabase) => {
        if (data && typeof data === 'object') {
          setTextDatabase(data);
          // Set initial level based on user's skill level
          const skillLevelMap: Record<string, keyof TextDatabase> = {
            'Beginner': 'beginner',
            'Intermediate': 'intermediate', 
            'Advanced': 'advanced',
            'Expert': 'expert'
          };
          const initialLevel = skillLevelMap[analytics.skillLevel] || 'beginner';
          setSelectedLevel(initialLevel);
          setCurrentTexts([...data[initialLevel]]);
        }
      })
      .catch(error => {
        console.warn('Failed to load typing texts:', error.message);
        setCurrentTexts([...textDatabase[selectedLevel as keyof TextDatabase]]);
      });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle level change
  const handleLevelChange = (level: LevelOption) => {
    setSelectedLevel(level);
    setIsDropdownOpen(false);
    
    if (level === 'all') {
      // Combine all texts from all levels (no shuffling)
      const allTexts = Object.values(textDatabase).flat();
      setCurrentTexts(allTexts);
    } else {
      setCurrentTexts([...textDatabase[level as keyof TextDatabase]]);
    }
  };

  // Get level color and styling
  const getLevelColor = (level: LevelOption) => {
    const colors = {
      all: 'text-rainbow bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-purple-400 to-pink-400',
      beginner: 'text-green-400 border-green-400/30 bg-green-500/10',
      intermediate: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
      advanced: 'text-orange-400 border-orange-400/30 bg-orange-500/10',
      expert: 'text-red-400 border-red-400/30 bg-red-500/10',
      programming: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
      numbers: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
      punctuation: 'text-pink-400 border-pink-400/30 bg-pink-500/10',
      special: 'text-indigo-400 border-indigo-400/30 bg-indigo-500/10'
    };
    return colors[level] || colors.beginner;
  };

  // Get level description
  const getLevelDescription = (level: LevelOption) => {
    const descriptions = {
      all: 'Mixed difficulty from all categories',
      beginner: 'Simple words and basic sentences',
      intermediate: 'Longer texts with common vocabulary',
      advanced: 'Complex sentences and technical terms',
      expert: 'Academic and professional content',
      programming: 'Code snippets and syntax',
      numbers: 'Numerical data and dates',
      punctuation: 'Heavy punctuation practice',
      special: 'Special characters and symbols'
    };
    return descriptions[level] || descriptions.beginner;
  };

  // Get total text count for a level
  const getTextCount = (level: LevelOption) => {
    if (level === 'all') {
      return Object.values(textDatabase).reduce((total, texts) => total + texts.length, 0);
    }
    return textDatabase[level as keyof TextDatabase]?.length || 0;
  };

  return (
    <div className="w-full relative">
      <div className="container mx-auto px-6 py-6">
        {/* Header - only show when test not started */}
        {!testStarted && (
          <header className={`mb-16 transition-all duration-1200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            {/* Main Layout - Left content and Right dropdown */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12 mb-12">
              {/* Left Side - Title, Description, and Start Button */}
              <div className="flex-1 text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-300 hover:from-blue-200 hover:via-gray-100 hover:to-blue-200 transition-all duration-700 font-mono">
                  ePulse
                </h1>
                <div className="text-gray-400 max-w-2xl text-lg leading-relaxed font-mono mb-8">
                  Master typing with precision and speed. Track your progress, build muscle memory, and improve your accuracy.
                </div>
              </div>

              {/* Right Side - Level Selection Dropdown */}
              <div className="w-full lg:w-auto lg:min-w-[320px]">
                <h3 className="text-xl font-bold text-white mb-4 font-mono text-center lg:text-right">
                  Choose Your Challenge
                </h3>
                
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full p-4 border backdrop-blur-md rounded-xl transition-all duration-500 hover:scale-105 flex items-center justify-between ${
                      selectedLevel === 'all' 
                        ? 'text-white border-white/30 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-purple-500/10'
                        : getLevelColor(selectedLevel).includes('border-') 
                          ? getLevelColor(selectedLevel)
                          : 'text-gray-400 border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-left flex-1">
                      <div className="text-base font-bold capitalize mb-1 font-mono">
                        {selectedLevel === 'all' ? 'All Levels' : selectedLevel}
                      </div>
                      <div className="text-sm opacity-80">
                        {currentTexts.length} texts available
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ml-4 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-black/95 to-gray-900/95 border border-white/10 backdrop-blur-md rounded-xl shadow-2xl z-[9999] max-h-80 overflow-y-auto">
                      {/* All Levels Option */}
                      <button
                        onClick={() => handleLevelChange('all')}
                        className={`w-full p-4 text-left hover:bg-white/10 transition-all duration-300 ${
                          selectedLevel === 'all' ? 'bg-white/10' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-base font-bold font-mono bg-gradient-to-r from-red-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                              All Levels
                            </div>
                            <div className="text-sm text-gray-400">
                              {getTextCount('all')} texts
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Individual Level Options */}
                      {Object.keys(textDatabase).map((level) => (
                        <button
                          key={level}
                          onClick={() => handleLevelChange(level as keyof TextDatabase)}
                          className={`w-full p-4 text-left hover:bg-white/10 transition-all duration-300 ${
                            selectedLevel === level ? 'bg-white/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={`text-base font-bold capitalize mb-1 font-mono ${
                                getLevelColor(level as keyof TextDatabase).split(' ')[0]
                              }`}>
                                {level}
                              </div>
                              <div className="text-sm text-gray-400">
                                {getTextCount(level as keyof TextDatabase)} texts
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        <div className={`relative transition-all duration-1200 ${!testStarted ? 'delay-400' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          {/* Test Component */}
          <div className="relative z-10">
            <TypingTest 
              texts={currentTexts} 
              onTestStart={onTestStart}
              onTestEnd={onTestEnd}
              testStarted={testStarted}
              onTestComplete={addTestResult}
              currentLevel={selectedLevel}
              onLevelChange={(level: string) => handleLevelChange(level as LevelOption)}
              isDropdownOpen={isDropdownOpen}
            />
          </div>
        </div>

        {/* Analytics - Reorganized and Spaced Out */}
        {!testStarted && (
          <footer className={`mt-40 transition-all duration-1200 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            {/* Quick Overview Stats */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2 font-mono">Your Progress</h3>
                <p className="text-gray-400 font-mono">Track your improvement over time</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="group p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 backdrop-blur-md rounded-xl hover:from-blue-500/15 hover:to-blue-600/10 hover:border-blue-400/40 transition-all duration-500 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{analytics.testsToday}</div>
                  <div className="text-sm text-gray-400 font-mono">Tests Today</div>
                </div>

                <div className="group p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-400/20 backdrop-blur-md rounded-xl hover:from-green-500/15 hover:to-green-600/10 hover:border-green-400/40 transition-all duration-500 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{analytics.bestWPM || '--'}</div>
                  <div className="text-sm text-gray-400 font-mono">Best WPM</div>
                </div>

                <div className="group p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20 backdrop-blur-md rounded-xl hover:from-purple-500/15 hover:to-purple-600/10 hover:border-purple-400/40 transition-all duration-500 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{analytics.currentStreak}</div>
                  <div className="text-sm text-gray-400 font-mono">Day Streak</div>
                </div>

                <div className="group p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-400/20 backdrop-blur-md rounded-xl hover:from-orange-500/15 hover:to-orange-600/10 hover:border-orange-400/40 transition-all duration-500 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{analytics.skillLevel}</div>
                  <div className="text-sm text-gray-400 font-mono">Skill Level</div>
                </div>
              </div>
            </div>

            {/* Personal Records - Simplified */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-500">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2 font-mono flex items-center justify-center">
                    <span className="mr-3 text-2xl">🏅</span>
                    Personal Records
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                    <div className="text-xl font-bold text-yellow-300 mb-2">{analytics.personalBests.fastestWPM.value || '--'} WPM</div>
                    <div className="text-sm text-gray-400 font-mono">Fastest Speed</div>
                    {analytics.personalBests.fastestWPM.date && (
                      <div className="text-xs text-gray-500 mt-2">{new Date(analytics.personalBests.fastestWPM.date).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                    <div className="text-xl font-bold text-blue-300 mb-2">{analytics.personalBests.highestAccuracy.value || '--'}%</div>
                    <div className="text-sm text-gray-400 font-mono">Best Accuracy</div>
                    {analytics.personalBests.highestAccuracy.date && (
                      <div className="text-xs text-gray-500 mt-2">{new Date(analytics.personalBests.highestAccuracy.date).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                    <div className="text-xl font-bold text-green-300 mb-2">{Math.round(analytics.personalBests.longestSession.value) || '--'}s</div>
                    <div className="text-sm text-gray-400 font-mono">Longest Session</div>
                    {analytics.personalBests.longestSession.date && (
                      <div className="text-xs text-gray-500 mt-2">{new Date(analytics.personalBests.longestSession.date).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Chart - More Prominent */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-500">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2 font-mono flex items-center justify-center">
                    <span className="mr-3 text-2xl">📈</span>
                    14-Day Progress
                  </h3>
                  <p className="text-gray-400 text-sm font-mono">
                    {analytics.weeklyProgress.length > 0 ? `Tracking ${analytics.weeklyProgress.length} days of activity` : 'Start taking tests to see your improvement!'}
                  </p>
                </div>
                
                {/* Progress Chart */}
                <div className="relative h-48 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-white/10 p-6 mb-6">
                  {analytics.weeklyProgress.length > 0 ? (
                    <div className="w-full h-full flex items-end justify-center gap-2">
                      {analytics.weeklyProgress.map((day, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 max-w-16">
                          <div className="text-xs text-gray-400 mb-2 font-mono">
                            {day.tests}
                          </div>
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t opacity-80 transition-all duration-300 hover:opacity-100 relative group"
                            style={{ height: `${Math.max((day.wpm / 100) * 80, 8)}%` }}
                            title={`${new Date(day.date).toLocaleDateString()}: ${day.wpm} WPM, ${day.accuracy}% accuracy, ${day.tests} tests`}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {day.wpm} WPM
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 font-mono">
                            {new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 font-mono text-sm">
                      📊 Progress chart will appear here after your first test
                    </div>
                  )}
                </div>

                {/* Summary Stats */}
                {analytics.weeklyProgress.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="text-sm font-mono text-gray-400">
                      Total Tests: <span className="text-white">{analytics.totalTests}</span>
                    </div>
                    <div className="text-sm font-mono text-gray-400">
                      Avg WPM: <span className="text-blue-300">{analytics.averageWPM || '--'}</span>
                    </div>
                    <div className="text-sm font-mono text-gray-400">
                      Consistency: <span className="text-green-300">{Math.round(analytics.consistencyScore)}%</span>
                    </div>
                    <div className="text-sm font-mono text-gray-400">
                      Improvement: <span className={analytics.improvementRate > 0 ? "text-green-300" : "text-gray-400"}>
                        {analytics.improvementRate > 0 ? `+${Math.round(analytics.improvementRate)} WPM` : 'Keep practicing'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips & Goals - Side by Side */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Goals & Focus Areas */}
                <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-500">
                  <h4 className="text-lg font-bold text-white mb-6 font-mono flex items-center">
                    <span className="mr-3 text-xl text-orange-400">🎯</span>
                    Your Goals
                  </h4>
                  
                  <div className="mb-6 p-4 bg-orange-500/10 border border-orange-400/20 rounded-lg">
                    <div className="text-sm font-bold text-orange-300 mb-2">Next Target:</div>
                    <div className="text-base text-white font-mono">{analytics.nextGoal}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-bold text-gray-300 mb-3">Focus Areas ({analytics.skillLevel}):</div>
                    {analytics.improvementAreas.slice(0, 3).map((area, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-orange-400 text-xs mt-1">▸</span>
                        <span className="text-gray-300 text-sm font-mono">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips & Performance */}
                <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-500">
                  <h4 className="text-lg font-bold text-white mb-6 font-mono flex items-center">
                    <span className="mr-3 text-xl text-blue-400">💡</span>
                    Tips for You
                  </h4>
                  
                  <div className="space-y-4 mb-6">
                    {analytics.dynamicTips.slice(0, 3).map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-blue-400 text-xs mt-1">▸</span>
                        <span className="text-gray-300 text-sm font-mono leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Best Performance Time */}
                  {Object.keys(analytics.timeOfDayPerformance).length > 0 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                      <div className="text-sm font-bold text-blue-300 mb-3">Your Best Time:</div>
                      <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                        {Object.entries(analytics.timeOfDayPerformance).map(([time, data]) => (
                          <div key={time} className="text-center">
                            <div className="text-white capitalize font-bold">{time}</div>
                            <div className="text-gray-400">{data.wpm} WPM</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Motivational Footer */}
            <div className="text-center">
              <div className="group p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-500 max-w-md mx-auto">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">◆</div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300 font-mono">
                  Practice daily to build lasting muscle memory
                </p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default TestContainer;