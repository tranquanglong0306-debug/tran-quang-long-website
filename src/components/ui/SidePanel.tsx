import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AboutContent from "../content/AboutContent";
import ProjectsList from "../content/ProjectsList";
import SkillsGrid from "../content/SkillsGrid";
import BeliefsList from "../content/BeliefsList";
import PostsList from "../content/PostsList";
import ContactInfo from "../content/ContactInfo";
import { SHAPES, SECTIONS_CONTENT } from "../../lib/constants";
import { BlogPost } from "../../types";

interface SidePanelProps {
  activeSection: string | null;
  onClose: () => void;
  onSelectBlogPost?: (blog: BlogPost) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  activeSection,
  onClose,
  onSelectBlogPost,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const activeShape = activeSection
    ? SHAPES.find((s) => s.id === activeSection.toLowerCase())
    : null;

  // Accessibility Focus Trap
  useEffect(() => {
    if (!activeSection) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const panel = panelRef.current;
    if (!panel) return;

    const timeoutId = setTimeout(() => {
      const focusables = panel.querySelectorAll(focusableSelector);
      if (focusables.length === 0) return;

      const firstEl = focusables[0] as HTMLElement;
      const lastEl = focusables[focusables.length - 1] as HTMLElement;

      firstEl.focus();

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener("keydown", handleTabKey);
      return () => window.removeEventListener("keydown", handleTabKey);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [activeSection]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (activeSection) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeSection]);

  // Map content data models
  const getSectionContent = (id: string) => {
    switch (id) {
      case "about":
        return SECTIONS_CONTENT.about;
      case "work":
        return SECTIONS_CONTENT.work;
      case "skills":
        return SECTIONS_CONTENT.skills;
      case "philosophy":
        return SECTIONS_CONTENT.philosophy;
      case "journal":
        return SECTIONS_CONTENT.journal;
      case "contact":
        return SECTIONS_CONTENT.contact;
      default:
        return null;
    }
  };

  const section = activeShape
    ? {
        index: activeShape.index,
        title: activeShape.label,
        subtitle: activeShape.subtitle,
        type: activeShape.type,
        content: getSectionContent(activeShape.id),
      }
    : null;

  return (
    <AnimatePresence>
      {activeSection && section && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Sliding panel drawer */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[480px] max-w-[90vw] z-50 bg-[#0E0E0E]/95 border-l border-white/10 p-8 overflow-y-auto scrollbar-none flex flex-col justify-between pointer-events-auto shadow-2xl"
          >
            <div>
              {/* Header */}
              <header className="border-b border-white/10 pb-4 mb-8 flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="meta">{section.index}</span>
                  <h2 id="panel-title" className="text-display text-white mt-1">
                    {section.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="meta border border-white/20 hover:border-white/50 text-white px-3 py-1 font-sans transition-colors cursor-pointer"
                >
                  Close
                </button>
              </header>

              {/* Subtitle */}
              <p className="text-display-italic mb-8">{section.subtitle}</p>

              {/* Dynamic Content Area */}
              <div className="space-y-6">
                {section.type === "about" && <AboutContent data={section.content as any} />}
                {section.type === "work" && (
                  <ProjectsList
                    projects={section.content as any}
                  />
                )}
                {section.type === "skills" && <SkillsGrid skills={section.content as any} />}
                {section.type === "philosophy" && <BeliefsList beliefs={section.content as any} />}
                {section.type === "journal" && (
                  <PostsList
                    posts={section.content as any}
                    onSelectPost={(blog) => {
                      if (onSelectBlogPost) onSelectBlogPost(blog);
                    }}
                  />
                )}
                {section.type === "contact" && <ContactInfo info={section.content as any} />}
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-6 border-t border-white/10 meta text-neutral-500 font-sans">
              © MMXXVI · Quang Long
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
