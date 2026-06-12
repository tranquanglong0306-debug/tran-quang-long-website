import React, { useState, useEffect, Suspense } from 'react';
import Scene from './components/Scene';
import InfoPanel from './components/InfoPanel';
import HeroSection from './components/HeroSection';
import WebGLErrorBoundary from './components/ui/WebGLErrorBoundary';
import AdminDashboard from './components/AdminDashboard';
import { useAppState } from './store';

export const App: React.FC = () => {
  const { activePanel, setActivePanel } = useAppState();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(window.location.pathname === '/admin');
  }, []);
  
  // Responsive states
  const [dimensions, setDimensions] = useState({
    isMobile: false,
    isTablet: false
  });

  // Cursor coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDimensions({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024
      });
    };

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

  // Track Mouse movement globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("canvas") ||
        target.closest("[role='button']") ||
        target.classList.contains("nav-item");

      setCursorHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Smooth lagging trail animation (lerp)
  useEffect(() => {
    let animId: number;
    const updateTrail = () => {
      setTrailPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16
        };
      });
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [mousePos]);

  const { isMobile, isTablet } = dimensions;

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  // Fallback layout when WebGL crashes or is not supported
  const webglFallbackLayout = (
    <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-8 bg-bg-dark">
      <div className="max-w-md text-center space-y-6 font-sans">
        <h2 className="text-2xl font-bold tracking-wider text-white">
          TRẦN QUANG LONG
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Trình duyệt hoặc thiết bị của bạn không hỗ trợ WebGL 3D, hoặc tính năng tăng tốc phần cứng bị tắt. 
          Bạn vẫn có thể tương tác với tất cả chuyên mục bằng cách chọn danh mục bên dưới.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={() => setActivePanel('about')} 
            className="px-4 py-3 bg-bg-secondary hover:bg-white/5 border border-border-subtle hover:border-accent-gold/50 text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer animate-none"
          >
            Giới thiệu
          </button>
          <button 
            onClick={() => setActivePanel('skills')} 
            className="px-4 py-3 bg-bg-secondary hover:bg-white/5 border border-border-subtle hover:border-accent-gold/50 text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer animate-none"
          >
            Kỹ năng
          </button>
          <button 
            onClick={() => setActivePanel('projects')} 
            className="px-4 py-3 bg-bg-secondary hover:bg-white/5 border border-border-subtle hover:border-accent-gold/50 text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer animate-none"
          >
            Dự án
          </button>
          <button 
            onClick={() => setActivePanel('blog')} 
            className="px-4 py-3 bg-bg-secondary hover:bg-white/5 border border-border-subtle hover:border-accent-gold/50 text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer animate-none"
          >
            Blog
          </button>
          <button 
            onClick={() => setActivePanel('contact')} 
            className="col-span-2 px-4 py-3 bg-bg-secondary hover:bg-white/5 border border-border-subtle hover:border-accent-gold/50 text-xs tracking-wider uppercase font-semibold text-white transition-all cursor-pointer animate-none"
          >
            Liên hệ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-bg-dark overflow-hidden select-none text-white font-sans">
      
      {/* Lagging Cursor Dot */}
      <div 
        className="hidden sm:block fixed pointer-events-none z-50 rounded-full bg-accent-gold w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      
      {/* Lagging Cursor Ring */}
      <div 
        className={`hidden sm:block fixed pointer-events-none z-50 rounded-full border border-accent-gold/30 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${cursorHovered ? 'w-10 h-10 border-accent-gold/60 bg-accent-gold/5 shadow-[0_0_15px_rgba(212,168,83,0.15)]' : 'w-7 h-7'}`}
        style={{ left: `${trailPos.x}px`, top: `${trailPos.y}px` }}
      />

      {/* Editorial HUD Header Overlay */}
      <header className="absolute top-8 left-8 z-30 pointer-events-none flex flex-col">
        <h1 className="text-xs font-bold tracking-[0.3em] text-white/90">
          TRẦN QUANG LONG
        </h1>
        <span className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase mt-0.5">
          Student Life · Applied Linguistics
        </span>
      </header>

      {/* ── Main Editorial Hero Section ── */}
      <HeroSection
        isMobile={isMobile}
        onExplore={() => setActivePanel('about')}
        onContact={() => setActivePanel('contact')}
      />

      {/* Minimal Helper Text HUD (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[8px] tracking-[0.35em] text-neutral-500 uppercase font-medium">
        Tương tác với các hình khối 3D để xem thông tin
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
