import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { aboutTimeline } from "../data";
import { GraduationCap, Heart, UserCheck } from "lucide-react";

export default function AboutBento() {
  const [activeSegment, setActiveSegment] = useState<number>(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Bio Summary & Quick Credentials (Cols: 7) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
        >
          {/* Top light bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-400 opacity-80" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-blue-400 tracking-wider uppercase">HÌNH MẪU CHUYÊN GIA</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl text-white font-bold leading-tight mb-4">
              Trần Quang Long
            </h3>
            <p className="font-sans text-slate-350 text-sm md:text-base leading-relaxed mb-6">
              Một Cán bộ Quản lý Đời sống Học sinh năng động, nhiệt huyết trong hệ thống trường học quốc tế danh tiếng, song hành cùng hành trình nghiên cứu học thuật tiên phong dưới vai trò là Học viên Thạc sĩ Ngon ngữ học Ứng dụng. Tôi trực tiếp tích hợp các học thuyết ngôn ngữ xã hội - sư phạm SLA vào thói quen giám sát học đường, cấu trúc kỷ luật tích cực và cố vấn nội trú cho học sinh.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {["Công lý Phục hồi", "Nghiên cứu Ngôn ngữ", "Ứng dụng SLA", "Quản lý Khủng hoảng", "Kỷ luật Tích cực"].map((tag) => (
              <span key={tag} className="text-xs font-mono font-medium bg-white/5 text-slate-300 px-3 py-1.5 rounded-full border border-white/5 hover:border-blue-500/30 hover:text-white transition-colors duration-300">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Educational Philosophy (Cols: Sub-grid) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs text-indigo-400 tracking-wider uppercase block mb-1">TRIẾT LÝ HÀNH ĐỘNG</span>
              <h4 className="font-display text-[17px] md:text-lg text-white font-semibold mb-2">Triết lý Giáo dục của tôi</h4>
              <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed italic">
                "Kỷ luật không bao giờ là sự cô lập hay kiểm soát một chiều; đó là khoa học sư phạm về phục hồi cảm xúc và trao quyền ngôn ngữ xã hội. Bằng cách loại bỏ các khoảng trống trong giao tiếp và hạ thấp rào cản lo âu, chúng ta trao quyền để học sinh quốc tế tự nhận thức, tự chữa lành và phát triển tự nhiên vượt trội."
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Timeline of Student Life Experience (Cols: 5) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-5 glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <h4 className="font-display font-medium text-lg text-white">Cột mốc & Sự nghiệp</h4>
          </div>
          <span className="font-mono text-xs text-blue-300">0{activeSegment + 1} / 03</span>
        </div>

        {/* Selected Timeline Card display */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full justify-between"
            >
              <div>
                <span className="inline-block font-mono text-[11px] font-semibold text-blue-400 border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 rounded mb-3">
                  {aboutTimeline[activeSegment].year}
                </span>
                <h5 className="font-display text-lg text-white font-bold mb-1">
                  {aboutTimeline[activeSegment].role}
                </h5>
                <p className="font-mono text-[11px] text-slate-400 mb-3 block">
                  {aboutTimeline[activeSegment].institution}
                </p>
                <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed mb-4 font-light">
                  {aboutTimeline[activeSegment].description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {aboutTimeline[activeSegment].tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono bg-white/5 text-blue-300 px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timeline dots / interactive selector */}
        <div className="flex items-center gap-2 mt-6">
          {aboutTimeline.map((item, idx) => (
            <button
              key={item.year}
              onClick={() => setActiveSegment(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSegment === idx ? "w-8 bg-gradient-to-r from-blue-500 to-indigo-500" : "w-2.5 bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`Go to period ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
