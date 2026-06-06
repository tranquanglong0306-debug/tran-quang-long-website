import React from "react";

interface MarkdownRendererProps {
  children: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  if (!children) return null;

  // Split content by double newlines into paragraphs or blocks
  const blocks = children.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // H3 headings
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-sm font-semibold text-white mt-4 border-b border-white/5 pb-1 font-sans"
            >
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // H2 headings
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-base font-semibold text-white mt-5 font-sans">
              {trimmed.replace("## ", "")}
            </h2>
          );
        }

        // Bullet Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split(/\n[-*]\s+/);
          return (
            <ul key={index} className="list-disc pl-4 space-y-1.5 text-xs text-neutral-400 font-sans">
              {items.map((item, i) => {
                const cleaned = item.replace(/^[-*]\s+/, "");
                return <li key={i}>{cleaned}</li>;
              })}
            </ul>
          );
        }

        // Numbered Lists
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\n\d+\.\s+/);
          return (
            <ol key={index} className="list-decimal pl-4 space-y-1.5 text-xs text-neutral-400 font-sans">
              {items.map((item, i) => {
                const cleaned = item.replace(/^\d+\.\s+/, "");
                return <li key={i}>{cleaned}</li>;
              })}
            </ol>
          );
        }

        // Paragraphs with support for bold inline format (**text**)
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="text-xs text-neutral-400 leading-relaxed font-sans">
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={i} className="text-white font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
