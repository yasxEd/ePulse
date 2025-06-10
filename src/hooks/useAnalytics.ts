'use client'
import { useState, useEffect, useCallback } from 'react';
import { TypingResult } from '@/types';

interface DetailedAnalytics {
  // Basic stats
  testsToday: number;
  bestWPM: number;
  averageWPM: number;
  averageAccuracy: number;
  totalTests: number;
  totalTypingTime: number; // in minutes
  
  // Performance tracking
  recentResults: TypingResult[];
  lastTestDate: string;
  weeklyProgress: Array<{ 
    date: string; 
    wpm: number; 
    accuracy: number; 
    tests: number;
    avgTime: number;
  }>;
  
  // Advanced metrics
  consistencyScore: number; // How consistent speeds are
  improvementRate: number; // WPM improvement over time
  errorPatterns: Record<string, number>; // Common mistake keys
  timeOfDayPerformance: Record<string, { wpm: number; accuracy: number; count: number }>;
  
  // Streaks and achievements
  currentStreak: number; // Days with at least one test
  longestStreak: number;
  perfectAccuracyTests: number;
  personalBests: {
    fastestWPM: { value: number; date: string };
    highestAccuracy: { value: number; date: string };
    longestSession: { value: number; date: string };
  };
  
  // Improvement areas and tips
  improvementAreas: string[];
  dynamicTips: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  nextGoal: string;
}

