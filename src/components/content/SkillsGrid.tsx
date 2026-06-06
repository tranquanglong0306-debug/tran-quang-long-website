import React from "react";

interface SkillsGridProps {
  skills: string[];
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({ skills }) => {
  return (
    <div className="grid grid-cols-2 gap-3 pt-2 font-sans">
      {skills.map((skill) => (
        <div
          key={skill}
          className="border border-white/5 p-3.5 bg-white/[0.01] hover:border-accent/40 transition-colors flex justify-between items-center text-xs text-white"
        >
          <span className="font-medium tracking-wide">{skill}</span>
          <span className="text-[9px] text-neutral-500 font-mono uppercase">Mastered</span>
        </div>
      ))}
    </div>
  );
};

export default SkillsGrid;
