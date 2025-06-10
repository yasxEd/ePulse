'use client'
import React, { useState, useEffect } from 'react';
import TestContainer from '@/components/TestContainer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function TestPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  
  useEffect(() => {
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
    <main className="min-h-screen bg-black text-white relative font-mono">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950"></div>
      
      {/* Floating Geometric Elements - only show when test not started */}
      {!testStarted && (
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
      )}
      
      {/* Floating Orbs - only show when test not started */}
      {!testStarted && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-float-delayed" />
        </div>
      )}
      
      {/* Mouse Follower - only show when test not started */}
      {!testStarted && (
        <div 
          className="fixed w-80 h-80 bg-gradient-radial from-blue-500/6 to-transparent rounded-full pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: mousePosition.x - 160,
            top: mousePosition.y - 160,
          }}
        />
      )}

      <div className="relative z-10 min-h-screen">
        {/* Navbar - only show when test not started */}
        {!testStarted && <Navbar />}

        {/* Back Button */}
        {!testStarted && (
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
        )}

        {/* Main Content */}
        <section className={`${testStarted ? 'py-0' : 'py-8'} px-6`}>
          <div className="max-w-7xl mx-auto">
            {/* Test Container */}
            <div className="relative mb-12">
              <div className="relative z-10">
                <TestContainer 
                  onTestStart={() => setTestStarted(true)}
                  onTestEnd={() => setTestStarted(false)}
                  testStarted={testStarted}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer - only show when test not started */}
        {!testStarted && <Footer />}
      </div>

      {/* Custom Styles */}
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}