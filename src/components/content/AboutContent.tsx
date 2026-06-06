import React from "react";

interface AboutContentProps {
  data: {
    bio: string;
    meta: string[];
  };
}

export const AboutContent: React.FC<AboutContentProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <p className="body text-white leading-relaxed">{data.bio}</p>
      
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
        {data.meta.map((item) => (
          <div
            key={item}
            className="border border-white/10 p-2.5 text-center text-[10px] font-sans uppercase tracking-widest text-neutral-300 bg-white/[0.01]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutContent;
