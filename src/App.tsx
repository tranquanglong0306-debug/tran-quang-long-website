import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scene from "./components/canvas/Scene";
import SidePanel from "./components/ui/SidePanel";
import NavHint from "./components/ui/NavHint";
import Loader from "./components/ui/Loader";
import WebGLErrorBoundary from "./components/ui/WebGLErrorBoundary";
import { SHAPES } from "./lib/constants";
import { BlogPost } from "./types";
import { X } from "lucide-react";
import MarkdownRenderer from "./components/ui/MarkdownRenderer";

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  
  // Loading Preloader states
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const cursorRef = useRef<HTMLDivElement>(null);

  // WebGL Support Detection
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(support);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  // Simulate loader progress
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 450); // Dismiss loader
          return 100;
        }
        return prev + 2.0; // Increment loader speed
      });
    }, 25);
    return () => clearInterval(timer);
  }, []);

  // Custom cursor movement and hover scaling
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "INPUT" ||
        target.closest("canvas") ||
        target.closest("[role='button']") ||
        target.classList.contains("nav-item");

      if (isInteractive) {
        cursorRef.current?.classList.add("scale-[2.8]", "bg-white/30");
      } else {
        cursorRef.current?.classList.remove("scale-[2.8]", "bg-white/30");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Keyboard navigation & global key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC close active panel
      if (e.key === "Escape") {
        setActiveSection(null);
      }

      // 2. Keyboard Navigation through shapes (when drawer is closed)
      if (activeSection === null) {
        const names = SHAPES.map((s) => s.label);

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          setHoveredSection((prev) => {
            if (!prev) return names[0];
            const currIdx = names.indexOf(prev);
            const nextIdx = (currIdx + 1) % names.length;
            return names[nextIdx];
          });
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          setHoveredSection((prev) => {
            if (!prev) return names[names.length - 1];
            const currIdx = names.indexOf(prev);
            const prevIdx = (currIdx - 1 + names.length) % names.length;
            return names[prevIdx];
          });
        } else if (e.key === "Enter" || e.key === " ") {
          if (hoveredSection) {
            e.preventDefault();
            setActiveSection(hoveredSection);
            setHoveredSection(null);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, hoveredSection]);

  // Framer Motion staggered letter animations for H1 hero
  const letterContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 110,
      },
    },
  };

  const webglFallbackLayout = (
    <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-8 bg-[#0B0B0C]">
      <div className="max-w-md text-center space-y-4 font-sans">
        <span className="meta text-accent">WebGL Acceleration Not Active</span>
        <h2 className="h2 text-white">Quang Long Portfolio</h2>
        <p className="body">
          Thiết bị hoặc trình duyệt của bạn không hỗ trợ tăng tốc WebGL 3D. Bạn vẫn có thể tương tác đầy đủ nội dung bằng mục lục phía dưới.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans select-none">
      {/* Accessibility Preloader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] flex flex-col justify-center items-center bg-[#0B0B0C] font-sans pointer-events-auto"
          >
            <div className="w-24 h-[1px] bg-white/10 overflow-hidden relative mb-4">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-1/2 h-full bg-accent absolute top-0"
              />
            </div>
            <span className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase num-tabular select-none pointer-events-none">
              Loading Workspace {Math.round(loadingProgress)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-nav"
        className="sr-only focus:not-sr-only fixed top-4 left-4 bg-accent text-white px-4 py-2 z-50 text-xs tracking-wider uppercase font-sans border border-white/20"
      >
        Skip to navigation
      </a>

      {/* Custom Cursor */}
      <div id="custom-cursor" ref={cursorRef} className="hidden sm:block pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0" />

      {/* Vignette depth overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] pointer-events-none z-0" />

      {/* HUD Header (Top Left) */}
      <header className="absolute top-8 left-8 z-30 pointer-events-auto flex flex-col gap-1">
        <h1 className="meta text-white font-semibold">
          TRAN QUANG LONG
        </h1>
        <p className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase">
          Student Life & Applied Linguistics
        </p>
      </header>

      {/* HUD Meta Information (Top Right) */}
      <div className="absolute top-8 right-8 z-30 pointer-events-none text-right flex flex-col gap-1 hidden md:flex">
        <span className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
          Active Theory / Concept
        </span>
        <span className="num-tabular text-[10px] text-neutral-400 font-mono">
          LOC: 10.7769° N, 106.7009° E
        </span>
      </div>

      {/* Focal Typography Title in the center (Under Canvas) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0 select-none">
        <div className="relative text-center">
          {/* Staggered letter reveal for title */}
          <motion.h2
            variants={letterContainerVariants}
            initial="hidden"
            animate={loading ? "hidden" : "visible"}
            className="center-hero-text opacity-[0.04] select-none flex justify-center"
          >
            {"QUANG LONG".split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>

          {/* Subtle hovered shape guidance text */}
          <div className="absolute -bottom-8 left-0 right-0 text-center h-4 transition-all duration-300">
            {hoveredSection && activeSection === null && (
              <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase animate-pulse">
                Press ENTER to explore {hoveredSection}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Scene or Fallback HTML */}
      {webglSupported ? (
        <WebGLErrorBoundary fallback={webglFallbackLayout}>
          <Suspense fallback={<Loader />}>
            <Scene
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              hoveredSection={hoveredSection}
              setHoveredSection={setHoveredSection}
            />
          </Suspense>
        </WebGLErrorBoundary>
      ) : (
        // WebGL Fallback HTML layout
        webglFallbackLayout
      )}

      {/* Side-Over HUD Navigation Menu (Bottom Right) */}
      <nav
        id="main-nav"
        className="absolute bottom-8 right-8 z-30 pointer-events-auto flex flex-col gap-3 text-right"
        aria-label="Side Navigation Menu"
      >
        {SHAPES.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.label)}
            onFocus={() => setHoveredSection(sec.label)}
            onBlur={() => setHoveredSection(null)}
            className={`nav-item text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-end gap-3 cursor-pointer focus:outline-none focus:text-accent ${
              activeSection?.toLowerCase() === sec.id || hoveredSection?.toLowerCase() === sec.id
                ? "text-white scale-105"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
            aria-label={`Mở phân mục ${sec.label}`}
          >
            <span className="num-tabular text-[9px] font-mono text-neutral-600">{sec.index}</span>
            <span>{sec.label}</span>
          </button>
        ))}
      </nav>

      {/* Accessibility Keyboard Navigation Hints */}
      <NavHint hoveredSection={hoveredSection} />

      {/* HUD Footers Tagline (Bottom Left) */}
      <footer className="absolute bottom-8 left-8 z-30 pointer-events-none hidden sm:block flex flex-col gap-1">
        <p className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase">
          Restorative justice • Affective filter hypothesis
        </p>
        <p className="text-[9px] tracking-[0.2em] text-neutral-600 uppercase num-tabular">
          © 2026 / PREVALENCE OF PRACTICE
        </p>
      </footer>

      {/* sliding Drawer content panels */}
      <SidePanel
        activeSection={activeSection}
        onClose={() => setActiveSection(null)}
        onSelectBlogPost={setSelectedBlog}
      />

      {/* Blog Detail Overlay Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
              aria-hidden="true"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-none p-8 z-10 shadow-2xl font-sans pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-blog-title"
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-1.5 border border-white/10 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close article modal"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                {selectedBlog.category} — {selectedBlog.date}
              </div>
              <h1 id="modal-blog-title" className="text-xl font-medium font-display text-white mb-6 leading-tight border-b border-white/5 pb-4">
                {selectedBlog.title}
              </h1>

              <div className="prose-custom">
                <MarkdownRenderer>{selectedBlog.content}</MarkdownRenderer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
