import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { competencies } from "../data";
import {
  ShieldAlert,
  HeartHandshake,
  Sparkles,
  Users,
  Briefcase,
  Terminal,
  Activity,
} from "lucide-react";

// Icon mapping to prevent dynamic key lookup risks
const iconMap: Record<string, any> = {
  ShieldAlert: ShieldAlert,
  HeartHandshake: HeartHandshake,
  Sparkles: Sparkles,
  Users: Users,
  Briefcase: Briefcase,
  Terminal: Terminal,
};

export default function ExpertiseDiagram() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const selectedExpertise = competencies[selectedIdx];
  const IconComponent = iconMap[selectedExpertise.iconName] || Activity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Node Chart Selector (Cols: 6) */}
      <div className="lg:col-span-6 relative flex items-center justify-center p-4">
        {/* Animated Cyber Core Backdrop */}
        <div className="absolute w-[320px] h-[320px] rounded-full border border-dashed border-blue-500/10 animate-slow-spin pointer-events-none" />
        <div className="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 blur-xl pointer-events-none" />

        {/* 6 Circularly Arranged Expertise Nodes */}
        <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center">
          {/* Inner Core */}
          <div className="absolute w-[100px] h-[100px] rounded-full bg-slate-950 border border-white/15 flex flex-col items-center justify-center text-center p-2 z-10">
            <span className="font-mono text-[9px] text-blue-400 tracking-widest uppercase">HỆ THỐNG</span>
            <span className="font-display font-bold text-xs text-white">SƯ PHẠM</span>
            <span className="font-mono text-[7px] text-indigo-400">TRUNG TÂM</span>
          </div>

          {competencies.map((item, idx) => {
            const angle = (idx * Math.PI) / 3; // 6 points equally distributed around a circle
            const radius = 120; // circular layout radius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const NodeIcon = iconMap[item.iconName] || Activity;
            const isSelected = selectedIdx === idx;

            return (
              <motion.button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                style={{ x, y }}
                whileHover={{ scale: 1.15 }}
                className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 z-20 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-white/20"
                    : "glass-card text-slate-400 border border-white/5 hover:border-white/20 hover:text-white"
                }`}
                title={item.title}
              >
                <NodeIcon className="w-5 h-5 md:w-6 md:h-6" />
                {isSelected && (
                  <span className="absolute -inset-1 rounded-2xl border border-blue-400 opacity-60 animate-ping pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Narrative Breakdown Panel (Cols: 6) */}
      <div className="lg:col-span-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
          >
            {/* Top Glow Spot */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${selectedExpertise.color} opacity-10 blur-2xl pointer-events-none`} />

            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${selectedExpertise.color} text-white shadow-lg`}>
                <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <span className="font-mono text-xs text-slate-400 tracking-wider uppercase block">NĂNG LỰC SƯ PHẠM</span>
                <h4 className="font-display text-xl md:text-2xl text-white font-extrabold tracking-tight">
                  {selectedExpertise.title}
                </h4>
              </div>
            </div>

            <p className="font-sans text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              {selectedExpertise.description}
            </p>

            {/* Core Action Points corresponding to the competence */}
            <div className="border-t border-white/5 pt-5 flex flex-col gap-3">
              <h5 className="font-mono text-xs text-blue-400 uppercase tracking-widest font-semibold">Phương pháp & Chỉ số Đánh giá:</h5>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 font-sans">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Hội nghị Vòng tròn Phục hồi
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Hòa nhập Cộng đồng SLA
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Hệ thống Giám sát Chăm sóc Khủng hoảng
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Cầu nối Nhà trường - Phụ huynh
                </li>
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
