import React from "react";

interface NavHintProps {
  hoveredSection: string | null;
}

export const NavHint: React.FC<NavHintProps> = ({ hoveredSection }) => {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center font-sans hidden sm:block">
      <span className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase block animate-pulse">
        {hoveredSection
          ? `Press ENTER or CLICK to explore ${hoveredSection}`
          : "Use Mouse Sway or ← → Arrow Keys to Navigate"}
      </span>
    </div>
  );
};

export default NavHint;
