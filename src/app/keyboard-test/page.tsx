'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface KeyStats {
  key: string;
  pressed: boolean;
  pressCount: number;
  responseTime: number;
  lastPressed: number;
}

export default function KeyboardTestPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [keyStats, setKeyStats] = useState<Map<string, KeyStats>>(new Map());
  const [currentKey, setCurrentKey] = useState<string>('');
  const [totalKeysPressed, setTotalKeysPressed] = useState(0);
  const [averageResponseTime, setAverageResponseTime] = useState(0);
  const [testDuration, setTestDuration] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Keyboard layout configuration
  const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
  ];

  const specialKeys = ['Backspace', 'Tab', 'CapsLock', 'Enter', 'Shift', 'Ctrl', 'Alt', 'Space'];

  useEffect(() => {
    setIsLoaded(true);
    let interval: NodeJS.Timeout;
    
    if (testStarted) {
      interval = setInterval(() => {
        setTestDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStarted]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    const key = event.key.toLowerCase();
    const timestamp = Date.now();
    
    if (!testStarted) {
      setTestStarted(true);
    }

    setPressedKeys(prev => new Set(prev).add(key));
    setCurrentKey(key);

    setKeyStats(prev => {
      const newStats = new Map(prev);
      const existing = newStats.get(key);
      const responseTime = existing ? timestamp - existing.lastPressed : 0;
      
      newStats.set(key, {
        key,
        pressed: true,
        pressCount: (existing?.pressCount || 0) + 1,
        responseTime: responseTime > 0 ? responseTime : 0,
        lastPressed: timestamp
      });
      
      return newStats;
    });

    setTotalKeysPressed(prev => prev + 1);

    // Calculate average response time
    const allStats = Array.from(keyStats.values());
    const validResponseTimes = allStats.filter(stat => stat.responseTime > 0);
    if (validResponseTimes.length > 0) {
      const avgTime = validResponseTimes.reduce((sum, stat) => sum + stat.responseTime, 0) / validResponseTimes.length;
      setAverageResponseTime(avgTime);
    }
  }, [keyStats, testStarted]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    setCurrentKey('');
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const resetTest = () => {
    setTestStarted(false);
    setKeyStats(new Map());
    setTotalKeysPressed(0);
    setAverageResponseTime(0);
    setTestDuration(0);
    setPressedKeys(new Set());
    setCurrentKey('');
  };

  const getKeyStatus = (key: string) => {
    const normalizedKey = key.toLowerCase();
    const stat = keyStats.get(normalizedKey);
    const isPressed = pressedKeys.has(normalizedKey);
    
    if (isPressed) return 'pressed';
    if (stat && stat.pressCount > 0) return 'tested';
    return 'untested';
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace': return 'w-24';
      case 'Tab': return 'w-20';
      case 'CapsLock': return 'w-24';
      case 'Enter': return 'w-28';
      case 'Shift': return 'w-32';
      case 'Space': return 'w-80';
      case 'Ctrl': case 'Alt': return 'w-16';
      default: return 'w-12';
    }
  };

  const testedKeysCount = keyStats.size;
  const totalKeys = keyboardLayout.flat().length;
  const completionPercentage = (testedKeysCount / totalKeys) * 100;

  return (
    <main className="min-h-screen bg-black text-white relative font-mono overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950"></div>
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* Back Button */}
        <div className="px-6 py-4">
          <Link 
            href="/modes"
            className="group inline-flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-500 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-500">
              <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
            </div>
            <span className="font-mono text-sm group-hover:underline underline-offset-4">Back to Modes</span>
          </Link>
        </div>

        {/* Main Content */}
        <section className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className={`text-center mb-12 transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <div className="relative inline-block mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-300 font-mono">
                  KEYBOARD TESTER
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-white/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <p className="text-lg md:text-xl text-gray-300 font-mono max-w-2xl mx-auto leading-relaxed mb-8">
                Press any key to test your keyboard functionality
              </p>

              {/* Status Bar */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md rounded-xl px-4 py-2">
                  <div className="text-sm font-mono">
                    <span className="text-blue-400">KEYS TESTED: </span>
                    <span className="text-white">{testedKeysCount}/{totalKeys}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md rounded-xl px-4 py-2">
                  <div className="text-sm font-mono">
                    <span className="text-blue-400">PRESSES: </span>
                    <span className="text-white">{totalKeysPressed}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md rounded-xl px-4 py-2">
                  <div className="text-sm font-mono">
                    <span className="text-blue-400">TIME: </span>
                    <span className="text-white">{Math.floor(testDuration / 60)}:{(testDuration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-mono text-gray-400">Progress</span>
                  <span className="text-sm font-mono text-white">{completionPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Keyboard Layout */}
            <div className={`transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'}`}>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl p-8 max-w-5xl mx-auto">
                <div className="space-y-3">
                  {keyboardLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center space-x-1">
                      {row.map((key, keyIndex) => {
                        const status = getKeyStatus(key);
                        const keyWidth = getKeyWidth(key);
                        const stat = keyStats.get(key.toLowerCase());
                        
                        return (
                          <div
                            key={`${rowIndex}-${keyIndex}`}
                            className={`
                              ${keyWidth} h-12 relative rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-mono font-bold
                              ${status === 'pressed' 
                                ? 'bg-blue-400 border-blue-300 text-black scale-95 shadow-lg shadow-blue-400/50' 
                                : status === 'tested'
                                ? 'bg-green-500/20 border-green-400/50 text-green-300 hover:bg-green-500/30'
                                : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                              }
                            `}
                          >
                            <span className="relative z-10">
                              {specialKeys.includes(key) ? key : key.toUpperCase()}
                            </span>
                            
                            {/* Press count indicator */}
                            {stat && stat.pressCount > 0 && (
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-black font-bold">
                                {stat.pressCount > 9 ? '9+' : stat.pressCount}
                              </div>
                            )}
                            
                            {/* Glow effect for active key */}
                            {status === 'pressed' && (
                              <div className="absolute inset-0 rounded-lg bg-blue-400/30 blur-md"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="mt-8 text-center">
                  {!testStarted ? (
                    <p className="text-gray-400 font-mono text-lg">
                      🎯 Press any key to start testing
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-white font-mono">
                        {currentKey ? `Last pressed: ${currentKey.toUpperCase()}` : 'Keep testing your keys!'}
                      </p>
                      <p className="text-gray-400 font-mono text-sm">
                        Green keys have been tested • Blue indicates active press
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics Panel */}
            {testStarted && (
              <div className={`mt-12 transition-all duration-1500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'}`}>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 backdrop-blur-md rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{testedKeysCount}</div>
                    <div className="text-sm text-gray-400 font-mono">Keys Tested</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-400/20 backdrop-blur-md rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{totalKeysPressed}</div>
                    <div className="text-sm text-gray-400 font-mono">Total Presses</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-400/20 backdrop-blur-md rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-gray-400 mb-2">
                      {averageResponseTime > 0 ? `${averageResponseTime.toFixed(0)}ms` : '--'}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">Avg Response</div>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={resetTest}
                    className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/25"
                  >
                    <span>Reset Test</span>
                    <span className="transition-transform duration-300 group-hover:rotate-180">🔄</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
      `}</style>
    </main>
  );
}