const defaultAnalytics: DetailedAnalytics = {
  testsToday: 0,
  bestWPM: 0,
  averageWPM: 0,
  averageAccuracy: 0,
  totalTests: 0,
  totalTypingTime: 0,
  recentResults: [],
  lastTestDate: '',
  weeklyProgress: [],
  consistencyScore: 0,
  improvementRate: 0,
  errorPatterns: {},
  timeOfDayPerformance: {},
  currentStreak: 0,
  longestStreak: 0,
  perfectAccuracyTests: 0,
  personalBests: {
    fastestWPM: { value: 0, date: '' },
    highestAccuracy: { value: 0, date: '' },
    longestSession: { value: 0, date: '' }
  },
  improvementAreas: ['Focus on accuracy first', 'Practice common words', 'Work on finger placement'],
  dynamicTips: ['Start with accuracy, speed will follow', 'Practice 15 minutes daily', 'Use proper finger positioning'],
  skillLevel: 'Beginner',
  nextGoal: 'Reach 25 WPM with 90% accuracy'
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<DetailedAnalytics>(defaultAnalytics);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load analytics from localStorage only once on mount
  useEffect(() => {
    const saved = localStorage.getItem('typingAnalyticsV2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        
        // Update streak and daily counter
        if (data.lastTestDate !== today) {
          const lastDate = new Date(data.lastTestDate);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          data.testsToday = 0;
          if (daysDiff > 1) {
            data.currentStreak = 0; // Break streak if more than 1 day gap
          }
        }
        
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save analytics to localStorage when analytics change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('typingAnalyticsV2', JSON.stringify(analytics));
    }
  }, [analytics, isLoaded]);

  const calculateSkillLevel = useCallback((wpm: number, accuracy: number): DetailedAnalytics['skillLevel'] => {
    if (wpm >= 70 && accuracy >= 96) return 'Expert';
    if (wpm >= 50 && accuracy >= 94) return 'Advanced';
    if (wpm >= 30 && accuracy >= 90) return 'Intermediate';
    return 'Beginner';
  }, []);

  const calculateConsistency = useCallback((results: TypingResult[]): number => {
    if (results.length < 3) return 0;
    
    const recent = results.slice(0, 10);
    const speeds = recent.map(r => r.wpm);
    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const variance = speeds.reduce((acc, speed) => acc + Math.pow(speed - mean, 2), 0) / speeds.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation means higher consistency (0-100 scale)
    return Math.max(0, Math.min(100, 100 - (standardDeviation * 2)));
  }, []);

  const calculateImprovementRate = useCallback((results: TypingResult[]): number => {
    if (results.length < 5) return 0;
    
    const recent = results.slice(0, 10).reverse(); // Oldest to newest
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, r) => sum + r.wpm, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.wpm, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  }, []);

  const analyzeErrorPatterns = useCallback((results: TypingResult[]): Record<string, number> => {
    // This would need to be implemented in the typing test to track actual errors
    // For now, return empty object as placeholder
    return {};
  }, []);

  const generateDynamicTips = useCallback((analytics: DetailedAnalytics): string[] => {
    const tips: string[] = [];
    
    if (analytics.averageAccuracy < 85) {
      tips.push('Slow down and focus on accuracy - it\'s more important than speed');
      tips.push('Practice typing without looking at the keyboard');
    } else if (analytics.averageAccuracy < 95) {
      tips.push('Great accuracy! Now work on maintaining it while increasing speed');
    }
    
    if (analytics.averageWPM < 30) {
      tips.push('Practice the home row keys (ASDF JKL;) until they\'re automatic');
      tips.push('Use proper finger positioning for each key');
    } else if (analytics.averageWPM < 50) {
      tips.push('Try typing common word combinations to build muscle memory');
      tips.push('Practice typing without pausing between words');
    } else if (analytics.averageWPM < 70) {
      tips.push('Work on difficult letter combinations and punctuation');
      tips.push('Try longer texts to build endurance');
    }
    
    if (analytics.consistencyScore < 70) {
      tips.push('Focus on maintaining steady rhythm rather than bursts of speed');
    }
    
    if (analytics.currentStreak === 0) {
      tips.push('Try to practice daily, even if just for 5 minutes');
    }
    
    return tips.slice(0, 3);
  }, []);

  const generateImprovementAreas = useCallback((analytics: DetailedAnalytics): string[] => {
    const areas: string[] = [];
    
    if (analytics.averageAccuracy < 90) {
      areas.push('Accuracy needs improvement');
    }
    
    if (analytics.consistencyScore < 70) {
      areas.push('Work on typing consistency');
    }
    
    if (analytics.averageWPM < 40) {
      areas.push('Build typing speed gradually');
    }
    
    if (analytics.currentStreak < 3) {
      areas.push('Establish daily practice routine');
    }
    
    if (areas.length === 0) {
      areas.push('Maintain excellent performance');
      areas.push('Challenge yourself with harder texts');
      areas.push('Help others improve their typing');
    }
    
    return areas.slice(0, 3);
  }, []);

  const generateNextGoal = useCallback((analytics: DetailedAnalytics): string => {
    const { averageWPM, averageAccuracy, skillLevel } = analytics;
    
    if (skillLevel === 'Beginner') {
      if (averageAccuracy < 90) return 'Achieve 90% accuracy consistently';
      return 'Reach 30 WPM with 90% accuracy';
    }
    
    if (skillLevel === 'Intermediate') {
      if (averageAccuracy < 94) return 'Improve accuracy to 94%';
      return 'Reach 50 WPM with 94% accuracy';
    }
    
    if (skillLevel === 'Advanced') {
      if (averageAccuracy < 96) return 'Achieve 96% accuracy';
      return 'Reach 70 WPM with 96% accuracy';
    }
    
    return 'Maintain expert level and help others improve';
  }, []);

  const addTestResult = useCallback((result: TypingResult) => {
    const today = new Date().toDateString();
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';
    
    setAnalytics(prev => {
      const newRecentResults = [result, ...prev.recentResults].slice(0, 100);
      const isNewDay = prev.lastTestDate !== today;
      const isFirstTestToday = prev.testsToday === 0;
      
      // Calculate averages
      const totalWPM = newRecentResults.reduce((sum, r) => sum + r.wpm, 0);
      const totalAccuracy = newRecentResults.reduce((sum, r) => sum + r.accuracy, 0);
      const avgWPM = Math.round(totalWPM / newRecentResults.length);
      const avgAccuracy = Math.round(totalAccuracy / newRecentResults.length);
      
      // Update personal bests
      const newPersonalBests = { ...prev.personalBests };
      if (result.wpm > newPersonalBests.fastestWPM.value) {
        newPersonalBests.fastestWPM = { value: result.wpm, date: today };
      }
      if (result.accuracy > newPersonalBests.highestAccuracy.value) {
        newPersonalBests.highestAccuracy = { value: result.accuracy, date: today };
      }
      if (result.duration > newPersonalBests.longestSession.value) {
        newPersonalBests.longestSession = { value: result.duration, date: today };
      }
      
      // Update streaks
      let newCurrentStreak = prev.currentStreak;
      let newLongestStreak = prev.longestStreak;
      
      if (isNewDay && isFirstTestToday) {
        newCurrentStreak = prev.currentStreak + 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      } else if (isFirstTestToday) {
        newCurrentStreak = 1;
        newLongestStreak = Math.max(newLongestStreak, 1);
      }
      
      // Update weekly progress
      const weeklyProgress = [...prev.weeklyProgress];
      const todayProgress = weeklyProgress.find(p => p.date === today);
      
      if (todayProgress) {
        todayProgress.wpm = Math.max(todayProgress.wpm, result.wpm);
        todayProgress.accuracy = Math.round((todayProgress.accuracy * todayProgress.tests + result.accuracy) / (todayProgress.tests + 1));
        todayProgress.tests += 1;
        todayProgress.avgTime = (todayProgress.avgTime * (todayProgress.tests - 1) + result.duration) / todayProgress.tests;
      } else {
        weeklyProgress.push({
          date: today,
          wpm: result.wpm,
          accuracy: result.accuracy,
          tests: 1,
          avgTime: result.duration
        });
      }
      
      // Keep only last 14 days
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const filteredProgress = weeklyProgress.filter(p => new Date(p.date) >= fourteenDaysAgo);
      
      // Update time of day performance
      const timePerformance = { ...prev.timeOfDayPerformance };
      if (timePerformance[timeOfDay]) {
        const existing = timePerformance[timeOfDay];
        timePerformance[timeOfDay] = {
          wpm: Math.round((existing.wpm * existing.count + result.wpm) / (existing.count + 1)),
          accuracy: Math.round((existing.accuracy * existing.count + result.accuracy) / (existing.count + 1)),
          count: existing.count + 1
        };
      } else {
        timePerformance[timeOfDay] = {
          wpm: result.wpm,
          accuracy: result.accuracy,
          count: 1
        };
      }
      
      // Calculate advanced metrics
      const consistencyScore = calculateConsistency(newRecentResults);
      const improvementRate = calculateImprovementRate(newRecentResults);
      const errorPatterns = analyzeErrorPatterns(newRecentResults);
      
      // Determine skill level
      const skillLevel = calculateSkillLevel(avgWPM, avgAccuracy);
      
      const newAnalytics = {
        ...prev,
        testsToday: isNewDay ? 1 : prev.testsToday + 1,
        bestWPM: Math.max(prev.bestWPM, result.wpm),
        averageWPM: avgWPM,
        averageAccuracy: avgAccuracy,
        totalTests: prev.totalTests + 1,
        totalTypingTime: prev.totalTypingTime + (result.duration / 60),
        recentResults: newRecentResults,
        lastTestDate: today,
        weeklyProgress: filteredProgress,
        consistencyScore,
        improvementRate,
        errorPatterns,
        timeOfDayPerformance: timePerformance,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        perfectAccuracyTests: prev.perfectAccuracyTests + (result.accuracy === 100 ? 1 : 0),
        personalBests: newPersonalBests,
        skillLevel,
        improvementAreas: [] as string[],
        dynamicTips: [] as string[],
        nextGoal: ''
      };
      
      // Generate dynamic content
      newAnalytics.improvementAreas = generateImprovementAreas(newAnalytics);
      newAnalytics.dynamicTips = generateDynamicTips(newAnalytics);
      newAnalytics.nextGoal = generateNextGoal(newAnalytics);
      
      return newAnalytics;
    });
  }, [calculateConsistency, calculateImprovementRate, analyzeErrorPatterns, calculateSkillLevel, generateImprovementAreas, generateDynamicTips, generateNextGoal]);

  const resetAnalytics = useCallback(() => {
    setAnalytics(defaultAnalytics);
    localStorage.removeItem('typingAnalyticsV2');
  }, []);

  return {
    analytics,
    addTestResult,
    resetAnalytics
  };
};
