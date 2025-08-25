"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";
import lixerLogo from '@/assets/logos/Lixer.png';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  type WindowName = 'analytics' | 'Pools' | 'Stats' | 'WebSocket' | 'infos' | null;
  const [activeWindow, setActiveWindow] = useState<WindowName>(null);

  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      
      // Show different windows based on scroll position
      const windowHeight = window.innerHeight;
      const scrollPercentage = newScrollY / (document.documentElement.scrollHeight - windowHeight);
      
      // Initially no terminals, show them as we scroll
      if (scrollPercentage < 0.17) {
        setActiveWindow(null);
      } else if (scrollPercentage < 0.5) {
        setActiveWindow('Pools');
      } else if (scrollPercentage < 0.8) {
        setActiveWindow('Stats');
      } else if (scrollPercentage < 0.9) {
        setActiveWindow('WebSocket');
      } else {
        setActiveWindow('infos');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* First Section - Opening Statement */}

      {/* Second Section with Code Editor */}
      <motion.section
        className="min-h-screen flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-gray-300 mb-6">
            Integrate, analyze, and launch <br />
            without the <span className="text-white">complexity</span>.
          </h2>
        </div>

        {/* Code Editor Interface */}
        <div className="w-full max-w-4xl">
          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
            {/* Mac Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center text-gray-400 text-xs">
                <span className="mr-1"></span>
                <span>workspace</span>
              </div>
              <div className="w-16"></div>
            </div>

            <div className="flex">
              {/* Main Code Area */}
              <div className="flex-1 p-4">
                <div className="font-mono text-xs leading-5">
                  
                  <div className="text-gray-500">2   <span className="text-purple-400">import</span> <span className="text-blue-300">React</span>, <span className="text-blue-300">{'{ useState, useEffect }'}</span> <span className="text-purple-400">from</span> <span className="text-green-300">react</span>;</div>
                  <div className="text-gray-500">3   <span className="text-purple-400">import</span> <span className="text-blue-300">{'{ Lixer }'}</span> <span className="text-purple-400">from</span> <span className="text-green-300">'@lixer/sdk'</span>;</div>
                  <div className="text-gray-500">4</div>
                  <div className="text-gray-500">5   <span className="text-purple-400">const</span> <span className="text-blue-300">sdk</span> = <span className="text-yellow-300">new</span> <span className="text-blue-300">Lixer</span><span className="text-white">(</span><span className="text-green-300">'https://api.lixer.xyz'</span><span className="text-white">);</span></div>
                  <div className="text-gray-500">6</div>
                  <div className="text-gray-500">7   <span className="text-purple-400">async</span> <span className="text-purple-400">function</span> <span className="text-yellow-300">getPoolStats</span>() <span className="text-white">{'{'}</span></div>
                  <div className="text-gray-500">8     <span className="text-purple-400">const</span> <span className="text-blue-300">stats</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.stats.getPoolStats</span><span className="text-white">(</span><span className="text-green-300">'hyperswap'</span>, <span className="text-green-300">'0xPoolAddress'</span><span className="text-white">);</span></div>
                  <div className="text-gray-500">9     <span className="text-blue-300">console.log</span><span className="text-white">(</span><span className="text-blue-300">stats</span><span className="text-white">);</span></div>
                  <div className="text-gray-500">10  <span className="text-white">{'}'}</span></div>
                  <div className="text-gray-500">11</div>
                  <div className="text-gray-500">12  <span className="text-purple-400">getPoolStats</span>();</div>
                  <div className="text-gray-500">13</div>
                  <div className="text-gray-500">14  <span className="text-purple-400">async</span> <span className="text-purple-400">function</span> <span className="text-yellow-300">getRecentSwaps</span>() <span className="text-white">{'{'}</span></div>
                  <div className="text-gray-500">15    <span className="text-purple-400">const</span> <span className="text-blue-300">swaps</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.swaps.getRecentSwaps</span><span className="text-white">(</span><span className="text-green-300">'hyperswap'</span><span className="text-white">);</span></div>
                  <div className="text-gray-500">16    <span className="text-blue-300">console.log</span><span className="text-white">(</span><span className="text-blue-300">swaps</span><span className="text-white">);</span></div>
                  <div className="text-gray-500">17  <span className="text-white">{'}'}</span></div>
                  <div className="text-gray-500">18</div>
                  <div className="text-gray-500">19  <span className="text-purple-400">getRecentSwaps</span>();</div>
                  <div className="text-gray-500">20</div>
                  <div className="text-gray-500">21  <span className="text-purple-400">async</span> <span className="text-purple-400">function</span> <span className="text-yellow-300">getHealthStatus</span>() <span className="text-white">{'{'}</span></div>
                  <div className="text-gray-500">22    <span className="text-purple-400">const</span> <span className="text-blue-300">health</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.health.getStatus</span><span className="text-white">();</span></div>
                  <div className="text-gray-500">23    <span className="text-blue-300">console.log</span><span className="text-white">(</span><span className="text-blue-300">health</span><span className="text-white">);</span></div>
                  <div className="text-gray-500">24  <span className="text-white">{'}'}</span></div>
                 
                </div>
              </div>

              {/* Right Sidebar */}
     
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-1.5 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span>🔗 main</span>
                <span>Ln 17, Col 9</span>
                <span>Spaces: 2</span>
                <span>UTF-8</span>
                <span>TypeScript</span>
              </div>
              <div className="text-gray-500 text-xs">
                Cursor Tab   Ln 14 Col 9   Spaces: 2   UTF-8   TS   TypeScript   JSX   ⚡
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Third Section - Philosophy */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-gray-300">
            Instantly stream DEX swap events <br />
            for <span className="text-teal-300">dashboards, MEV bots</span>.
          </h2>
        </div>
      </motion.section>

      {/* Fourth Section - Hero */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-8">
             Built on Hyperliquid <br />
             powered by <span className="text-teal-300">Liquid Labs and Goldsky</span>.
          </h1>
        </div>
      </motion.section>

      {/* Simple Features */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-300 mb-16">
              Built for <span className="text-white">speed</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-light mb-4 text-white">Real-time</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Process millions of events with sub-second latency across all major DEXs.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-light mb-4 text-white">Simple</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                One API call to access liquidity data from hyperswap, SushiSwap, and 50+ protocols.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-light mb-4 text-white">Reliable</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                99.99% uptime with automatic failover and comprehensive monitoring.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-12">
            Start building <br />
            <span className="text-teal-300">today</span>.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/WebSocket"
              className="px-8 py-4 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors text-lg"
            >
              Get API Access
            </Link>
            <Link 
              href="/WebSocket"
              className="px-8 py-4 border border-gray-600 text-white font-medium rounded hover:border-gray-400 transition-colors text-lg"
            >
              Documentation
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={lixerLogo}
                width={24}
                height={24}
                alt="Lixer logo"
                className="h-6 w-auto"
              />
              <span className="text-gray-400 text-sm">Lixer</span>
            </div>
              <div className="text-gray-500 text-sm">
                © 2025 Lixer. Building DeFi infrastructure.
              </div>
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Navbar - macOS Dock Style */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {/* Dynamic Terminal Windows - Show when scrolling */}
        {activeWindow === 'Pools' && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 mb-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-600 w-80 h-48 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs">Pools</span>
                <div className="w-8"></div>
              </div>
              <div className="p-3 text-xs font-mono text-white">
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">pools</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.pools()</span>.<span className="text-blue-300">getAll</span>();</div>
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">poolSwaps</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.pools()</span>.<span className="text-blue-300">getSwaps</span>(<span className="text-green-300">'poolAddress'</span>, <span className="text-white">{'{'}</span><span className="text-orange-300"> limit: 10 </span><span className="text-white">{'}'}</span>);</div>
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">timeseries</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.pools()</span>.<span className="text-blue-300">getTimeSeries</span>(<span className="text-green-300">'poolAddress'</span>, <span className="text-white">{'{'}</span> interval: <span className="text-green-300">'hour'</span>, limit: <span className="text-orange-300">24</span> <span className="text-white">{'}'}</span>);</div>
              </div>
            </div>
          </div>
        )}

        {activeWindow === 'Stats' && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 mb-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-600 w-80 h-48 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs">Stats</span>
                <div className="w-8"></div>
              </div>
              <div className="p-3 text-xs font-mono text-white">
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">globalStats</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.stats()</span>.<span className="text-blue-300">getGlobal</span>();</div>
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">poolStats</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.stats()</span>.<span className="text-blue-300">getPool</span>(<span className="text-green-300">'poolAddress'</span>);</div>
              </div>
            </div>
          </div>
        )}

        {activeWindow === 'WebSocket' && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 mb-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-600 w-80 h-48 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs">WebSocket (Live Data) </span>
                <div className="w-8"></div>
              </div>
              <div className="p-3 text-xs font-mono text-white">
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">ws</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.websocket()</span>.<span className="text-blue-300">connect</span>();</div>
                <div>
  <span className="text-blue-300">ws</span>.<span className="text-blue-300">on</span>(
    <span className="text-green-300">'message'</span>, 
    (<span className="text-blue-300">msg</span>) =&gt; <span className="text-white">{'{'}</span>
  </div>
  <div className="pl-4">
    <span className="text-blue-300">console.log</span>(
      <span className="text-green-300">'Live update:'</span>, 
      <span className="text-blue-300">msg</span>
    );
  </div>
  <div>
    <span className="text-white">{'});'}</span>
  </div>
              </div>
            </div>
          </div>
        )}

        {activeWindow === 'infos' && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 mb-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-600 w-80 h-32 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs">Info</span>
                <div className="w-8"></div>
              </div>
              <div className="p-3 text-xs font-mono text-white">
                <div><span className="text-purple-400">const</span> <span className="text-blue-300">info</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">sdk.info()</span>;</div>
                <div><span className="text-blue-300">console.log</span>(<span className="text-blue-300">info</span>);</div>
              </div>
            </div>
          </div>
        )}

        {/* Vertical light beam cone effect emanating from dock */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary light beam cone */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-96 bg-gradient-to-t from-teal-500/50 to-transparent blur-2xl opacity-70"></div>
          {/* Secondary more focused beam */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-80 bg-gradient-to-t from-blue-500/40 to-transparent blur-xl opacity-60"></div>
          {/* Intense central beam */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-64 bg-gradient-to-t from-teal-400/60 to-transparent blur-lg opacity-80"></div>
        </div>

        {/* Main dock container */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-3 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-6 relative z-10">
            <Link href="/" className={`w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200 ${activeWindow ? 'shadow-[0_0_15px_rgba(20,184,166,0.7)]' : ''}`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </Link>
            
            <Link href="/WebSocket" className={`w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200 ${activeWindow === 'WebSocket' ? 'ring-1 ring-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.7)]' : ''}`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </Link>
            
            <Link href="/api" className={`w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200 ${activeWindow === 'Stats' ? 'ring-1 ring-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.7)]' : ''}`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z"/>
              </svg>
            </Link>
            
            <Link href="/dashboard" className={`w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200 ${activeWindow === 'Pools' ? 'ring-1 ring-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.7)]' : ''}`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </Link>
            
            <Link href="/settings" className={`w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200 ${activeWindow === 'infos' ? 'ring-1 ring-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.7)]' : ''}`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
          {/* Enhanced teal glow effect inside dock */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-600/30 via-blue-500/20 to-transparent"></div>
        </div>
      </nav>
    </div>
  );
}
