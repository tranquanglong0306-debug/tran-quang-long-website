import { motion } from "motion/react";
import { GraduationCap, BookOpen, Globe } from "lucide-react";

export default function SimpleAbout() {
  return (
    <div className="w-full glass-card rounded-2xl p-8 md:p-10 border border-white/5 relative overflow-hidden z-10">
      {/* Grayscale ambient shadow overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.01] blur-3xl rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left column: Bio text */}
        <div className="lg:col-span-8 flex flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg md:text-xl font-sans text-white/90 leading-relaxed font-light mb-6"
          >
            Tôi là <strong className="text-white font-bold">Trần Quang Long</strong> — Cán bộ Đời sống Học sinh tại trường quốc tế, đồng thời là học viên Thạc sĩ ngành Ngôn ngữ học Ứng dụng. 
            Tôi nghiên cứu sâu về kỷ luật phục hồi, quá trình thụ đắc ngôn ngữ thứ hai (SLA) và ứng dụng thiết thực của AI vào giáo dục.
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-xs sm:text-sm text-white/55 font-sans font-light"
          >
            Nền tảng blog này ghi chép lại các góc nhìn thực tế trong quản lý học sinh và cách vận dụng khoa học ngôn ngữ cùng công nghệ hỗ trợ sự phát triển nhận thức.
          </motion.p>
        </div>

        {/* Right column: Indicators */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-3">
          {[
            {
              icon: GraduationCap,
              title: "Thạc sĩ Ngôn ngữ học Ứng dụng",
              desc: "Nghiên cứu chuyên sâu SLA & EdTech",
              color: "text-white/80 border-white/5 bg-white/[0.01]",
            },
            {
              icon: BookOpen,
              title: "Kỷ luật Phục hồi (Restorative)",
              desc: "Hòa giải mâu thuẫn học đường",
              color: "text-white/80 border-white/5 bg-white/[0.01]",
            },
            {
              icon: Globe,
              title: "Quản sinh học đường Quốc tế",
              desc: "Giám sát đời sống nội trú quốc tế",
              color: "text-white/80 border-white/5 bg-white/[0.01]",
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`p-4 rounded-xl border flex items-center gap-4 ${item.color}`}
              >
                <div className="p-2.5 rounded-lg bg-white/5 shrink-0">
                  <IconComp className="w-5 h-5 text-white/70" />
                </div>
                <div className="text-left">
                  <h5 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                    {item.title}
                  </h5>
                  <p className="font-sans text-[11px] text-white/40 mt-0.5 font-light">
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
