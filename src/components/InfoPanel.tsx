import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, MapPin, Briefcase, Clock, CheckCircle, 
  Mail, Linkedin, Github, Twitter, Send, Code, 
  BookOpen, ExternalLink, ShieldAlert
} from 'lucide-react';
import { useAppState } from '../store';

interface InfoPanelProps {
  isMobile: boolean;
  isTablet: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ isMobile, isTablet }) => {
  const { activePanel, setActivePanel } = useAppState();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Reset form when panel switches
  useEffect(() => {
    setFormState({ name: '', email: '', message: '' });
    setSubmitStatus('idle');
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
    if (isMobile) return 'w-full h-[85vh] bottom-0 left-0 rounded-t-3xl border-t';
    if (isTablet) return 'w-[80vw] h-full right-0 top-0 border-l';
    return 'w-[480px] h-full right-0 top-0 border-l';
  };

  // Render About section
  const renderAbout = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Image Glow Border */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative w-28 h-28 rounded-full border-2 border-blue-400 overflow-hidden bg-[#1e293b] flex items-center justify-center">
            <span className="text-4xl font-bold font-sans text-blue-400 tracking-wider">QL</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white tracking-wide">Trần Quang Long</h3>
          <p className="text-sm text-blue-400 tracking-wider font-medium uppercase mt-1">Chuyên gia Đời sống Học sinh & Ngôn ngữ học Ứng dụng</p>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-6">
        <div className="flex items-start space-x-3 text-sm">
          <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-neutral-400 font-medium">Vai trò: </span>
            <span className="text-neutral-200">Trưởng bộ phận Đời sống Học sinh (Student Life Director)</span>
          </div>
        </div>
        <div className="flex items-start space-x-3 text-sm">
          <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-neutral-400 font-medium">Địa điểm: </span>
            <span className="text-neutral-200">Thành phố Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
        <div className="flex items-start space-x-3 text-sm">
          <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-neutral-400 font-medium">Trạng thái: </span>
            <span className="text-emerald-400 font-medium">Sẵn sàng nghiên cứu & cố vấn giáo dục</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-6">
        <h4 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold">Tiểu sử bản thân</h4>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Tôi là một chuyên gia trong lĩnh vực quản trị đời sống học sinh và ngôn ngữ học ứng dụng trong môi trường học đường quốc tế. Triết lý hành chính của tôi tập trung vào Công lý Phục hồi (Restorative Justice) và Kỷ luật Tích cực (Positive Discipline), nhằm xây dựng những cộng đồng nơi sửa đổi hành vi đi kèm với phát triển trí tuệ cảm xúc và xã hội.
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Về mặt học thuật, tôi nghiên cứu cách áp dụng các lý thuyết Thụ đắc Ngôn ngữ Thứ hai (SLA) vào cải thiện sức khỏe tinh thần học sinh, thiết lập môi trường giao tiếp thực tế giúp hạ thấp bộ lọc nhận thức (affective filter). Tôi thiết kế các giải pháp hỗ trợ giúp học sinh đa văn hóa cùng cộng tác và phát triển toàn diện.
        </p>
      </div>
    </div>
  );

  // Render Skills section
  const renderSkills = () => {
    const skillCategories = [
      {
        title: 'Quản trị Giáo dục & Đời sống Học sinh',
        icon: <BookOpen className="w-4 h-4 text-purple-400" />,
        skills: [
          { name: 'Kỷ luật Tích cực (Positive Discipline)', level: 95 },
          { name: 'Công lý Phục hồi (Restorative Justice)', level: 90 },
          { name: 'Hệ thống Sức khỏe Tinh thần Học sinh', level: 88 },
          { name: 'Giải quyết Mâu thuẫn (Conflict Resolution)', level: 92 }
        ]
      },
      {
        title: 'Ngôn ngữ học Ứng dụng',
        icon: <User className="w-4 h-4 text-purple-400" />,
        skills: [
          { name: 'Dàn ý hỗ trợ SLA (SLA Scaffolding)', level: 94 },
          { name: 'Năng lực Giao tiếp Thực tế', level: 90 },
          { name: 'Phân tích Ngôn ngữ Xã hội (Sociolinguistics)', level: 85 }
        ]
      },
      {
        title: 'Công nghệ & Lập trình Web',
        icon: <Code className="w-4 h-4 text-purple-400" />,
        skills: [
          { name: 'React & Vite', level: 85 },
          { name: 'Three.js / React Three Fiber', level: 80 },
          { name: 'TypeScript / JavaScript', level: 82 },
          { name: 'Node.js & Python', level: 75 }
        ]
      }
    ];

    return (
      <div className="space-y-6">
        <p className="text-sm text-neutral-300 leading-relaxed border-b border-white/5 pb-4">
          Sự kết hợp giữa chuyên môn sư phạm, nghiên cứu giao tiếp và ứng dụng công nghệ để quản lý dữ liệu đời sống học sinh hiện đại.
        </p>

        <div className="space-y-6">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center space-x-2">
                {cat.icon}
                <h4 className="text-sm font-semibold text-purple-200 tracking-wide">{cat.title}</h4>
              </div>
              <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-neutral-300 font-medium">{skill.name}</span>
                      <span className="text-purple-400 font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Projects section
  const renderProjects = () => {
    const projects = [
      {
        title: 'Nền tảng Hỗ trợ Hòa giải Công lý Phục hồi',
        desc: 'Ứng dụng web dành cho cố vấn học đường trường quốc tế để quản lý các buổi thảo luận vòng tròn, lưu trữ biên bản cam kết sửa đổi hành vi kỹ thuật số.',
        tech: ['React', 'TypeScript', 'Node.js', 'Firebase'],
        demoUrl: '#',
        githubUrl: '#'
      },
      {
        title: 'Bảng Đo lường Tốc độ Thụ đắc Ngôn ngữ SLA',
        desc: 'Bảng theo dõi hành vi tương tác đo lường sự tự tin giao tiếp tiếng Anh của học sinh tại các không gian sinh hoạt tự do để tối ưu hóa bộ lọc cảm xúc.',
        tech: ['Three.js', 'React', 'TailwindCSS', 'Zustand'],
        demoUrl: '#',
        githubUrl: '#'
      },
      {
        title: 'Kho lưu trữ Nghiên cứu Tương tác 3D',
        desc: 'Kho tư liệu lưu trữ các bài nghiên cứu về ngôn ngữ học ứng dụng, kỷ luật tích cực và hệ thống khảo thí giáo dục quốc tế dưới giao diện 3D trực quan.',
        tech: ['React Three Fiber', 'Framer Motion', 'Tailwind'],
        demoUrl: '#',
        githubUrl: '#'
      }
    ];

    return (
      <div className="space-y-6">
        <p className="text-sm text-neutral-300 leading-relaxed border-b border-white/5 pb-4">
          Các dự án và hệ thống quản trị tiêu biểu được phát triển nhằm hỗ trợ dịch vụ học sinh và nghiên cứu dữ liệu ngôn ngữ học.
        </p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 hover:border-pink-500/50 rounded-xl p-5 transition-all duration-300 group shadow-lg"
            >
              <h4 className="text-base font-bold text-white tracking-wide group-hover:text-pink-400 transition-colors duration-300">
                {proj.title}
              </h4>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                {proj.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {proj.tech.map((t, tIdx) => (
                  <span key={tIdx} className="text-[10px] bg-pink-950/40 text-pink-300 px-2 py-0.5 rounded border border-pink-900/30 font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-white/5">
                <a 
                  href={proj.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Trải nghiệm</span>
                </a>
                <a 
                  href={proj.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white font-medium transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render Contact section
  const renderContact = () => (
    <div className="space-y-6">
      <p className="text-sm text-neutral-300 leading-relaxed">
        Kết nối với tôi để trao đổi chuyên môn về giảng dạy, xây dựng quy trình kỷ luật tích cực, thiết kế hội nghị phục hồi học đường hoặc cộng tác nghiên cứu.
      </p>

      {/* Social Media Links */}
      <div className="flex justify-around items-center bg-white/5 border border-white/10 p-4 rounded-xl">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-white/5 text-neutral-300 hover:text-cyan-400 hover:bg-white/10 border border-white/10 transition-all duration-300 shadow-md"
        >
          <Github className="w-5 h-5" />
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-white/5 text-neutral-300 hover:text-cyan-400 hover:bg-white/10 border border-white/10 transition-all duration-300 shadow-md"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a 
          href="mailto:tranqlong0306@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-white/5 text-neutral-300 hover:text-cyan-400 hover:bg-white/10 border border-white/10 transition-all duration-300 shadow-md"
        >
          <Mail className="w-5 h-5" />
        </a>
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-white/5 text-neutral-300 hover:text-cyan-400 hover:bg-white/10 border border-white/10 transition-all duration-300 shadow-md"
        >
          <Twitter className="w-5 h-5" />
        </a>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Họ và tên</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formState.name}
            onChange={handleFormChange}
            required
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            placeholder="Nguyễn Văn A"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Địa chỉ Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formState.email}
            onChange={handleFormChange}
            required
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
            placeholder="example@email.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Nội dung lời nhắn</label>
          <textarea 
            id="message" 
            name="message" 
            rows={4}
            value={formState.message}
            onChange={handleFormChange}
            required
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all resize-none"
            placeholder="Tôi muốn cộng tác nghiên cứu về..."
          />
        </div>

        {submitStatus === 'success' && (
          <div className="flex items-center space-x-2 text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Cảm ơn bạn! Lời nhắn của bạn đã được gửi đi thành công.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/20 border border-rose-900/30 p-3 rounded-lg">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Không thể gửi lời nhắn. Vui lòng thử lại sau.</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={submitStatus === 'loading'}
          className="w-full relative flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-300 shadow-md group cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {submitStatus === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              <span>Gửi lời nhắn</span>
            </>
          )}
        </button>
      </form>
    </div>
  );

  const getHeaderIcon = () => {
    switch (activePanel) {
      case 'about': return <User className="w-6 h-6 text-blue-400" />;
      case 'skills': return <Code className="w-6 h-6 text-purple-400" />;
      case 'projects': return <Github className="w-6 h-6 text-pink-400" />;
      case 'contact': return <Mail className="w-6 h-6 text-cyan-400" />;
      default: return null;
    }
  };

  const getHeaderTitle = () => {
    switch (activePanel) {
      case 'about': return 'Giới thiệu';
      case 'skills': return 'Kỹ năng chuyên môn';
      case 'projects': return 'Dự án tiêu biểu';
      case 'contact': return 'Kết nối với tôi';
      default: return '';
    }
  };

  const getBorderColorClass = () => {
    switch (activePanel) {
      case 'about': return 'border-blue-500/25';
      case 'skills': return 'border-purple-500/25';
      case 'projects': return 'border-pink-500/25';
      case 'contact': return 'border-cyan-500/25';
      default: return 'border-white/20';
    }
  };

  const getGlowShadow = () => {
    switch (activePanel) {
      case 'about': return 'shadow-[0_0_50px_rgba(59,130,246,0.15)]';
      case 'skills': return 'shadow-[0_0_50px_rgba(147,51,234,0.15)]';
      case 'projects': return 'shadow-[0_0_50px_rgba(219,39,119,0.15)]';
      case 'contact': return 'shadow-[0_0_50px_rgba(8,145,178,0.15)]';
      default: return 'shadow-2xl';
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
            className={`fixed z-50 overflow-y-auto scrollbar-none bg-black/75 backdrop-blur-xl border-white/10 ${getPanelWidthClass()} ${getBorderColorClass()} ${getGlowShadow()} p-6 sm:p-8 flex flex-col justify-between text-white pointer-events-auto`}
            role="dialog"
            aria-modal="true"
            aria-label={`${getHeaderTitle()} Panel`}
          >
            <div>
              {/* Header */}
              <header className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center space-x-2.5">
                  {getHeaderIcon()}
                  <h2 className="text-xl font-bold font-sans tracking-wide">{getHeaderTitle()}</h2>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-1.5 border border-white/10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  aria-label="Đóng panel"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </header>

              {/* Content area */}
              <div className="pb-8">
                {activePanel === 'about' && renderAbout()}
                {activePanel === 'skills' && renderSkills()}
                {activePanel === 'projects' && renderProjects()}
                {activePanel === 'contact' && renderContact()}
              </div>
            </div>

            {/* Footer metadata */}
            <footer className="text-[10px] text-neutral-500 uppercase tracking-widest text-center pt-4 border-t border-white/5">
              Hồ sơ năng lực Trần Quang Long © 2026
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
