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
  ArrowLeft,
  Calendar,
  Clock
} from "lucide-react";
import ReactMarkdown from "react-markdown";
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
      // Wait for re-render before scrolling
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
    <div className="relative min-h-screen text-[#f1f5f9] bg-[#050c1a] font-sans selection:bg-blue-600/35 selection:text-white">
      {/* Space Cyber Grid & Soft Radial Lighting */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/12 w-96 h-96 ambient-glow-navy blur-3xl pointer-events-none rounded-full z-0 opacity-30" />
      <div className="fixed bottom-1/3 right-1/10 w-96 h-96 ambient-glow-slate blur-3xl pointer-events-none rounded-full z-0 opacity-30" />

      {/* Floating Header Navigation (Apple-style Glassmorphism) */}
      <header className="fixed top-4 left-4 right-4 z-40 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between border border-white/5 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToHome}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-400 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(37,99,235,0.25)]">
              <Languages className="w-5 h-5 text-white font-bold animate-pulse" />
            </div>
            <div className="text-left">
              <span className="font-sans font-extrabold text-sm md:text-base tracking-wider text-white block">TRẦN QUANG LONG</span>
              <span className="font-mono text-[9px] text-blue-400 tracking-widest block font-medium uppercase">Blog Cá Nhân & Trợ Lý AI</span>
            </div>
          </div>

          {/* Desktop Navigation Map Nodes */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentPage === "home" ? (
              <>
                <button
                  onClick={() => handleScroll("featured")}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-350 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Nổi bật
                </button>
                <button
                  onClick={() => handleScroll("latest-posts")}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-350 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Bài viết
                </button>
                <button
                  onClick={() => handleScroll("about")}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-350 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Giới thiệu
                </button>
                <button
                  onClick={navigateToAssistant}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Trợ lý AI
                </button>
              </>
            ) : (
              <button
                onClick={navigateToHome}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-350 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Trở lại Trang Chủ
              </button>
            )}
          </nav>

          <div className="hidden lg:block">
            {currentPage === "home" ? (
              <button
                onClick={() => handleScroll("contact")}
                className="btn-cinematic px-5 py-2.5 font-mono text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl cursor-pointer border border-blue-500/30"
              >
                Liên hệ hợp tác
              </button>
            ) : (
              <button
                onClick={navigateToHome}
                className="btn-cinematic px-5 py-2.5 font-mono text-xs font-semibold glass-card border-white/10 text-white rounded-xl cursor-pointer"
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
              {currentPage === "home" ? (
                <>
                  <button
                    onClick={() => handleScroll("featured")}
                    className="w-full text-left py-2.5 px-4 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Nổi bật
                  </button>
                  <button
                    onClick={() => handleScroll("latest-posts")}
                    className="w-full text-left py-2.5 px-4 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Bài viết
                  </button>
                  <button
                    onClick={() => handleScroll("about")}
                    className="w-full text-left py-2.5 px-4 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Giới thiệu
                  </button>
                  <button
                    onClick={navigateToAssistant}
                    className="w-full text-left py-2.5 px-4 rounded-xl text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors"
                  >
                    Trợ lý AI (Trang riêng)
                  </button>
                  <hr className="border-white/5 my-1" />
                  <button
                    onClick={() => handleScroll("contact")}
                    className="w-full text-center py-3 bg-blue-600 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Liên hệ hợp tác
                  </button>
                </>
              ) : (
                <button
                  onClick={navigateToHome}
                  className="w-full text-left py-2.5 px-4 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
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
            <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-16 px-4 md:px-8 z-10 overflow-hidden">
              <div className="max-w-4xl mx-auto text-center relative z-20">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 neon-dot" />
                  <span className="font-mono text-[9px] md:text-xs text-blue-400 font-bold uppercase tracking-widest">
                    Nhật ký Giáo dục & Quản sinh thời đại số
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-4xl md:text-6xl text-white font-extrabold tracking-tight leading-[1.15] mb-6"
                >
                  Trần Quang Long
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-mono text-xs md:text-sm text-blue-400 uppercase tracking-widest mb-6 font-semibold"
                >
                  Nhà giáo dục &bull; Quản sinh &bull; Nghiên cứu viên AI & Ngôn ngữ học ứng dụng
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="font-sans text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light italic"
                >
                  "Kiến tạo môi trường học đường nhân văn và lành mạnh thông qua Kỷ luật Phục hồi, Ngôn ngữ học ứng dụng và Công nghệ Trí tuệ Nhân tạo."
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center"
                >
                  <button
                    onClick={() => handleScroll("latest-posts")}
                    className="btn-cinematic w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-mono font-bold uppercase text-[11px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/30 shadow-lg shadow-blue-500/20"
                  >
                    Đọc bài viết <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={navigateToAssistant}
                    className="btn-cinematic w-full sm:w-auto px-7 py-4 glass-card border-white/8 text-blue-400 hover:text-white font-mono font-bold uppercase text-[11px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Trải nghiệm Trợ lý AI
                  </button>
                </motion.div>
              </div>

              {/* Scroll down indicator */}
              <div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer text-white/40 hover:text-white transition-colors"
                onClick={() => handleScroll("featured")}
              >
                <span className="font-mono text-[9px] uppercase tracking-widest">Cuộn xem thêm</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </div>
            </section>

            {/* Main Page Elements */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 flex flex-col gap-24 pb-20">
              
              {/* SECTION 1: Featured Articles */}
              <section id="featured" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-col mb-10 text-left"
                >
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Tiêu điểm nghiên cứu
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
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
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Chia sẻ kiến thức
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
                    Tất cả bài viết
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

              {/* SECTION 3: About Box */}
              <section id="about" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex flex-col mb-8 text-left"
                >
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Người viết bài
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
                    Về Trần Quang Long
                  </h2>
                </motion.div>
                <SimpleAbout />
              </section>

              <div className="section-divider" />

              {/* SECTION 4: Simple Contact */}
              <section id="contact" className="scroll-mt-28 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column info */}
                  <div className="md:col-span-5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Liên hệ
                      </div>
                      <h3 className="font-display text-2xl font-extrabold text-white mb-3 leading-tight">
                        Trò chuyện & Hợp tác
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed font-light mb-6">
                        Kết nối để cùng phát triển các giải pháp can thiệp hành vi học đường, cố vấn SLA hoặc trao đổi EdTech.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono text-[9px] text-slate-400 block uppercase font-semibold">Gửi Email Trực tiếp</span>
                          <a href="mailto:tranquanglong0306@gmail.com" className="font-sans text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition-colors">
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
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center text-center py-10"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <h4 className="font-display font-medium text-base text-white mb-1">Thư đã gửi thành công</h4>
                          <p className="font-sans text-xs text-slate-450 leading-relaxed">
                            Quy trình phản hồi thấu đáo sẽ được thu xếp trong thời gian sớm nhất. Trân trọng!
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-left">
                          <div className="flex flex-col gap-1">
                            <label className="font-sans font-semibold text-[11px] text-slate-300">Họ và tên</label>
                            <input
                              type="text"
                              required
                              placeholder="Nguyễn Văn A"
                              value={contactState.name}
                              onChange={(e) => setContactState({ ...contactState, name: e.target.value })}
                              className="glass-input p-3 rounded-xl text-xs bg-slate-950/40 text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-sans font-semibold text-[11px] text-slate-300">Email liên hệ</label>
                            <input
                              type="email"
                              required
                              placeholder="ten.ban@tochuc.edu"
                              value={contactState.email}
                              onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                              className="glass-input p-3 rounded-xl text-xs bg-slate-950/40 text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-sans font-semibold text-[11px] text-slate-300">Nội dung tin nhắn</label>
                            <textarea
                              rows={3}
                              required
                              placeholder="Kế hoạch hợp tác hoặc câu hỏi của bạn tại đây..."
                              value={contactState.message}
                              onChange={(e) => setContactState({ ...contactState, message: e.target.value })}
                              className="glass-input p-3 rounded-xl text-xs bg-slate-950/40 text-white leading-relaxed font-light"
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn-cinematic w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl cursor-pointer border border-blue-500/30"
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
            className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen relative z-10"
          >
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
              <div>
                <button
                  onClick={navigateToHome}
                  className="mb-4 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay về Trang Chủ Blog
                </button>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
                  Trợ Lý Trí Tuệ Nhân Tạo
                </h2>
                <p className="font-sans text-xs sm:text-sm text-slate-400 font-light mt-1.5">
                  Không gian làm việc sư phạm chuyên sâu tích hợp mô hình ngôn ngữ lớn của Gemini.
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-mono text-blue-400 flex items-center gap-1.5 self-start md:self-center">
                <Sparkles className="w-4 h-4 animate-pulse" /> Trực Tuyến & Đồng Bộ
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
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header static strip */}
              <div className="p-6 border-b border-white/5 flex items-start justify-between text-left">
                <div>
                  <span className="text-[9px] font-mono font-bold text-blue-400 border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 rounded mb-2 inline-block uppercase">
                    {selectedPost.category}
                  </span>
                  <h4 className="font-display text-lg md:text-xl font-bold text-white leading-snug">
                    {selectedPost.title}
                  </h4>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrolling Detailed Article */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow markdown-body text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
                <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
              </div>

              {/* Footer strip */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 font-light">Tác giả: Trần Quang Long</span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-mono text-xs font-semibold cursor-pointer hover:bg-blue-500 shadow-md transition-colors"
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
