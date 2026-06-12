import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ======================================================================
   SCROLL INDICATOR
   ====================================================================== */
interface ScrollIndicatorProps {
  scrollY: number;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollY }) => (
  <motion.div
    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
    animate={{ opacity: scrollY > 50 ? 0 : 1 }}
    transition={{ duration: 0.4 }}
  >
    <span className="text-[9px] tracking-[0.35em] text-gray-muted/65 uppercase font-medium">
      Scroll
    </span>
    <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full bg-accent-gold scroll-line-animation" />
    </div>
  </motion.div>
);

/* ======================================================================
   HERO SECTION
   ====================================================================== */
interface HeroSectionProps {
  isMobile: boolean;
  onExplore?: () => void;
  onContact?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isMobile, onExplore, onContact }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[100vh] flex flex-col justify-center items-center overflow-hidden bg-bg-dark">
      {/* ── BACKGROUND LAYERS (solid, dot grid, subtle corner gradient) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* CSS Dot Grid */}
        <div className="absolute inset-0 dot-grid opacity-60" />
        {/* Corner Blur */}
        <div className="absolute inset-0 corner-blur" />
      </div>

      {/* ── FOREGROUND CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl">
        
        {/* Label Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-4"
        >
          <span className="editorial-label text-[10px] tracking-[0.45em] text-accent-gold">
            {isMobile ? 'EDUCATOR × LINGUIST' : 'EDUCATOR × LINGUIST × AI RESEARCHER'}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="editorial-title text-center tracking-tight mb-6 leading-none"
          style={{
            fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
          }}
        >
          TRẦN QUANG LONG
        </motion.h1>

        {/* Fine gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-[1px] bg-accent-gold mb-6"
        />

        {/* Subtitle / Statement */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="editorial-body max-w-xl text-center leading-relaxed mb-10 text-gray-light"
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            fontWeight: 300,
          }}
        >
          Điều hướng tri thức nơi giao thoa giữa ngôn ngữ, công nghệ và sự phát triển con người.
        </motion.p>

        {/* Action Links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-10"
        >
          <button
            onClick={onExplore}
            className="text-accent-gold text-sm tracking-wider uppercase font-medium hover:underline transition-all duration-200 cursor-pointer"
          >
            Khám phá →
          </button>
          
          <button
            onClick={onContact}
            className="text-gray-muted hover:text-fg-light text-sm tracking-wider uppercase font-medium hover:underline transition-all duration-200 cursor-pointer"
          >
            Liên hệ
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator scrollY={scrollY} />
    </div>
  );
};

export default HeroSection;
