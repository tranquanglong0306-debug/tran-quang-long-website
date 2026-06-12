import React, { useRef, useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import * as THREE from 'three';
import EarthCanvas from './canvas/EarthCanvas';

/* ======================================================================
   1.  THREE.JS STARFIELD — 15,000 particles, 3 depth layers, parallax
   ====================================================================== */
interface StarfieldProps {
  mouseNorm: { x: number; y: number }; // -1..1
  isMobile: boolean;
}

function StarfieldParticles({ mouseNorm, isMobile }: StarfieldProps) {
  const totalCount = isMobile ? 5000 : 15000;

  // Layer config: { count, zRange, size, parallaxFactor }
  const layers = useMemo(() => [
    { count: Math.floor(totalCount * 0.5),  zMin: -200, zMax: -80,  size: 0.9, pFactor: 0.02 }, // far
    { count: Math.floor(totalCount * 0.35), zMin: -80,  zMax: -20,  size: 1.4, pFactor: 0.05 }, // mid
    { count: Math.floor(totalCount * 0.15), zMin: -20,  zMax: -4,   size: 2.2, pFactor: 0.10 }, // near
  ], [totalCount]);

  // Generate buffers for each layer
  const layerData = useMemo(() => layers.map(({ count, zMin, zMax, size, pFactor }) => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);

      // Slightly tinted stars — blue/purple/white
      const roll = Math.random();
      if (roll < 0.1) { colors[i*3]=0.7; colors[i*3+1]=0.8; colors[i*3+2]=1.0; }   // blue
      else if (roll < 0.2) { colors[i*3]=1.0; colors[i*3+1]=0.85; colors[i*3+2]=0.7; } // warm
      else { colors[i*3]=1; colors[i*3+1]=1; colors[i*3+2]=1; }                        // white
    }
    return { positions, colors, baseSize: size, pFactor };
  }), [layers]);

  // Refs per layer
  const refs = [
    useRef<THREE.Points>(null!),
    useRef<THREE.Points>(null!),
    useRef<THREE.Points>(null!),
  ];

  const mouseRef = useRef(mouseNorm);
  useEffect(() => { mouseRef.current = mouseNorm; }, [mouseNorm]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.forEach((ref, idx) => {
      if (!ref.current) return;
      const { pFactor } = layerData[idx];
      // Gentle rotation drift
      ref.current.rotation.y = t * 0.005 * (idx + 1);
      // Mouse parallax translation
      ref.current.position.x = mouseRef.current.x * pFactor * 25;
      ref.current.position.y = mouseRef.current.y * pFactor * 15;
    });
  });

  return (
    <>
      {layerData.map((ld, idx) => (
        <points key={idx} ref={refs[idx]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={ld.positions}
              count={ld.positions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              array={ld.colors}
              count={ld.colors.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={ld.baseSize}
            vertexColors
            transparent
            opacity={0.85}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      ))}
    </>
  );
}

function StarfieldScene({ mouseNorm, isMobile }: StarfieldProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 80, near: 0.1, far: 1000 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
      dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
    >
      <StarfieldParticles mouseNorm={mouseNorm} isMobile={isMobile} />
    </Canvas>
  );
}

/* ======================================================================
   2.  FILM GRAIN OVERLAY — SVG feTurbulence animated
   ====================================================================== */
const FilmGrain: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-[3] opacity-[0.035] mix-blend-overlay"
    style={{ animation: 'grainShift 0.08s steps(1) infinite' }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  </div>
);

/* ======================================================================
   3.  NEBULA CLOUDS — 3 blurred gradient divs
   ====================================================================== */
const NebulaClouds: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
    {/* Cloud 1 — left purple */}
    <div
      className="absolute rounded-full"
      style={{
        width: '55vw', height: '55vw',
        top: '-10%', left: '-15%',
        background: 'radial-gradient(ellipse, rgba(60,0,120,0.28) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'nebulaDrift1 20s ease-in-out infinite',
      }}
    />
    {/* Cloud 2 — right cyan */}
    <div
      className="absolute rounded-full"
      style={{
        width: '50vw', height: '50vw',
        top: '20%', right: '-10%',
        background: 'radial-gradient(ellipse, rgba(0,70,140,0.22) 0%, transparent 70%)',
        filter: 'blur(70px)',
        animation: 'nebulaDrift2 24s ease-in-out infinite 4s',
      }}
    />
    {/* Cloud 3 — center gold tint */}
    <div
      className="absolute rounded-full"
      style={{
        width: '40vw', height: '40vw',
        bottom: '-5%', left: '30%',
        background: 'radial-gradient(ellipse, rgba(120,70,0,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'nebulaDrift3 28s ease-in-out infinite 8s',
      }}
    />
  </div>
);

/* ======================================================================
   4.  MAGNETIC BUTTON — attraction radius 12px on hover
   ====================================================================== */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}
