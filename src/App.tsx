import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Linkedin,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Menu,
  X,
  Languages,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Brain,
  FileText
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Scene3D from "./components/Scene3D";
import FeaturedArticles from "./components/FeaturedArticles";
import Categories from "./components/Categories";
import LatestPosts from "./components/LatestPosts";
import SimpleAbout from "./components/SimpleAbout";
import AIEducatorAssistant from "./components/AIEducatorAssistant";
import { BlogPost } from "./types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "assistant">("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [contactState, setContactState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sentMessage, setSentMessage] = useState(false);

  // Smooth scroll handler
  const handleScroll = (id: string) => {
    setMobileMenu(false);
    if (currentPage !== "home") {
      setCurrentPage("home");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: contactState.name,
        email: contactState.email,
        subject: "Liên hệ từ Blog Cá Nhân",
        message: contactState.message,
        createdAt: serverTimestamp()
      });
      setSentMessage(true);
      setTimeout(() => {
        setSentMessage(false);
        setContactState({
          name: "",
          email: "",
          message: "",
        });
      }, 4000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "contactMessages");
    }
  };

  const navigateToAssistant = () => {
    setMobileMenu(false);
    setCurrentPage("assistant");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHome = () => {
    setMobileMenu(false);
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen text-[#FFFFFF] bg-[#0A0A0A] font-sans selection:bg-white/10 selection:text-white overflow-hidden">
      {/* 3D Background Canvas */}
      <Scene3D />

      {/* Subtle overlay grid for tech aesthetic */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-10" />

      {/* Floating Header Navigation (Apple-style Glassmorphism) */}
      <header className="fixed top-6 left-4 right-4 z-40 max-w-6xl mx-auto">
        <div className="glass-card rounded-xl px-6 py-4 flex items-center justify-between border border-white/5 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToHome}>
            <div className="relative w-8 h-8 rounded bg-white flex items-center justify-center p-1.5">
              <span className="font-display font-extrabold text-black text-sm">L</span>
            </div>
            <div className="text-left">
              <span className="font-sans font-extrabold text-xs md:text-sm tracking-widest text-white block uppercase">TRẦN QUANG LONG</span>
              <span className="font-mono text-[8px] text-white/50 tracking-widest block font-medium uppercase">EDUCATIONAL RESEARCH & AI</span>
            </div>
          </div>

          {/* Desktop Navigation Map Nodes */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentPage === "home" ? (
              <>
                <button
                  onClick={() => handleScroll("featured")}
                  className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Nổi bật
                </button>
                <button
                  onClick={() => handleScroll("latest-posts")}
                  className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Bài viết
                </button>
                <button
                  onClick={() => handleScroll("ai-projects")}
                  className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Dự án AI
                </button>
                <button
                  onClick={() => handleScroll("about")}
                  className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Giới thiệu
                </button>
                <button
                  onClick={navigateToAssistant}
                  className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white hover:text-white/80 rounded-lg transition-colors cursor-pointer border border-white/20 bg-white/5"
                >
                  Trợ lý AI
                </button>
              </>
            ) : (
              <button
                onClick={navigateToHome}
                className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Trở lại Trang Chủ
              </button>
            )}
          </nav>

          <div className="hidden lg:block">
            {currentPage === "home" ? (
              <button
                onClick={() => handleScroll("contact")}
                className="btn-cinematic px-5 py-2 text-[10px] font-mono uppercase tracking-widest bg-white text-black font-semibold rounded cursor-pointer border border-white/10"
              >
                Liên hệ
              </button>
            ) : (
              <button
                onClick={navigateToHome}
                className="btn-cinematic px-5 py-2 text-[10px] font-mono uppercase tracking-widest bg-white/5 text-white font-semibold rounded cursor-pointer border border-white/10"
              >
                Xem Blog
              </button>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-white/80 hover:text-white cursor-pointer"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Area */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute left-0 right-0 top-20 glass-card rounded-xl p-5 border border-white/8 flex flex-col gap-3 lg:hidden z-50"
            >
              {currentPage === "home" ? (
                <>
                  <button
                    onClick={() => handleScroll("featured")}
                    className="w-full text-left py-2 px-4 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white"
                  >
                    Nổi bật
                  </button>
                  <button
                    onClick={() => handleScroll("latest-posts")}
                    className="w-full text-left py-2 px-4 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white"
                  >
                    Bài viết
                  </button>
                  <button
                    onClick={() => handleScroll("ai-projects")}
                    className="w-full text-left py-2 px-4 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white"
                  >
                    Dự án AI
                  </button>
                  <button
                    onClick={() => handleScroll("about")}
                    className="w-full text-left py-2 px-4 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white"
                  >
                    Giới thiệu
                  </button>
                  <button
                    onClick={navigateToAssistant}
                    className="w-full text-left py-2 px-4 text-xs font-mono uppercase tracking-wider text-white border border-white/10 rounded bg-white/5"
                  >
                    Trợ lý AI (Trang riêng)
                  </button>
                  <hr className="border-white/5 my-1" />
                  <button
                    onClick={() => handleScroll("contact")}
                    className="w-full text-center py-2.5 bg-white text-black rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Liên hệ
                  </button>
                </>
              ) : (
                <button
                  onClick={navigateToHome}
                  className="w-full text-left py-2 px-4 text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Trở lại Trang Chủ
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Routing Container */}
      <AnimatePresence mode="wait">
        {currentPage === "home" ? (
          <motion.div
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4 md:px-8 z-20 overflow-hidden">
              <div className="max-w-4xl mx-auto text-center relative z-20">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] mb-8"
                >
                  <span className="font-mono text-[9px] md:text-xs text-white/60 font-bold uppercase tracking-widest">
                    LUXURY EDITORIAL BLOG & AI EXPERIMENTS
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-5xl md:text-8xl text-white font-normal tracking-tight leading-[1.05] mb-8"
                >
                  Trần Quang Long
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-widest mb-8 font-semibold"
                >
                  Nhà giáo dục &bull; Quản sinh &bull; Nghiên cứu viên AI & Ngôn ngữ học ứng dụng
                </motion.p>

                {/* Empty container spacer for the 3D rotating object behind the text */}
                <div className="h-24 md:h-32" />

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-display text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light italic"
                >
                  "Xây dựng môi trường giáo dục văn minh thông qua kỷ luật phục hồi, ngôn ngữ học ứng dụng và công nghệ AI."
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center"
                >
                  <button
                    onClick={() => handleScroll("featured")}
                    className="btn-cinematic w-full sm:w-auto px-7 py-3.5 bg-white text-black font-mono font-bold uppercase text-[11px] tracking-wider rounded flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
                  >
                    Khám phá bài viết <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                  <button
                    onClick={navigateToAssistant}
                    className="btn-cinematic w-full sm:w-auto px-7 py-3.5 glass-card border-white/10 text-white font-mono font-bold uppercase text-[11px] tracking-wider rounded flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Khởi chạy Trợ lý AI
                  </button>
                </motion.div>
              </div>

              {/* Scroll down indicator */}
              <div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer text-white/40 hover:text-white transition-colors"
                onClick={() => handleScroll("featured")}
              >
                <span className="font-mono text-[9px] uppercase tracking-widest">Cuộn xem thêm</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </section>

            {/* Main Page Elements */}
            <main className="max-w-5xl mx-auto px-4 md:px-8 relative z-20 flex flex-col gap-28 pb-20">
              
              {/* SECTION 1: Featured Articles */}
              <section id="featured" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-col mb-10 text-left"
                >
                  <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    EDITORIAL CHOICE
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                    Bài viết nổi bật
                  </h2>
                </motion.div>
                <FeaturedArticles onSelectPost={setSelectedPost} />
              </section>

              <div className="section-divider" />

              {/* SECTION 2: Categories and Latest Posts */}
              <section id="latest-posts" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-col items-center mb-6 text-center"
                >
                  <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    KNOWLEDGE SHARING
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                    Tất cả chuyên mục
                  </h2>
                </motion.div>

                {/* Horizontal Category Filtering */}
                <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

                {/* Vertical Substack-style List */}
                <div className="mt-6">
                  <LatestPosts activeCategory={activeCategory} onSelectPost={setSelectedPost} />
                </div>
              </section>

              <div className="section-divider" />

              {/* SECTION 3: AI Projects Showcase Grid */}
              <section id="ai-projects" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-col mb-10 text-left"
                >
                  <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    AI WORKSTATION PROTOTYPES
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                    Dự án Trí Tuệ Nhân Tạo
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Cố vấn Can Thiệp Hoà Giải",
                      desc: "Tạo kịch bản đàm thoại, hòa giải mâu thuẫn học đường dựa trên quy tắc kỷ luật tích cực phục hồi."
                    },
                    {
                      icon: Brain,
                      title: "Giàn Giáo Thiết Lập Giáo Án",
                      desc: "Xây dựng khung bài giảng, giàn giáo SLA hỗ trợ tiếp thu ngôn ngữ tự nhiên tối ưu thời gian."
                    },
                    {
                      icon: FileText,
                      title: "Soạn Thảo Báo Cáo Nhận Xét",
                      desc: "Tạo mẫu thư thấu cảm thông tin kịp thời, đồng cảm để kết nối chặt chẽ giữa nhà trường & gia đình."
                    }
                  ].map((proj, idx) => {
                    const ProtoIcon = proj.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="glass-card rounded-2xl p-6 border border-white/5 text-left flex flex-col justify-between h-full hover:border-white/20 transition-all duration-300"
                      >
                        <div>
                          <div className="p-3 rounded-lg bg-white/5 inline-block mb-4 text-white/70">
                            <ProtoIcon className="w-5 h-5" />
                          </div>
                          <h4 className="font-sans font-bold text-sm text-white mb-2 uppercase tracking-wide">
                            {proj.title}
                          </h4>
                          <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
                            {proj.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={navigateToAssistant}
                    className="btn-cinematic px-6 py-3 border border-white/10 hover:bg-white hover:text-black rounded text-[10px] font-mono uppercase tracking-widest transition-all"
                  >
                    Truy cập không gian làm việc AI →
                  </button>
                </div>
              </section>

              <div className="section-divider" />

              {/* SECTION 4: About Box */}
              <section id="about" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-col mb-8 text-left"
                >
                  <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    AUTOBIOGRAPHY
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                    Về tác giả
                  </h2>
                </motion.div>
                <SimpleAbout />
              </section>

              <div className="section-divider" />

              {/* SECTION 5: Contact */}
              <section id="contact" className="scroll-mt-28 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column info */}
                  <div className="md:col-span-5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest font-bold mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        GET IN TOUCH
                      </div>
                      <h3 className="font-display text-3xl font-normal text-white mb-3 leading-tight">
                        Liên hệ
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-white/40 leading-relaxed font-light mb-6">
                        Trao đổi ý tưởng hoặc mời hợp tác về can thiệp sư phạm hành vi, dự án EdTech và cố vấn ngôn ngữ học.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded bg-white/5 border border-white/10 text-white/70 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono text-[9px] text-white/40 block uppercase font-semibold">Địa chỉ Email</span>
                          <a href="mailto:tranquanglong0306@gmail.com" className="font-sans text-xs sm:text-sm font-bold text-white hover:text-white/60 transition-colors">
                            tranquanglong0306@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column simple form */}
                  <div className="md:col-span-7 glass-card rounded-2xl p-6 border border-white/5 relative w-full">
                    <AnimatePresence mode="wait">
                      {sentMessage ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center text-center py-10"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <h4 className="font-display font-medium text-base text-white mb-1">Tin nhắn gửi đi thành công</h4>
                          <p className="font-sans text-xs text-white/40 leading-relaxed">
                            Cám ơn bạn đã gửi liên hệ. Tôi sẽ hồi đáp trong thời gian sớm nhất.
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-left">
                          <div className="flex flex-col gap-1">
                            <label className="font-sans font-semibold text-[10px] text-white/60 uppercase tracking-wider">Họ và tên</label>
                            <input
                              type="text"
                              required
                              placeholder="Nguyễn Văn A"
                              value={contactState.name}
                              onChange={(e) => setContactState({ ...contactState, name: e.target.value })}
                              className="glass-input p-3 rounded text-xs bg-black text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-sans font-semibold text-[10px] text-white/60 uppercase tracking-wider">Email liên hệ</label>
                            <input
                              type="email"
                              required
                              placeholder="ten.ban@tochuc.edu"
                              value={contactState.email}
                              onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                              className="glass-input p-3 rounded text-xs bg-black text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-sans font-semibold text-[10px] text-white/60 uppercase tracking-wider">Nội dung tin nhắn</label>
                            <textarea
                              rows={3}
                              required
                              placeholder="Kế hoạch thảo luận của bạn tại đây..."
                              value={contactState.message}
                              onChange={(e) => setContactState({ ...contactState, message: e.target.value })}
                              className="glass-input p-3 rounded text-xs bg-black text-white leading-relaxed font-light"
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn-cinematic w-full py-3 bg-white text-black font-sans font-bold text-xs tracking-wider uppercase rounded cursor-pointer border border-white/10"
                          >
                            Gửi tin nhắn bảo mật
                          </button>
                        </form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>

            </main>
          </motion.div>
        ) : (
          /* Separate Workstation Page: AI Educator Assistant */
          <motion.div
            key="assistant-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto min-h-screen relative z-20"
          >
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
              <div>
                <button
                  onClick={navigateToHome}
                  className="mb-4 text-xs font-mono text-white/40 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay về Trang Chủ Blog
                </button>
                <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                  Trợ Lý AI Sư Phạm
                </h2>
                <p className="font-sans text-xs sm:text-sm text-white/50 font-light mt-1.5">
                  Không gian can thiệp phục hồi và soạn giáo án đàm thoại đồng bộ cùng Gemini.
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-white flex items-center gap-1.5 self-start md:self-center">
                <Sparkles className="w-4 h-4" /> TRỰC TUYẾN & ĐỒNG BỘ
              </span>
            </div>

            {/* Educator assistant workstation card */}
            <div className="w-full relative">
              <AIEducatorAssistant />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Blog Modal Detail View (Shared globally) */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header static strip */}
              <div className="p-6 border-b border-white/5 flex items-start justify-between text-left">
                <div>
                  <span className="text-[8px] font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded mb-2 inline-block uppercase">
                    {selectedPost.category}
                  </span>
                  <h4 className="font-display text-lg md:text-xl font-bold text-white leading-snug">
                    {selectedPost.title}
                  </h4>
                  <div className="flex items-center gap-3 font-mono text-[9px] text-white/40 mt-1">
                    <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrolling Detailed Article */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow markdown-body text-xs sm:text-sm text-white/70 leading-relaxed text-left">
                <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
              </div>

              {/* Footer strip */}
              <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[9px] text-white/40 font-light">Tác giả: Trần Quang Long</span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded bg-white text-black font-mono text-xs font-semibold cursor-pointer hover:bg-white/90 transition-colors"
                >
                  Đóng bài viết
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Area */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0 }}
        className="border-t border-white/5 py-12 px-4 relative z-20 bg-black/40"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-sans font-extrabold text-xs tracking-widest text-white uppercase">TRẦN QUANG LONG</span>
            <p className="font-mono text-[8px] text-white/40 mt-1 uppercase font-light">
              Cán bộ Đời sống Học sinh & Học viên Thạc sĩ Ngôn ngữ học Ứng dụng
            </p>
          </div>

          {/* Social icons gateway links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white text-white/40 transition-all cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:tranquanglong0306@gmail.com"
              className="p-2.5 rounded border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white text-white/40 transition-all cursor-pointer"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center md:text-right">
            <span className="font-mono text-[9px] text-white/40 block font-light">
              © {new Date().getFullYear()} Trần Quang Long.
            </span>
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest block mt-1">
              EDITORIAL BLOG EXPERIENCE
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
