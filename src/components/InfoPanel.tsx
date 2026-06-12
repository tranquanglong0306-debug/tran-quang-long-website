import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, MapPin, Briefcase, Clock, CheckCircle, 
  Mail, Linkedin, Github, Twitter, Send, Code, 
  BookOpen, ExternalLink, ShieldAlert, FileText, ArrowRight
} from 'lucide-react';
import { useAppState } from '../store';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, addDoc } from 'firebase/firestore';
import MarkdownRenderer from './ui/MarkdownRenderer';
import { mockProjects } from '../data';

interface InfoPanelProps {
  isMobile: boolean;
  isTablet: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ isMobile, isTablet }) => {
  const { activePanel, setActivePanel } = useAppState();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Blog states
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Reset form when panel switches
  useEffect(() => {
    setFormState({ name: '', email: '', message: '' });
    setSubmitStatus('idle');
  }, [activePanel]);

  // Fetch blog posts from Firestore
  const fetchBlogPosts = async () => {
    setLoadingPosts(true);
    try {
      const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched: any[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      
      if (fetched.length === 0) {
        // Seed default educational posts if Firestore collection is empty
        const defaultPosts = [
          {
            title: "[Briefing 01] Restorative Circles in High-Stakes Classrooms",
            category: "Student Life",
            readTime: "5 min read",
            date: "June 2026",
            summary: "Cách người quản lý học sinh xây dựng niềm tin và hòa giải mâu thuẫn học đường bằng đối thoại vòng tròn.",
            content: `### Giới thiệu về Công lý Phục hồi

Trong môi trường học thuật quốc tế đầy áp lực, các phương pháp kỷ luật trừng phạt truyền thống thường không giải quyết được nguồn gốc của sự mất kết nối trong giao tiếp. Khi một học sinh vi phạm kỷ luật, việc cấm túc chỉ tạm thời đưa các em ra khỏi lớp học nhưng không dạy cho các em kỹ năng giao tiếp cần thiết.

### Khung Công lý Phục hồi
Thay vì đặt câu hỏi: **"Quy tắc nào đã bị vi phạm và ai đã làm điều đó?"**, chúng tôi tập trung vào:
1. **Chuyện gì đã xảy ra và các em đã nghĩ gì vào thời điểm đó?**
2. **Những ai đã bị ảnh hưởng và ảnh hưởng như thế nào?**
3. **Cần làm gì để sửa chữa sai lầm và thiết lập lại trật tự?**

### Triển khai trong thực tế
Khi giải quyết các tranh chấp ở cấp trung học, tôi sử dụng cấu trúc hội nghị nhỏ. Điều này giúp các em học sinh ngồi lại với nhau, chia sẻ góc nhìn một cách an toàn và ký kết một cam kết cùng phát triển. Chúng tôi nhấn mạnh việc **kỷ luật tích cực** và **hòa giải đồng đẳng**, trao quyền cho học sinh tự chịu trách nhiệm về hành vi của mình.`,
            createdAt: Timestamp.now()
          },
          {
            title: "[Briefing 02] Affective Filter Attenuation in Residential Life",
            category: "Applied Linguistics",
            readTime: "7 min read",
            date: "May 2026",
            summary: "Phân tích cách nền tảng ngôn ngữ ảnh hưởng đến tâm lý giao tiếp và sự hòa nhập của học sinh trường quốc tế.",
            content: `### Lý thuyết SLA và Sức khỏe tinh thần học sinh

Đối với học sinh trường quốc tế, việc học ngôn ngữ không diễn ra trong môi trường chân không. Theo Giả thuyết Bộ lọc Nhận thức (Affective Filter Hypothesis) của Stephen Krashen, mức độ lo âu cao, lòng tự tôn thấp và căng thẳng học đường sẽ dựng lên một rào cản tinh thần ngăn cản thông tin truyền tải đến trung tâm tiếp thu ngôn ngữ của não bộ.

### Kết nối với đời sống học sinh
Là một Cán bộ Quản lý Đời sống Học sinh, tôi chứng kiến trực tiếp các vấn đề về ngôn ngữ dẫn đến xung đột hành vi hoặc sự cô lập trong lớp học:
- **Rào cản ngôn ngữ hệ thống:** Nếu học sinh cảm thấy năng lực giao tiếp tiếng Anh của mình bị nghi ngờ, các em sẽ tự cô lập bản thân trong các nhóm nhỏ cùng ngôn ngữ mẹ đẻ, làm gia tăng sự chia rẽ xã hội.
- **Dàn giáo xã hội nhận thức:** Bằng cách tích hợp các hoạt động nhóm ít tính cạnh tranh tại các sảnh chung (chơi board game, phát thanh học đường, hội đồng tự quản), chúng tôi giúp hạ thấp bộ lọc nhận thức, đồng thời thúc đẩy năng lực giao tiếp tự nhiên và cảm giác thuộc về môi trường học đường.`,
            createdAt: Timestamp.now()
          }
        ];
        
        for (const post of defaultPosts) {
          await addDoc(collection(db, 'blogPosts'), post);
        }
        
        fetchBlogPosts();
        return;
      }
      
      setPosts(fetched);
    } catch (err) {
      console.error('Lỗi khi fetch bài viết:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (activePanel === 'blog') {
      fetchBlogPosts();
    }
  }, [activePanel]);

  if (!activePanel) return null;

  const handleClose = () => {
    setActivePanel(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setSubmitStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Lỗi khi gửi form liên hệ:', err);
      setSubmitStatus('error');
    }
  };

  // Define panel width styles
  const getPanelWidthClass = () => {
    if (isMobile) return 'w-full h-[85vh] bottom-0 left-0 rounded-t-3xl border-t border-[#1a1a24]';
    if (isTablet) return 'w-[80vw] h-full right-0 top-0 border-l border-[#1a1a24]';
    return 'w-[480px] h-full right-0 top-0 border-l border-[#1a1a24]';
  };

  // Render About section
  const renderAbout = () => (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Image Border */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border border-accent-gold overflow-hidden bg-bg-secondary flex items-center justify-center">
            <span className="text-3xl font-bold text-accent-gold tracking-wider">QL</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">Trần Quang Long</h3>
          <p className="text-xs text-accent-gold tracking-widest font-medium uppercase mt-1">Student Life Officer · MA Applied Linguistics</p>
        </div>
      </div>

      <div className="space-y-3.5 border-t border-border-subtle pt-6">
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2.5 text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
            MA Applied Linguistics — SLA & EdTech Research
          </li>
          <li className="flex items-center gap-2.5 text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
            Restorative Justice Practitioner
          </li>
          <li className="flex items-center gap-2.5 text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
            International Student Life Officer
          </li>
        </ul>
      </div>

      <div className="space-y-4 border-t border-border-subtle pt-6">
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-accent-gold font-bold">Tiểu sử bản thân</h4>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Nghiên cứu tập trung vào kỷ luật phục hồi, SLA và ứng dụng AI trong giáo dục.
        </p>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Blog này lưu giữ những quan sát thực tiễn từ môi trường học đường quốc tế...
        </p>
        <p className="text-sm leading-relaxed text-accent-gold font-display italic mt-2">
          Mỗi bài viết là một tín hiệu từ thực địa, được chắt lọc qua lăng kính học thuật.
        </p>
      </div>
    </div>
  );

  // Render Blog section
  const renderBlog = () => (
    <div className="space-y-6 font-sans">
      <p className="text-xs text-neutral-400 leading-relaxed border-b border-border-subtle pb-4">
        Nơi chia sẻ thông tin, các bài viết nghiên cứu và tài liệu thực hành về quản lý đời sống học sinh và ngôn ngữ học ứng dụng.
      </p>

      {loadingPosts ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-2">
          <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] text-neutral-500 font-mono">Đang tải bài viết...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 border border-dashed border-border-subtle rounded-xl text-xs">
          Chưa có bài viết nào được đăng.
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          {posts.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-bg-secondary border border-border-subtle hover:border-accent-gold/40 p-5 transition-all duration-300 cursor-pointer group"
            >
              {post.coverImage && (
                <div className="w-full h-36 overflow-hidden mb-3 border border-border-subtle bg-black/20">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] text-accent-gold tracking-[0.1em] font-medium">
                  {post.category}
                </span>
                <span className="text-[9px] text-neutral-500 font-mono">
                  {post.date} · {post.readTime}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors duration-300">
                {post.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-accent-gold font-bold mt-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Đọc bài viết</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Skills section
  const renderSkills = () => {
    const skillCategories = [
      {
        title: 'Quản trị Giáo dục & Đời sống Học sinh',
        skills: [
          'Kỷ luật Tích cực (Positive Discipline)',
          'Công lý Phục hồi (Restorative Justice)',
          'Hệ thống Sức khỏe Tinh thần Học sinh',
          'Giải quyết Mâu thuẫn (Conflict Resolution)'
        ]
      },
      {
        title: 'Ngôn ngữ học Ứng dụng',
        skills: [
          'Dàn ý hỗ trợ SLA (SLA Scaffolding)',
          'Năng lực Giao tiếp Thực tế',
          'Phân tích Ngôn ngữ Xã hội (Sociolinguistics)'
        ]
      },
      {
        title: 'Công nghệ & Lập trình Web',
        skills: [
          'React & Vite',
          'Three.js / React Three Fiber',
          'TypeScript / JavaScript',
          'Node.js & Python'
        ]
      }
    ];

    return (
      <div className="space-y-6 font-sans">
        <p className="text-xs text-neutral-400 leading-relaxed border-b border-border-subtle pb-4">
          Sự kết hợp giữa chuyên môn sư phạm, nghiên cứu giao tiếp và ứng dụng công nghệ để quản lý dữ liệu đời sống học sinh hiện đại.
        </p>

        <div className="space-y-6">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[10px] font-bold text-accent-gold tracking-[0.2em] uppercase">{cat.title}</h4>
              <div className="bg-bg-secondary p-4 border border-border-subtle">
                <ul className="space-y-2 text-sm text-neutral-300">
                  {cat.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2">
                      <span className="text-accent-gold/60">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Projects section
  const renderProjects = () => {
    return (
      <div className="space-y-6 font-sans">
        <p className="text-xs text-neutral-400 leading-relaxed border-b border-border-subtle pb-4">
          Các dự án và hệ thống quản trị tiêu biểu được phát triển nhằm hỗ trợ dịch vụ học sinh và nghiên cứu dữ liệu ngôn ngữ học.
        </p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          {mockProjects.map((proj, idx) => (
            <div 
              key={idx}
              className="bg-bg-secondary border border-border-subtle hover:border-accent-gold/45 p-5 transition-all duration-300 group"
            >
              <span className="text-[9px] text-accent-gold tracking-[0.2em] font-medium block mb-2">
                {proj.category}
              </span>
              <h4 className="text-base font-bold text-white tracking-wide group-hover:text-accent-gold transition-colors duration-300">
                {proj.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed max-w-md">
                {proj.desc}
              </p>
              
              <div className="text-[10px] text-neutral-500 mt-3.5 font-mono">
                {proj.tech}
              </div>

              <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-border-subtle">
                <a 
                  href={proj.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Trải nghiệm</span>
                </a>
                <a 
                  href={proj.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Contact section
  const renderContact = () => (
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-sm font-bold text-white mb-2">Thiết Lập Kết Nối</h4>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Sẵn sàng trao đổi về can thiệp sư phạm hành vi, dự án EdTech hoặc cố vấn ngôn ngữ học. Mọi cuộc trò chuyện đều bắt đầu từ một tín hiệu.
        </p>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-around items-center bg-bg-secondary border border-border-subtle p-3">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-neutral-400 hover:text-accent-gold hover:bg-white/5 border border-border-subtle transition-all duration-300"
        >
          <Github className="w-4 h-4" />
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-neutral-400 hover:text-accent-gold hover:bg-white/5 border border-border-subtle transition-all duration-300"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <a 
          href="mailto:tranqlong0306@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-neutral-400 hover:text-accent-gold hover:bg-white/5 border border-border-subtle transition-all duration-300"
        >
          <Mail className="w-4 h-4" />
        </a>
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-neutral-400 hover:text-accent-gold hover:bg-white/5 border border-border-subtle transition-all duration-300"
        >
          <Twitter className="w-4 h-4" />
        </a>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Họ và tên</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formState.name}
            onChange={handleFormChange}
            required
            className="w-full bg-[#0a0a10] border border-border-subtle focus:border-accent-gold rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            placeholder="Nguyễn Văn A"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Địa chỉ Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formState.email}
            onChange={handleFormChange}
            required
            className="w-full bg-[#0a0a10] border border-border-subtle focus:border-accent-gold rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            placeholder="example@email.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Nội dung lời nhắn</label>
          <textarea 
            id="message" 
            name="message" 
            rows={4}
            value={formState.message}
            onChange={handleFormChange}
            required
            className="w-full bg-[#0a0a10] border border-border-subtle focus:border-accent-gold rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-all resize-none"
            placeholder="Tôi muốn cộng tác nghiên cứu về..."
          />
        </div>

        {submitStatus === 'success' && (
          <div className="flex items-center space-x-2 text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/30 p-3 rounded">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Cảm ơn bạn! Lời nhắn của bạn đã được gửi đi thành công.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/20 border border-rose-900/30 p-3 rounded">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Không thể gửi lời nhắn. Vui lòng thử lại sau.</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={submitStatus === 'loading'}
          className="w-full flex items-center justify-center space-x-2 bg-accent-gold hover:bg-accent-gold/90 text-[#050508] font-semibold py-2.5 rounded text-sm transition-all duration-300 shadow-md group cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {submitStatus === 'loading' ? (
            <div className="w-5 h-5 border-2 border-[#050508] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              <span>Gửi Tín Hiệu</span>
            </>
          )}
        </button>
      </form>
    </div>
  );

  const getHeaderIcon = () => {
    const iconClass = "w-5 h-5 text-accent-gold";
    switch (activePanel) {
      case 'about': return <User className={iconClass} />;
      case 'skills': return <Code className={iconClass} />;
      case 'projects': return <Github className={iconClass} />;
      case 'blog': return <FileText className={iconClass} />;
      case 'contact': return <Mail className={iconClass} />;
      default: return null;
    }
  };

  const getHeaderTitle = () => {
    switch (activePanel) {
      case 'about': return 'Giới thiệu';
      case 'skills': return 'Kỹ năng chuyên môn';
      case 'projects': return 'Dự án tiêu biểu';
      case 'blog': return 'Blog chia sẻ';
      case 'contact': return 'Kết nối với tôi';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {activePanel && (
        <>
          {/* Overlay background dim with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Sliding Glassmorphic Panel */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={`fixed z-50 overflow-y-auto scrollbar-none bg-bg-dark ${getPanelWidthClass()} p-6 sm:p-8 flex flex-col justify-between text-white pointer-events-auto`}
            role="dialog"
            aria-modal="true"
            aria-label={`${getHeaderTitle()} Panel`}
          >
            <div>
              {/* Header */}
              <header className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                <div className="flex items-center space-x-2.5">
                  {getHeaderIcon()}
                  <h2 className="text-base font-bold font-sans tracking-wide uppercase text-white">{getHeaderTitle()}</h2>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-1.5 border border-border-subtle rounded text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  aria-label="Đóng panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </header>

              {/* Content area */}
              <div className="pb-8">
                {activePanel === 'about' && renderAbout()}
                {activePanel === 'skills' && renderSkills()}
                {activePanel === 'projects' && renderProjects()}
                {activePanel === 'blog' && renderBlog()}
                {activePanel === 'contact' && renderContact()}
              </div>
            </div>

            {/* Footer metadata */}
            <footer className="text-[9px] text-neutral-600 uppercase tracking-widest text-center pt-4 border-t border-border-subtle">
              Hồ sơ năng lực Trần Quang Long © 2026
            </footer>
          </motion.div>

          {/* Blog Detail Overlay Modal */}
          <AnimatePresence>
            {selectedPost && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedPost(null)}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
                  aria-hidden="true"
                />
                
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative bg-bg-dark border border-border-subtle w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-none p-6 sm:p-8 z-10 shadow-2xl font-sans pointer-events-auto"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-blog-title"
                >
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-1.5 border border-border-subtle text-neutral-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
                    aria-label="Đóng bài viết"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="text-[9px] uppercase tracking-widest text-accent-gold font-bold mb-2">
                    {selectedPost.category} — {selectedPost.date}
                  </div>
                  <h1 id="modal-blog-title" className="text-lg sm:text-xl font-bold text-white mb-6 leading-tight border-b border-border-subtle pb-4 tracking-wide font-sans">
                    {selectedPost.title}
                  </h1>

                  {selectedPost.coverImage && (
                    <div className="w-full h-48 sm:h-64 overflow-hidden mb-6 border border-border-subtle bg-black/20">
                      <img 
                        src={selectedPost.coverImage} 
                        alt={selectedPost.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className="prose-custom max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                    <MarkdownRenderer>{selectedPost.content}</MarkdownRenderer>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