const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, onClick, id }) => {
  const btnRef = useRef<HTMLButtonElement>(null!);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const magnetRadius = 60;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < magnetRadius) {
      const strength = (1 - dist / magnetRadius) * 12;
      setDelta({ x: (dx / dist) * strength, y: (dy / dist) * strength });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDelta({ x: 0, y: 0 });
  }, []);

  return (
    <motion.button
      id={id}
      ref={btnRef}
      className={className}
      animate={{ x: delta.x, y: delta.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

/* ======================================================================
   5.  SPLIT-TEXT TITLE — char-by-char GSAP reveal
   ====================================================================== */
const SplitTitle: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const chars = containerRef.current?.querySelectorAll('.hero-char');
    if (!chars?.length) return;

    gsap.set(chars, { opacity: 0, y: 40, rotateX: -40 });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  const handleHover = () => {
    const chars = containerRef.current?.querySelectorAll('.hero-char');
    if (!chars?.length) return;
    gsap.to(chars, {
      x: (i) => (Math.random() - 0.5) * 4,
      duration: 0.15,
      stagger: 0.02,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    });
  };

  return (
    <div
      ref={containerRef}
      className="hero-title-split"
      style={{ perspective: '600px', display: 'inline-block' }}
      onMouseEnter={handleHover}
    >
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="hero-char"
          style={{
            display: 'inline-block',
            whiteSpace: ch === ' ' ? 'pre' : 'normal',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
};

/* ======================================================================
   6.  SCROLL INDICATOR
   ====================================================================== */
const ScrollIndicator: React.FC<{ scrollY: number }> = ({ scrollY }) => (
  <motion.div
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
    animate={{ opacity: scrollY > 50 ? 0 : 1 }}
    transition={{ duration: 0.4 }}
  >
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '9px',
        letterSpacing: '0.3em',
        color: 'rgba(139,147,184,0.7)',
        fontWeight: 500,
      }}
    >
      SCROLL TO EXPLORE
    </span>
    <div className="flex flex-col items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-px bg-gradient-to-b from-[#ffd86b]/60 to-transparent"
          style={{
            height: i === 0 ? '20px' : i === 1 ? '14px' : '8px',
            animation: `scrollPulse 1.8s ease-in-out ${i * 0.25}s infinite`,
          }}
        />
      ))}
    </div>
  </motion.div>
);

/* ======================================================================
   7.  HERO SECTION — main export
   ====================================================================== */
interface HeroSectionProps {
  isMobile: boolean;
  onExplore?: () => void;
  onContact?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isMobile, onExplore, onContact }) => {
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseNorm({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('scroll',    handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll',    handleScroll);
    };
  }, []);

  return (
    <>
      {/* ── BACKGROUND LAYERS (behind 3D floating objects) ── */}
      <div
        className="hero-root absolute inset-0 z-[8] overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        {/* Layer 1: void gradient */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(135deg, #000000 0%, #020208 50%, #0a0e27 100%)',
          }}
        />
        {/* Layer 2: Nebula clouds */}
        <NebulaClouds />
        {/* Layer 3: THREE.js Starfield */}
        <div className="absolute inset-0 z-[4]">
          <Suspense fallback={null}>
            <StarfieldScene mouseNorm={mouseNorm} isMobile={isMobile} />
          </Suspense>
        </div>
        {/* Layer 4: Film grain */}
        <FilmGrain />
        {/* Layer 5: Vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* ── FOREGROUND LAYERS (above 3D floating objects) ── */}
      <div
        className="absolute inset-0 z-[22] overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        {/* Typography block */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 18px',
                borderRadius: '999px',
                background: 'rgba(255,216,107,0.06)',
                border: '1px solid rgba(255,216,107,0.35)',
                backdropFilter: 'blur(8px)',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.3em',
                color: 'rgba(255,216,107,0.85)',
                textTransform: 'uppercase' as const,
                whiteSpace: 'nowrap' as const,
              }}
            >
              {isMobile ? 'STUDENT LIFE OFFICER' : 'STUDENT LIFE OFFICER × MA APPLIED LINGUISTICS'}
            </span>
          </motion.div>

          {/* Main title */}
          <h1
            className="hero-main-title text-center mb-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              lineHeight: 1.02,
              background: 'linear-gradient(135deg, #ffd86b 0%, #ffe89e 40%, #f5f7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(255,216,107,0.3))',
              cursor: 'default',
            }}
          >
            <SplitTitle text="TRẦN QUANG LONG" />
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
              fontWeight: 300,
              color: 'rgba(200,210,255,0.8)',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            Nhà thám hiểm tri thức vũ trụ
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 400,
              color: '#8b93b8',
              maxWidth: '600px',
              textAlign: 'center',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}
          >
            Sinh viên ngành Ngôn ngữ học Ứng dụng · Cán bộ Đời sống Học sinh · Khám phá tại TP. Hồ Chí Minh
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            style={{
              display: 'flex',
              gap: '20px',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
            }}
          >
            <MagneticButton
              id="hero-cta-explore"
              className="hero-cta-primary"
              onClick={onExplore}
            >
              <span style={{ pointerEvents: 'none' }}>Khám phá hành trình →</span>
            </MagneticButton>
            <MagneticButton
              id="hero-cta-contact"
              className="hero-cta-ghost"
              onClick={onContact}
            >
              <span style={{ pointerEvents: 'none' }}>Liên hệ</span>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Rotating Earth */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1.8, ease: 'easeOut' }}
            className="absolute z-[14]"
            style={{
              width: 'min(18vw, 240px)',
              height: 'min(18vw, 240px)',
              bottom: '6%',
              right: '4%',
              filter: 'drop-shadow(0 0 30px rgba(79,195,247,0.25))',
              pointerEvents: 'none',
            }}
          >
            <Suspense fallback={null}>
              <EarthCanvas />
            </Suspense>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <ScrollIndicator scrollY={scrollY} />
      </div>
    </>
  );
};

export default HeroSection;
