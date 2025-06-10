'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ModesPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  
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

  const gameModes = [
    {
      id: 'practice',
      title: 'Practice Hub',
      subtitle: 'FREE PLAY',
      description: 'Hone your skills with unlimited practice sessions. Perfect for beginners and pros alike.',
      icon: '◎',
      color: 'blue',
      difficulty: 'BEGINNER',
      features: ['Unlimited attempts', 'Custom texts', 'Personal progress'],
      href: '/test',
      available: true,
      stats: { players: '75K+', completion: '95%' }
    },
    {
      id: 'challenges',
      title: 'Daily Challenges',
      subtitle: 'COMPETE',
      description: 'Take on daily challenges and compete with typists around the world for glory.',
      icon: '◆',
      color: 'orange',
      difficulty: 'ADVANCED',
      features: ['Daily rewards', 'Global leaderboard', 'Special achievements'],
      href: '/challenges',
      available: false,
      stats: { players: '12K+', completion: '78%' }
    },
    {
      id: 'rankings',
      title: 'Global Rankings',
      subtitle: 'ELITE',
      description: 'Compete in ranked matches and climb the global leaderboard to typing mastery.',
      icon: '◉',
      color: 'purple',
      difficulty: 'EXPERT',
      features: ['Ranked matches', 'ELO system', 'Champion rewards'],
      href: '/rankings',
      available: false,
      stats: { players: '3K+', completion: '45%' }
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white relative font-mono overflow-hidden">
      {/* Enhanced Background with Grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950"></div>
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>
      
      {/* Floating Geometric Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        />
        <div 
          className="absolute top-3/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-80 animate-bounce"
          style={{ 
            transform: `translate(${-scrollY * 0.15}px, ${scrollY * 0.08}px)`,
            animationDelay: '0.5s'
          }}
        />
        <div 
          className="absolute top-1/2 left-3/4 w-4 h-4 border-2 border-blue-300/50 rotate-45 animate-spin"
          style={{ 
            transform: `rotate(${45 + scrollY * 0.1}deg) translate(${-scrollY * 0.1}px, ${scrollY * 0.12}px)`,
            animationDuration: '8s'
          }}
        />
      </div>
      
      {/* Enhanced Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/3 rounded-full blur-2xl animate-float-slow" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* Back Button */}
        <div className="px-6 py-4">
          <Link 
            href="/"
            className="group inline-flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-500 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-500">
              <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
            </div>
            <span className="font-mono text-sm group-hover:underline underline-offset-4">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Enhanced Header with Gaming Style */}
            <div className={`text-center mb-16 transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <div className="relative inline-block mb-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-300 font-mono relative z-10">
                  SELECT MODE
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-white/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Gaming Style Decorations */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-blue-400/50"></div>
                <div className="absolute -top-4 -right-4 w-8 h-8 border-r-4 border-t-4 border-blue-400/50"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-4 border-b-4 border-blue-400/50"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-4 border-b-4 border-blue-400/50"></div>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 font-mono max-w-3xl mx-auto leading-relaxed">
                Choose your path to typing mastery
              </p>
              
              {/* Status Bar */}
              <div className="mt-8 flex justify-center">
                <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md rounded-xl px-6 py-3">
                  <div className="flex items-center space-x-4 text-sm font-mono">
                    <span className="text-green-400">◉ ONLINE</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-blue-300">PLAYERS: 90,247</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-white">SERVER: OPTIMAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Mode Selection Grid */}
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
                {gameModes.map((mode, index) => (
                  <div
                    key={mode.id}
                    className={`game-mode-card transition-all duration-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'}`}
                    style={{ animationDelay: `${index * 300}ms` }}
                    onMouseEnter={() => setHoveredMode(mode.id)}
                    onMouseLeave={() => setHoveredMode(null)}
                  >
                    {mode.available ? (
                      <Link href={mode.href} className="block h-full">
                        <GameModeCard 
                          mode={mode} 
                          isSelected={selectedMode === mode.id}
                          isHovered={hoveredMode === mode.id}
                        />
                      </Link>
                    ) : (
                      <div className="cursor-not-allowed h-full">
                        <GameModeCard 
                          mode={mode} 
                          isSelected={selectedMode === mode.id}
                          isHovered={hoveredMode === mode.id}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Keyboard Test Card */}
              <div className={`mt-16 max-w-4xl mx-auto transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ animationDelay: '900ms' }}>
                {/* Section Divider */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                  <div className="px-4 text-xs font-mono text-gray-400 tracking-widest">DIAGNOSTIC</div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
                </div>

                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl overflow-hidden group hover:border-white/30 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      {/* Left Section */}
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-500/10 to-gray-600/20 border border-gray-400/20 rounded-xl flex items-center justify-center text-3xl text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          ⌨️
                        </div>
                        <div>
                          <div className="text-xs font-bold tracking-widest text-gray-400 mb-1">UTILITY</div>
                          <h3 className="text-xl font-bold text-white font-mono mb-1">Keyboard Tester</h3>
                          <p className="text-gray-400 text-sm font-mono">Test if all your keyboard keys are working properly</p>
                        </div>
                      </div>
                      
                      {/* Right Section */}
                      <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex items-center space-x-4 text-xs font-mono text-gray-400">
                          <span className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span>INSTANT</span>
                          </span>
                          <span>•</span>
                          <span>FREE</span>
                        </div>
                        
                        <Link href="/keyboard-test">
                          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-black text-sm font-bold rounded-lg group-hover:scale-105 transition-all duration-300">
                            <span>TEST NOW</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .game-mode-card {
          height: 500px;
          perspective: 1000px;
        }

        @media (max-width: 768px) {
          .game-mode-card {
            height: 450px;
          }
        }
      `}</style>
    </main>
  );
}

// Enhanced Game Mode Card Component
interface GameMode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  features: string[];
  href: string;
  available: boolean;
  stats: { players: string; completion: string };
}

