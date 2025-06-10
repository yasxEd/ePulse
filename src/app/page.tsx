'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => setScrollY(window.scrollY)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white relative font-mono">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950"></div>
      
      {/* Floating Geometric Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-80"
          style={{ transform: `translate(${-scrollY * 0.15}px, ${scrollY * 0.08}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-3/4 w-3 h-3 border border-blue-300/30 rotate-45"
          style={{ transform: `rotate(${45 + scrollY * 0.1}deg) translate(${-scrollY * 0.1}px, ${scrollY * 0.12}px)` }}
        ></div>
      </div>
      
      {/* Improved Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gray-500/6 rounded-full blur-2xl animate-float-slow"></div>
      </div>
      
      {/* Enhanced Mouse Follower */}
      <div 
        className="fixed w-80 h-80 bg-gradient-radial from-blue-500/8 to-transparent rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      ></div>

      <div className="relative z-10 min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 py-10 min-h-[75vh]">
          <div className="max-w-7xl w-full">
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left Column - Text Content */}
              <div className={`transition-all duration-1200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <div className="relative inline-block mb-8">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-mono">
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-300 hover:from-blue-200 hover:via-gray-100 hover:to-blue-200 transition-all duration-700">
                      e
                    </span>
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-white hover:from-gray-100 hover:via-blue-300 hover:to-gray-100 transition-all duration-700">
                      Pulse
                    </span>
                  </h1>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-white/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <p className={`text-lg md:text-xl text-gray-300 mb-12 leading-relaxed font-light transition-all duration-1200 delay-200 font-mono ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                  Master the art of typing through{' '}
                  <span className="relative inline-block text-blue-300 font-medium border-b border-blue-400/50">
                    immersive visualization
                  </span>
                  {' '}and{' '}
                  <span className="relative inline-block text-white font-medium border-b border-white/50">
                    intelligent insights
                  </span>
                </p>
                
                {/* Enhanced Tags */}
                <div className={`flex flex-wrap gap-4 mb-12 transition-all duration-1200 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                  {[
                    { text: 'Real-time', color: 'blue' },
                    { text: 'Adaptive', color: 'white' },
                    { text: 'Precise', color: 'gray' }
                  ].map((tag, index) => (
                    <div 
                      key={tag.text}
                      className={`group px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-md text-gray-200 rounded-full text-sm font-medium hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-500 cursor-default hover:scale-110 hover:-translate-y-1 font-mono`}
                      style={{ animationDelay: `${600 + index * 150}ms` }}
                    >
                      <span className="relative z-10">{tag.text}</span>
                      <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className={`transition-all duration-1200 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                  <Link
                    href="/modes"
                    className="group relative inline-block hover:scale-110 transition-all duration-500"
                  >
                    <div className="relative px-12 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl font-mono">
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 bg-size-200 animate-gradient group-hover:animate-gradient-fast"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white to-blue-500 blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      
                      {/* Button Content */}
                      <span className="relative z-10 flex items-center space-x-3 text-black">
                        <span>Begin Your Journey</span>
                        <span className="group-hover:translate-x-2 transition-transform duration-300 text-xl">→</span>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Column - Keyboard Video */}
              <div className={`relative transition-all duration-1500 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                <div className="relative group">
                  {/* Video Only */}
                  <video
                    src="/keyAnimation.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-10"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white mb-6 font-mono">
                Why Choose ePulse?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
                Experience the future of typing practice with cutting-edge features designed for rapid improvement
              </p>
            </div>

            {/* Features Grid */}
            <div className={`transition-all duration-1200 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: '◆', title: 'Live Keyboard', desc: 'Every keystroke visualized in real-time with smooth animations', color: 'blue', delay: 0 },
                  { icon: '◊', title: 'Smart Analytics', desc: 'AI-driven insights to identify and improve weak points', color: 'white', delay: 100 },
                  { icon: '※', title: 'Precision Mode', desc: 'Targeted exercises for maximum improvement efficiency', color: 'gray', delay: 200 },
                  { icon: '◈', title: 'Progress Boost', desc: 'Gamified learning with achievements and milestones', color: 'blue', delay: 300 }
                ].map((feature, index) => (
                  <div 
                    key={feature.title}
                    className={`group relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md rounded-2xl hover:from-white/10 hover:to-white/5 hover:border-white/30 transition-all duration-700 hover:scale-105 hover:-translate-y-4 cursor-pointer overflow-hidden`}
                    style={{ animationDelay: `${800 + feature.delay}ms` }}
                  >
                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-xl mb-4 text-white group-hover:text-blue-200 transition-colors duration-300 font-mono">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300 font-mono">
                        {feature.desc}
                      </p>
                    </div>
                    
                    {/* Bottom Accent Line */}
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation & Stats Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Section Title */}
            <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white mb-12 font-mono">
              Get Started Today
            </h3>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: '75K+', label: 'Active Typists', sublabel: 'growing daily', icon: '◗' },
                { number: '2.5M+', label: 'Tests Completed', sublabel: 'this month', icon: '◑' },
                { number: '127%', label: 'Avg Improvement', sublabel: 'in 30 days', icon: '◇' }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 animate-fade-in`}
                  style={{ animationDelay: `${1000 + index * 150}ms` }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-blue-300 mb-2 group-hover:text-white transition-colors font-mono">
                    {stat.number}
                  </div>
                  <div className="text-white font-medium mb-1 font-mono">{stat.label}</div>
                  <div className="text-gray-500 text-sm font-mono">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
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
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
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
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
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
    </main>
  )
}