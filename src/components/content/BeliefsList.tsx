import React from "react";

interface BeliefItem {
  quote: string;
  explanation: string;
}

interface BeliefsListProps {
  beliefs: BeliefItem[];
}

export const BeliefsList: React.FC<BeliefsListProps> = ({ beliefs }) => {
  return (
    <div className="space-y-4 font-sans">
      {beliefs.map((belief, index) => (
        <div key={index} className="border border-white/5 p-4.5 bg-white/[0.01] hover:border-accent/30 transition-colors">
          <h3 className="text-base font-medium text-white mb-2 font-display italic">
            "{belief.quote}"
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {belief.explanation}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BeliefsList;
