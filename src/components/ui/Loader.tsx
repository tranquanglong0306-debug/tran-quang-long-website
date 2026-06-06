import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-[#0b0b0c] font-sans">
      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-bar {
          animation: loadingBar 2.5s infinite ease-in-out;
        }
      `}</style>
      <div className="w-20 h-[1px] bg-white/10 overflow-hidden relative mb-4">
        <div className="w-1/2 h-full bg-accent absolute top-0 left-0 animate-bar" />
      </div>
      <span className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase">
        Compiling 3D Materials...
      </span>
    </div>
  );
};

export default Loader;
