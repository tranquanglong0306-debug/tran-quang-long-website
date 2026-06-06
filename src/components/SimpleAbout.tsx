import { motion } from "motion/react";
import { GraduationCap, BookOpen, Globe } from "lucide-react";

export default function SimpleAbout() {
  return (
    <div className="w-full glass-card rounded-3xl p-8 md:p-10 border border-white/5 relative overflow-hidden">
      {/* Absolute Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left column: Bio text */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl font-sans text-slate-200 leading-relaxed font-light mb-6 text-left"
          >
            Tôi là <strong className="text-white font-bold">Trần Quang Long</strong> — Cán bộ Đời sống Học sinh tại trường quốc tế, đồng thời là học viên Thạc sĩ ngành Ngôn ngữ học Ứng dụng. 
            Tôi dành sự quan tâm đặc biệt đến kỷ luật phục hồi, quá trình thụ đắc ngôn ngữ thứ hai (SLA) và các ứng dụng thực tế của AI trong giáo dục.
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-slate-400 font-sans font-light text-left"
          >
            Blog cá nhân này là không gian chia sẻ những quan sát thực tiễn, kinh nghiệm sư phạm và các giải pháp công nghệ nhằm hỗ trợ quá trình trưởng thành lành mạnh của học sinh.
          </motion.p>
        </div>

        {/* Right column: Compact statistics/indicators */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          {[
            {
              icon: GraduationCap,
              title: "Thạc sĩ Ngôn ngữ học Ứng dụng",
              desc: "Nghiên cứu chuyên sâu SLA & EdTech",
              color: "text-indigo-400 border-indigo-500/10 bg-indigo-500/5",
            },
            {
              icon: BookOpen,
              title: "Kỷ luật Phục hồi (Restorative)",
              desc: "Kiến tạo văn hóa học đường hòa giải",
              color: "text-blue-400 border-blue-500/10 bg-blue-500/5",
            },
            {
              icon: Globe,
              title: "Quản sinh học đường Quốc tế",
              desc: "Giám sát đời sống nội trú đa văn hóa",
              color: "text-slate-400 border-slate-500/10 bg-slate-500/5",
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-4 rounded-2xl border flex items-center gap-4 ${item.color}`}
              >
                <div className="p-2.5 rounded-xl bg-white/5 shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h5 className="font-sans font-bold text-xs text-white uppercase tracking-wide">
                    {item.title}
                  </h5>
                  <p className="font-sans text-[11px] text-slate-400 mt-0.5 font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
