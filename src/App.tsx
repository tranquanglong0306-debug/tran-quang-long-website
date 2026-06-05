import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Sparkles,
  Mail,
  Linkedin,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Menu,
  X,
  Languages,
  Award,
  BookmarkCheck,
  UserCheck,
} from "lucide-react";
import Interactive3DSpace from "./components/Interactive3DSpace";
import AboutBento from "./components/AboutBento";
import ExpertiseDiagram from "./components/ExpertiseDiagram";
import ResourceHub from "./components/ResourceHub";
import AIEducatorAssistant from "./components/AIEducatorAssistant";
import InsightsBlog from "./components/InsightsBlog";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [contactState, setContactState] = useState({
    name: "",
    email: "",
    subject: "Tư vấn Giáo dục / Vòng tròn Phục hồi",
    message: "",
  });
  const [sentMessage, setSentMessage] = useState(false);

  // Smooth navigator helpers
  const handleScroll = (id: string) => {
    setMobileMenu(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contactMessages"), {
        ...contactState,
        createdAt: serverTimestamp()
      });
      setSentMessage(true);
      setTimeout(() => {
        setSentMessage(false);
        setContactState({
          name: "",
          email: "",
          subject: "Tư vấn Giáo dục / Vòng tròn Phục hồi",
          message: "",
        });
      }, 4000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "contactMessages");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await addDoc(collection(db, "newsletterSubscriptions"), {
        email: newsletterEmail,
        createdAt: serverTimestamp()
      });
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail("");
      }, 4000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "newsletterSubscriptions");
    }
  };

  return (
    <div className="relative min-h-screen text-[#f1f5f9] bg-[#050c1a] font-sans selection:bg-blue-600/35 selection:text-white">
      {/* Space Cyber Grid & Soft Radial Lighting */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/12 w-96 h-96 ambient-glow-navy blur-3xl pointer-events-none rounded-full z-0 opacity-40" />
      <div className="fixed bottom-1/3 right-1/10 w-96 h-96 ambient-glow-slate blur-3xl pointer-events-none rounded-full z-0 opacity-40" />

      {/* Floating Header Navigation (Apple-style Glassmorphism) */}
      <header className="fixed top-4 left-4 right-4 z-40 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between border border-white/5 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-400 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(37,99,235,0.25)]">
              <Languages className="w-5 h-5 text-white font-bold animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-sm md:text-base tracking-wider text-white block">TRẦN QUANG LONG</span>
              <span className="font-mono text-[9px] text-blue-400 tracking-widest block font-medium uppercase">NGÔN NGỮ HỌC ỨNG DỤNG & SƯ PHẠM</span>
            </div>
          </div>

          {/* Desktop Navigation Map Nodes */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Tiểu sử", target: "about" },
              { label: "Khối năng lực", target: "expertise" },
              { label: "Tài liệu", target: "resources" },
              { label: "Trợ lý AI", target: "ai-tools" },
              { label: "Bài viết", target: "blog" },
            ].map((node) => (
              <button
                key={node.target}
                onClick={() => handleScroll(node.target)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-350 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer"
              >
                {node.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              onClick={() => handleScroll("contact")}
              className="btn-cinematic px-5 py-2.5 font-mono text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl cursor-pointer border border-blue-500/30"
            >
              Hợp tác giáo dục
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-white/80 hover:text-white cursor-pointer"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Area */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute left-0 right-0 top-20 glass-card rounded-2xl p-5 border border-white/8 flex flex-col gap-3 lg:hidden z-50"
            >
              {[
                { label: "Giới thiệu tiểu sử", target: "about" },
                { label: "Khối năng lực cốt lõi", target: "expertise" },
                { label: "Tài liệu sư phạm", target: "resources" },
                { label: "Trợ lý Trí tuệ Nhân tạo", target: "ai-tools" },
                { label: "Bài viết chia sẻ", target: "blog" },
              ].map((node) => (
                <button
                  key={node.target}
                  onClick={() => handleScroll(node.target)}
                  className="w-full text-left py-2.5 px-4 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {node.label}
                </button>
              ))}
              <hr className="border-white/5 my-1" />
              <button
                onClick={() => handleScroll("contact")}
                className="w-full text-center py-3 bg-blue-600 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Hợp tác giáo dục
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section Container with Big Banner Grid */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4 md:px-8 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-20">
          
          {/* Hero Left Text Area (Cols: 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left h-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6 self-center lg:self-start"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 neon-dot" />
              <span className="font-mono text-[9px] md:text-xs text-blue-400 font-bold uppercase tracking-widest">
                ĐO LƯỜNG SƯ PHẠM VÀ LÃNH ĐẠO PHỤC HỒI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl xl:text-[54px] text-white font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Kiến tạo Sự tăng trưởng của Học sinh bằng Giáo dục, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-slate-200">Lãnh đạo và Trí tuệ Nhân tạo</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-sans text-sm md:text-base text-slate-400 max-w-xl mb-8 leading-relaxed font-light"
            >
              Cán bộ Đời sống Học sinh (Supervisor) &bull; Học viên Thạc sĩ Ngôn ngữ học Ứng dụng &bull; Đam mê Công nghệ Giáo dục & Sư phạm Phục hồi
            </motion.p>

            {/* Video-game styled interactive metrics badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => handleScroll("ai-tools")}
                className="btn-cinematic w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-mono font-bold uppercase text-[11px] tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-blue-500/30"
              >
                Trải nghiệm Trợ lý AI Giáo dục
              </button>
              <button
                onClick={() => handleScroll("about")}
                className="btn-cinematic w-full sm:w-auto px-6 py-3.5 glass-card border-white/8 text-white hover:text-blue-400 font-mono font-bold uppercase text-[11px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Tiểu sử cá nhân <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Multi-metrics horizontal board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mt-12 border-t border-white/5 pt-8 max-w-md mx-auto lg:mx-0"
            >
              <div>
                <span className="block font-sans text-2xl font-black text-white">4+ Năm</span>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-medium">Giám sát Học đường</span>
              </div>
              <div className="border-l border-white/5 pl-4">
                <span className="block font-sans text-2xl font-black text-white">B2 đến C1</span>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-medium">Giàn giáo SLA</span>
              </div>
              <div className="border-l border-white/5 pl-4">
                <span className="block font-sans text-2xl font-black text-white">100%</span>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-medium">Hòa giải thành công</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Professional Passport ID Profile Banner (Cols: 5) */}
          <div className="lg:col-span-5 flex-col items-center justify-center relative w-full h-full min-h-[500px] flex">
            {/* Holographic Border Outline container representing professional credentials */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-[370px] glass-card card-tilt gradient-border rounded-3xl p-6 border border-white/8 relative overflow-hidden flex flex-col justify-between shadow-2xl animate-float"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-400" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest font-extrabold">HỒ SƠ SINH TRẮC HỌC</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-[9px] font-mono text-blue-400">HOẠT ĐỘNG CHUẨN</span>
              </div>

              {/* Handcrafted Professional Vector Avatar portrait representational card */}
              <div className="relative w-full aspect-square rounded-2xl bg-slate-950/80 mb-6 overflow-hidden flex items-center justify-center border border-white/5 group">
                {/* Visual grid behind avatar */}
                <div className="absolute inset-0 cyber-grid opacity-30" />
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-950/80 to-transparent pointer-events-none" />

                {/* Rotating alignment rings */}
                <div className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-blue-500/10 animate-slow-spin" />
                <div className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-slate-400/20 animate-slow-spin-reverse" />

                {/* Styled Professional Icon representing Trần Quang Long profile */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-slate-400 flex items-center justify-center p-[2px] shadow-[0_0_25px_rgba(37,99,235,0.30)]">
                    <div className="w-full h-full rounded-full bg-[#050c1a] flex items-center justify-center overflow-hidden">
                      {/* Avatar SVG silhouette portrait with professional glasses representing educational research character */}
                      <svg viewBox="0 0 100 100" className="w-16 h-16 text-white" fill="none" stroke="currentColor font-light" strokeWidth="2.5">
                        <circle cx="50" cy="35" r="18" className="stroke-indigo-400" strokeWidth="2" />
                        {/* Styled smart modern glasses outline */}
                        <path d="M38 34h24M38 34c0 3 3 5 6 5s6-2 6-5M50 34c0 3 3 5 6 5s6-2 6-5" className="stroke-blue-400" strokeWidth="1.5" />
                        {/* Smile representational line */}
                        <path d="M46 44 Q50 48 54 44" className="stroke-white" strokeWidth="2" />
                        {/* Suit / tie details */}
                        <path d="M22 80 C26 62 40 56 50 56 C60 56 74 62 78 80" className="stroke-indigo-400" strokeWidth="2" />
                        <path d="M45 56 l5 14 l5 -14" className="stroke-blue-400" strokeWidth="1.5" />
                        <path d="M50 70 v10" className="stroke-white" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                  
                  <span className="font-sans font-bold text-base text-white mt-4 block">TRẦN QUANG LONG</span>
                  <span className="font-mono text-[9px] text-blue-400 tracking-wider block font-medium uppercase mt-0.5">CỐ VẤN ĐỜI SỐNG HỌC SINH</span>
                </div>

                {/* Laser scanline animation */}
                <div className="absolute w-full h-[2px] bg-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.7)] animate-bounce top-0 left-0" />
              </div>

              {/* Bio tags block */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookmarkCheck className="w-4 h-4 text-indigo-400" />
                  <span className="font-sans text-xs text-white font-medium">Học thuật & Đội ngũ ban quản lý:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 font-light">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Thạc sĩ Ngôn ngữ (SLA)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Kỷ luật tích cực phục hồi
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Small Scroll indicator anchor */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer text-white/40 hover:text-white" onClick={() => handleScroll("about")}>
          <span className="font-mono text-[9px] uppercase tracking-widest">Cuộn xem thêm</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* Main Structural Layout Modules */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 flex flex-col gap-28 pb-20">

        {/* SECTION 1: Biography / About Me */}
        <section id="about" className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col mb-12"
          >
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold mb-3 justify-center lg:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              01 // Tiểu sử Chuyên môn
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white text-center lg:text-left leading-tight">
              Giao thoa giữa Quản trị Sư phạm & Khoa học Ngôn ngữ
            </h2>
          </motion.div>
          <AboutBento />
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Interactive Virtual Cockpit 3D Globe banner section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="py-2.5 border-y border-white/5 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/20 rounded-3xl p-6"
        >
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Bản đồ động lực học học sinh
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              Không gian Giám sát Liên thông Đa nhiệm
            </h3>
            <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              Mô phỏng này khắc họa cách thiết chế hành vi và phát triển ngôn ngữ tự nhiên SLA vận hành trong các vòng tròn phục hồi an toàn của Trần Quang Long. Bạn có thể sử dụng chuột kéo thả quả địa cầu để thay đổi quỹ đạo số hóa.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <span className="block text-xl font-bold text-white">100%</span>
                <span className="text-[10px] font-mono text-slate-400">Tính bảo mật dữ liệu</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="block text-xl font-bold text-white">Tối ưu</span>
                <span className="text-[10px] font-mono text-slate-400">Rào cản ngôn ngữ</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 w-full aspect-video min-h-[460px] relative">
            <Interactive3DSpace />
          </div>
        </motion.section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* SECTION 2: Expertise Circles mapping */}
        <section id="expertise" className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col mb-12 text-center"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-3 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              02 // Khối Năng lực Cốt lõi
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
              Khung Sư phạm Giám sát Học sinh Toàn diện
            </h2>
            <p className="font-sans text-xs md:text-sm text-slate-450 max-w-md mx-auto mt-2 leading-relaxed">
              Khám phá các khía cạnh vững chắc kiến tạo văn hóa nội trú lành mạnh và năng lực xã hội văn minh.
            </p>
          </motion.div>
          <ExpertiseDiagram />
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* SECTION 3: Resource Center download board */}
        <section id="resources" className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col mb-12"
          >
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold mb-3 justify-center lg:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              03 // Trung tâm Tài nguyên học thuật
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white text-center lg:text-left leading-tight">
              Biểu mẫu hành động & Ma trận Đánh giá Đóng góp
            </h2>
          </motion.div>
          <ResourceHub />
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* SECTION 4: AI Tools for Educators */}
        <section id="ai-tools" className="scroll-mt-28 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col mb-12 text-center"
          >
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold mb-3 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 neon-dot" />
              04 // PHÒNG THÍ NGHIỆM TÍCH HỢP AI QUẢN LÝ
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight text-glow-blue">
              Không gian làm việc Trí tuệ Nhân tạo tương tác
            </h2>
            <p className="font-sans text-xs md:text-sm text-slate-450 max-w-lg mx-auto mt-2 font-light">
              Khảo sát các đề cương can thiệp, bài soạn giáo án, hay văn bản báo cáo phụ huynh đồng bộ hóa với mô hình ngôn ngữ sâu của Gemini.
            </p>
          </motion.div>
          <AIEducatorAssistant />
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* SECTION 5: Professional Blog Cases */}
        <section id="blog" className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col mb-12"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-3 justify-center lg:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              05 // Nhật ký Nhận thức Giáo dục
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white text-center lg:text-left leading-tight">
              Đời sống Học sinh & Góc nhìn Ngôn ngữ học Ứng dụng
            </h2>
          </motion.div>
          <InsightsBlog />
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* SECTION 6: Contact Panel & Newsletter Subscription */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          
          {/* Quick contact details sidebar (Cols: 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[380px]">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                06 // PHƯƠNG THỨC LIÊN LẠC
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                Liên hệ Trao đổi & Hợp tác Giáo dục
              </h2>
              <p className="font-sans text-xs md:text-sm text-slate-350 leading-relaxed mb-8 font-light">
                Kết nối giao thông với các hội đồng giáo dục toàn cầu, giám sát viên nội trú và nghiên cứu sinh học thuật. Vui lòng phác thảo mục tiêu liên kết của bạn qua biểu mẫu hoặc email trực tiếp.
              </p>
            </div>

            {/* Email + Address references */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-slate-400 block font-semibold">ĐỊA CHỈ HÒM THƯ TRỰC TIẾP</span>
                  <a href="mailto:tranquanglong0306@gmail.com" className="font-sans text-sm font-bold text-white hover:text-blue-400 transition-colors">
                    tranquanglong0306@gmail.com
                  </a>
                </div>
              </div>

              {/* Newsletter subscribe form */}
              <div className="glass-card rounded-2xl p-4 border border-white/5 mt-4">
                <span className="font-mono text-[9px] text-slate-400 block mb-2 uppercase font-semibold">Đăng ký nhận bản tin nghiên cứu</span>
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs text-emerald-400 font-mono py-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Đăng ký thành công! Cám ơn quý nhà giáo.
                    </motion.div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                      <input
                        type="email"
                        placeholder="ten.ban@tochuc.edu.vn"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="glass-input p-2.5 rounded-xl text-xs flex-grow font-sans"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-extrabold uppercase shrink-0 transition-colors cursor-pointer"
                      >
                        Đồng ý
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Core Interactive Message Form (Cols: 7) */}
          <div className="lg:col-span-7 glass-card glass-card-hover gradient-border rounded-3xl p-6 md:p-8 border border-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

            <AnimatePresence mode="wait">
              {sentMessage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-medium text-lg text-white mb-2">Thư điện tử được truyền đi thành công</h4>
                  <p className="font-sans text-xs text-slate-400 max-w-sm leading-relaxed font-light">
                    Cổng tiếp nhận của Trần Quang Long đã lưu trữ thông tin của bạn. Quy trình hồi đáp thấu đáo sẽ được thu xếp phản hồi trong thời gian sớm nhất. Trân trọng!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-semibold text-xs text-slate-300">Tên của bạn</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={contactState.name}
                      onChange={(e) => setContactState({ ...contactState, name: e.target.value })}
                      className="glass-input p-3 rounded-xl text-xs sm:text-sm bg-slate-950/40 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-semibold text-xs text-slate-300">Địa chỉ Email liên hệ</label>
                    <input
                      type="email"
                      required
                      placeholder="ten.ban@truonghoc.edu"
                      value={contactState.email}
                      onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                      className="glass-input p-3 rounded-xl text-xs sm:text-sm bg-slate-950/40 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-sans font-semibold text-xs text-slate-300">Chủ đề cần thảo luận</label>
                    <select
                      value={contactState.subject}
                      onChange={(e) => setContactState({ ...contactState, subject: e.target.value })}
                      className="glass-input p-3 rounded-xl text-xs sm:text-sm bg-slate-950 text-white cursor-pointer"
                    >
                      <option>Tư vấn Giáo dục / Vòng tròn Phục hồi</option>
                      <option>Thảo luận lý thuyết SLA Ngôn ngữ học</option>
                      <option>Các dự án ứng dụng Sư phạm & AI</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2 font-sans text-xs sm:text-sm">
                    <label className="font-sans font-semibold text-xs text-slate-300">Nội dung thư chi tiết</label>
                    <textarea
                      rows={4}
                      required
                      value={contactState.message}
                      onChange={(e) => setContactState({ ...contactState, message: e.target.value })}
                      placeholder="Xin vui lòng mô tả kế hoạch hợp tác giáo dục của bạn tại đây..."
                      className="glass-input p-3 rounded-xl bg-slate-950/40 text-white leading-relaxed font-light"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="btn-cinematic w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl cursor-pointer border border-blue-500/30"
                    >
                      Gửi thư liên hệ bảo mật
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      {/* Footer Area */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0 }}
        className="border-t border-white/5 py-12 px-4 relative z-20"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-sans font-extrabold text-sm tracking-wider text-white">TRẦN QUANG LONG</span>
            <p className="font-mono text-[9px] text-slate-400 mt-1 uppercase font-light">
              Cán bộ Đời sống Học sinh & Học viên Thạc sĩ Ngôn ngữ học Ứng dụng
            </p>
          </div>

          {/* Social icons gateway links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 text-white/50 transition-all cursor-pointer"
              aria-label="LinkedIn Profile Reference"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:tranquanglong0306@gmail.com"
              className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 text-white/50 transition-all cursor-pointer"
              aria-label="Email Address gateway"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center md:text-right">
            <span className="font-mono text-[9px] text-slate-400 block font-light">
              © {new Date().getFullYear()} Trần Quang Long. Bản quyền được bảo lưu.
            </span>
            <span className="font-mono text-[8px] text-blue-400/60 uppercase tracking-widest block mt-1">
              Vận hành bằng Trí tuệ Nhân tạo Giáo dục Thực nghiệm
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
