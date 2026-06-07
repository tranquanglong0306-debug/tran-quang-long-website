import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle } from 'lucide-react';
import Scene from './components/Scene';
import InfoPanel from './components/InfoPanel';
import WebGLErrorBoundary from './components/ui/WebGLErrorBoundary';
import { useAppState } from './store';

export const App: React.FC = () => {
  const { activePanel, setActivePanel } = useAppState();
  
  // Responsive states
  const [dimensions, setDimensions] = useState({
    isMobile: false,
    isTablet: false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDimensions({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024
      });
    };

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePanel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActivePanel]);

  const { isMobile, isTablet } = dimensions;

  // Fallback layout when WebGL crashes or is not supported
  const webglFallbackLayout = (
    <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-8 bg-gradient-to-b from-[#050505] to-[#120722]">
      <div className="max-w-md text-center space-y-6 font-sans">
        <h2 className="text-4xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Hồ sơ Quang Long
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Trình duyệt hoặc thiết bị của bạn không hỗ trợ WebGL 3D, hoặc tính năng tăng tốc phần cứng bị tắt. 
          Bạn vẫn có thể tương tác với tất cả chuyên mục bằng cách chọn danh mục bên dưới.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={() => setActivePanel('about')} 
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer"
          >
            Giới thiệu
          </button>
          <button 
            onClick={() => setActivePanel('skills')} 
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer"
          >
            Kỹ năng
          </button>
          <button 
            onClick={() => setActivePanel('projects')} 
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-xl text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer"
          >
            Dự án
          </button>
          <button 
            onClick={() => setActivePanel('contact')} 
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-xl text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer"
          >
            Liên hệ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-[#050505] to-[#1a0b2e] overflow-hidden select-none text-white font-sans">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />

      {/* Futuristic HUD Header Overlay */}
      <header className="absolute top-6 left-6 z-30 pointer-events-none flex flex-col space-y-1">
        <h1 className="text-sm font-extrabold tracking-[0.25em] text-white/95">
          TRAN QUANG LONG
        </h1>
        <p className="text-[9px] font-bold tracking-[0.3em] text-neutral-500 uppercase">
          Đời sống Học sinh & Ngôn ngữ học Ứng dụng
        </p>
      </header>

      {/* Metadata / Coordinates HUD Overlay (Top Right) */}
      <div className="absolute top-6 right-6 z-30 pointer-events-none text-right flex flex-col space-y-1 hidden sm:flex">
        <span className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase font-bold flex items-center justify-end gap-1.5">
          <Sparkles className="w-3 h-3 text-purple-400" />
          Trải nghiệm Không gian 3D
        </span>
        <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
          LOC: 10.7769° N, 106.7009° E
        </span>
      </div>

      {/* Center Title and Breathing Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center px-4"
        >
          {/* Glassmorphic Container with Subtle Glow & Infinite Breathing scale */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="px-8 py-5 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.02)] flex flex-col items-center justify-center space-y-1 max-w-[90vw]"
          >
            <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white font-sans text-center bg-clip-text bg-gradient-to-r from-white via-white to-neutral-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]">
              Quang Long
            </h2>
            <p className="text-[10px] sm:text-xs tracking-[0.4em] text-neutral-400 uppercase font-bold text-center">
              HỒ SƠ NĂNG LỰC
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Helper Text HUD (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center space-x-1.5 text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-bold">
        <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
        <span>Click các hình khối để khám phá</span>
      </div>

      {/* 3D WebGL Canvas Scene */}
      <WebGLErrorBoundary fallback={webglFallbackLayout}>
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} isTablet={isTablet} />
        </Suspense>
      </WebGLErrorBoundary>

      {/* Sliding Information Panel (Modal Drawer) */}
      <InfoPanel isMobile={isMobile} isTablet={isTablet} />

    </div>
  );
};

export default App;