function GameModeCard({ mode, isSelected, isHovered }: { 
  mode: GameMode; 
  isSelected: boolean;
  isHovered: boolean;
}) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          accent: 'from-blue-400 to-blue-600',
          glow: 'shadow-blue-400/20',
          text: 'text-blue-300',
          bg: 'from-blue-500/5 to-blue-600/10'
        };
      case 'orange':
        return {
          accent: 'from-orange-400 to-orange-600',
          glow: 'shadow-orange-400/20',
          text: 'text-orange-300',
          bg: 'from-orange-500/5 to-orange-600/10'
        };
      case 'purple':
        return {
          accent: 'from-purple-400 to-purple-600',
          glow: 'shadow-purple-400/20',
          text: 'text-purple-300',
          bg: 'from-purple-500/5 to-purple-600/10'
        };
      default:
        return {
          accent: 'from-gray-400 to-gray-600',
          glow: 'shadow-gray-400/20',
          text: 'text-gray-300',
          bg: 'from-gray-500/5 to-gray-600/10'
        };
    }
  };

  const colors = getColorClasses(mode.color);

  return (
    <div className={`h-full relative bg-gradient-to-br from-white/5 to-white/[0.02] border backdrop-blur-md overflow-hidden transition-all duration-500 transform-gpu group ${
      mode.available 
        ? `hover:scale-105 cursor-pointer ${
            isHovered ? `border-white/30` : 'border-white/10'
          } ${isSelected ? 'scale-105' : ''}` 
        : 'opacity-60 cursor-not-allowed border-white/5'
    }`} style={{ transform: 'skewY(-4deg)', borderRadius: '0.75rem' }}>
      
      {/* Hover Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-center" style={{ transform: 'skewY(4deg)' }}>
        
        {/* Icon */}
        <div className={`text-8xl mb-6 transition-all duration-500 ${colors.text} ${
          isHovered ? 'scale-110' : ''
        }`}>
          {mode.icon}
        </div>
        
        {/* Title Section */}
        <div className="mb-4">
          <div className={`text-xs font-bold tracking-widest mb-2 ${colors.text} opacity-80`}>
            {mode.subtitle}
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">
            {mode.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs font-mono">
          {mode.description}
        </p>

        {/* Action */}
        <div className="mt-auto">
          {mode.available ? (
            <div className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${colors.accent} text-black text-sm font-bold rounded-lg transition-all duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}>
              <span>START</span>
              <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 text-gray-400 text-sm font-bold rounded-lg">
              <span>COMING SOON</span>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Border Accent */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${colors.accent} transform ${
        isHovered ? 'scale-x-100' : 'scale-x-0'
      } transition-transform duration-500 origin-center`}></div>
      
      {/* Availability Overlay */}
      {!mode.available && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-end justify-center pb-24 rounded-xl" style={{ transform: 'skewY(4deg)' }}>
          <div className="text-center">
            <div className="text-3xl mb-2 opacity-60">⬢</div>
            <div className="text-white/80 font-bold text-sm font-mono">LOCKED</div>
          </div>
        </div>
      )}
    </div>
  );
}
