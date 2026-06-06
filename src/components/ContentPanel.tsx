import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { mockBlogs } from "../data";
import { BlogPost } from "../types";
import ReactMarkdown from "react-markdown";

interface ContentPanelProps {
  activeSection: string | null;
  onClose: () => void;
}

// ----------------------------------------------------
// Sub-component definitions requested by layout structure
// ----------------------------------------------------

const AboutContent: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-4">
      <p className="body text-white">
        Tôi hiện hoạt động chính trong lĩnh vực giáo dục phổ thông quốc tế tại Việt Nam, chuyên trách việc kiến tạo môi trường nội trú lành mạnh, xây dựng văn hóa kỷ luật tích cực và ứng dụng các phương pháp Ngôn ngữ học Ứng dụng.
      </p>
      <p className="body">
        Bản thân tôi tin rằng một lớp học hay ký túc xá thành công phải là một <strong>"vòng tròn phục hồi"</strong>, nơi mọi học sinh đều cảm thấy an toàn về mặt cảm xúc, từ đó hạ thấp bộ lọc lo âu để tiếp thu tri thức hiệu quả nhất.
      </p>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-sans">Tập trung chuyên môn</span>
          <ul className="mt-2 text-xs space-y-2 text-neutral-300 font-sans">
            {data.skillsList.map((skill: string) => (
              <li key={skill}>— {skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-sans">Hệ giá trị cốt lõi</span>
          <ul className="mt-2 text-xs space-y-2 text-neutral-300 font-sans">
            <li>— An toàn tâm lý</li>
            <li>— Thấu cảm & Lắng nghe</li>
            <li>— Hỗ trợ cá nhân hóa</li>
            <li>— Tôn trọng dị biệt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProjectsList: React.FC<{
  projects: BlogPost[];
  onSelectProject: (blog: BlogPost) => void;
}> = ({ projects, onSelectProject }) => {
  const [activeTab, setActiveTab] = useState<"articles" | "ai-tools">("articles");
  const [activeAiTool, setActiveAiTool] = useState<"conflict" | "lesson" | "report">("conflict");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // AI Inputs
  const [conflictInput, setConflictInput] = useState({
    grade: "Lớp 9",
    severity: "Trung bình",
    incidentDescription: "",
  });
  const [lessonInput, setLessonInput] = useState({
    topic: "Giao tiếp thuyết phục trong kinh doanh",
    studentLevel: "IELTS 5.5 - B2",
    duration: "60 phút",
    linguisticFocus: "Giả thuyết Đầu vào của Krashen (i+1)",
  });
  const [reportInput, setReportInput] = useState({
    studentName: "Minh Anh",
    tone: "Đồng cảm, nâng đỡ và định hướng phục hồi",
    strengths: "Tự tin phát biểu, tham gia hoạt động nhóm rất nhiệt tình",
    growthAreas: "Hay làm việc riêng, thỉnh thoảng đi học trễ 5-10 phút",
  });

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiResult(null);

    let inputs = {};
    if (activeAiTool === "conflict") inputs = conflictInput;
    else if (activeAiTool === "lesson") inputs = lessonInput;
    else if (activeAiTool === "report") inputs = reportInput;

    try {
      const response = await fetch("/api/ai-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: `${activeAiTool}-advisor`, inputs }),
      });
      const data = await response.json();
      if (data.error) {
        setAiResult(`### Lỗi\n\n${data.error}`);
      } else {
        setAiResult(data.result);
      }
    } catch (err: any) {
      setAiResult(`### Lỗi Hệ thống\n\nKhông thể kết nối tới server. Chi tiết: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab("articles")}
          className={`py-2 px-4 text-xs uppercase tracking-wider font-sans font-medium border-b-2 transition-all duration-300 ${
            activeTab === "articles" ? "border-white text-white" : "border-transparent text-neutral-500"
          }`}
        >
          Selected Papers
        </button>
        <button
          onClick={() => setActiveTab("ai-tools")}
          className={`py-2 px-4 text-xs uppercase tracking-wider font-sans font-medium border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
            activeTab === "ai-tools" ? "border-white text-white" : "border-transparent text-neutral-500"
          }`}
        >
          <Sparkles className="w-3 h-3 text-accent" /> AI Assistants
        </button>
      </div>

      {activeTab === "articles" ? (
        <div className="space-y-4">
          {projects.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectProject(post)}
              className="group border border-white/5 p-4 hover:border-accent/50 transition-all duration-300 cursor-pointer bg-white/[0.01]"
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-widest font-sans">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-sm font-medium text-white mt-1.5 group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                {post.summary}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 font-sans">
          <div className="flex gap-2 mb-2">
            {(["conflict", "lesson", "report"] as const).map((tool) => (
              <button
                key={tool}
                onClick={() => {
                  setActiveAiTool(tool);
                  setAiResult(null);
                }}
                className={`text-[9px] uppercase tracking-wider py-1 px-2.5 border transition-all duration-200 ${
                  activeAiTool === tool
                    ? "bg-white text-black border-white"
                    : "border-white/10 text-neutral-400 hover:border-white/20"
                }`}
              >
                {tool === "conflict" && "Discipline"}
                {tool === "lesson" && "SLA Lesson"}
                {tool === "report" && "Reports"}
              </button>
            ))}
          </div>

          <form onSubmit={handleAiSubmit} className="space-y-3 border border-white/5 p-3.5 bg-black/40">
            {activeAiTool === "conflict" && (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-neutral-500 mb-1">Grade</label>
                    <select
                      value={conflictInput.grade}
                      onChange={(e) => setConflictInput({ ...conflictInput, grade: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    >
                      <option>Lớp 6 - 8</option>
                      <option>Lớp 9</option>
                      <option>Lớp 10</option>
                      <option>Lớp 11 - 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">Severity</label>
                    <select
                      value={conflictInput.severity}
                      onChange={(e) => setConflictInput({ ...conflictInput, severity: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    >
                      <option>Nhẹ</option>
                      <option>Trung bình</option>
                      <option>Nghiêm trọng</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Incident description</label>
                  <textarea
                    rows={2.5}
                    value={conflictInput.incidentDescription}
                    onChange={(e) => setConflictInput({ ...conflictInput, incidentDescription: e.target.value })}
                    placeholder="Mô tả hành vi/mâu thuẫn xảy ra..."
                    required
                    className="w-full bg-neutral-900 border border-white/5 p-2 text-xs text-white outline-none rounded-none resize-none"
                  />
                </div>
              </>
            )}

            {activeAiTool === "lesson" && (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-neutral-500 mb-1">Topic</label>
                    <input
                      type="text"
                      value={lessonInput.topic}
                      onChange={(e) => setLessonInput({ ...lessonInput, topic: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">Student Level</label>
                    <input
                      type="text"
                      value={lessonInput.studentLevel}
                      onChange={(e) => setLessonInput({ ...lessonInput, studentLevel: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-neutral-500 mb-1">Duration</label>
                    <input
                      type="text"
                      value={lessonInput.duration}
                      onChange={(e) => setLessonInput({ ...lessonInput, duration: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">SLA Theory Focus</label>
                    <input
                      type="text"
                      value={lessonInput.linguisticFocus}
                      onChange={(e) => setLessonInput({ ...lessonInput, linguisticFocus: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                </div>
              </>
            )}

            {activeAiTool === "report" && (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-neutral-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={reportInput.studentName}
                      onChange={(e) => setReportInput({ ...reportInput, studentName: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">Tone</label>
                    <select
                      value={reportInput.tone}
                      onChange={(e) => setReportInput({ ...reportInput, tone: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    >
                      <option>Đồng cảm, nâng đỡ và định hướng phục hồi</option>
                      <option>Nghiêm túc, phản ánh trung thực</option>
                      <option>Khích lệ mạnh mẽ và chuyên môn cao</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <label className="block text-neutral-500 mb-1">Strengths</label>
                    <input
                      type="text"
                      value={reportInput.strengths}
                      onChange={(e) => setReportInput({ ...reportInput, strengths: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">Growth Areas</label>
                    <input
                      type="text"
                      value={reportInput.growthAreas}
                      onChange={(e) => setReportInput({ ...reportInput, growthAreas: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/5 p-2 text-white outline-none rounded-none"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={aiLoading}
              className="w-full bg-white text-black py-2 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex justify-center items-center gap-1.5 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Fetching Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" /> Generate Proposal
                </>
              )}
            </button>
          </form>

          {aiResult && (
            <div className="border border-white/5 bg-black/30 p-4 animate-fade-in font-sans">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-2 border-b border-white/5 pb-1">
                Gemini Response
              </span>
              <div className="prose-custom text-xs">
                <ReactMarkdown>{aiResult}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SkillsGrid: React.FC<{ skills: any[] }> = ({ skills }) => {
  return (
    <div className="space-y-6 pt-2 font-sans">
      {skills.map((skill) => (
        <div key={skill.name} className="space-y-2">
          <div className="flex justify-between items-baseline">
            <h4 className="text-sm font-medium text-white">{skill.name}</h4>
            <span className="num-tabular text-xs text-neutral-400">{skill.level}</span>
          </div>
          <div className="h-[1px] w-full bg-white/10">
            <div
              className="h-full bg-accent transition-all duration-1000"
              style={{ width: skill.level }}
            />
          </div>
          <p className="text-xs text-neutral-400">
            {skill.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

const BeliefsList: React.FC<{ beliefs: any }> = ({ beliefs }) => {
  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="border border-white/5 p-4 bg-white/[0.01]">
        <h3 className="text-sm font-semibold text-white mb-2">1. Vòng Tròn Phục Hồi (Restorative Circles)</h3>
        <p className="text-neutral-400 leading-relaxed">
          {beliefs.circles}
        </p>
        <div className="mt-4 p-3 bg-neutral-900/60 border border-white/5 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-medium">Quy trình 3 bước phục hồi:</span>
          <div className="grid grid-cols-3 gap-2 text-center text-[9px] text-white">
            <div className="p-1 border border-white/5">1. Active Listening</div>
            <div className="p-1 border border-white/5">2. Harm Reflection</div>
            <div className="p-1 border border-white/5">3. Agreement Draft</div>
          </div>
        </div>
      </div>

      <div className="border border-white/5 p-4 bg-white/[0.01]">
        <h3 className="text-sm font-semibold text-white mb-2">2. Giả thuyết Bộ lọc Tình cảm (Affective Filter)</h3>
        <p className="text-neutral-400 leading-relaxed">
          {beliefs.filter}
        </p>
      </div>
    </div>
  );
};

const PostsList: React.FC<{
  posts: BlogPost[];
  onSelectPost: (blog: BlogPost) => void;
}> = ({ posts, onSelectPost }) => {
  return (
    <div className="space-y-5 font-sans">
      {posts.map((post) => (
        <article
          key={post.id}
          onClick={() => onSelectPost(post)}
          className="group py-3.5 border-b border-white/5 hover:border-accent/40 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-baseline text-[10px]">
            <span className="num-tabular text-neutral-500">{post.date}</span>
            <span className="uppercase tracking-wider text-neutral-500 border border-white/10 px-1.5 py-0.5">
              {post.category}
            </span>
          </div>
          <h3 className="text-sm font-medium text-white mt-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
            {post.summary}
          </p>
        </article>
      ))}
    </div>
  );
};

const ContactInfo: React.FC = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();
      if (data.success) {
        setContactStatus("success");
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setContactStatus("error");
      }
    } catch (err) {
      setContactStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      {contactStatus === "success" ? (
        <div className="border border-white/5 p-5 text-center space-y-3 bg-white/[0.01] font-sans">
          <h3 className="text-sm font-semibold text-white">Tin nhắn đã được gửi đi!</h3>
          <p className="text-xs text-neutral-400">
            Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi qua email của bạn sớm nhất.
          </p>
          <button
            onClick={() => setContactStatus("idle")}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-white underline mt-2"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-3 font-sans text-xs">
          <div>
            <label className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">Name</label>
            <input
              type="text"
              required
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full bg-neutral-950 border border-white/5 p-2.5 text-white outline-none focus:border-accent transition-colors rounded-none"
            />
          </div>
          <div>
            <label className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">Email</label>
            <input
              type="email"
              required
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="name@school.edu.vn"
              className="w-full bg-neutral-950 border border-white/5 p-2.5 text-white outline-none focus:border-accent transition-colors rounded-none"
            />
          </div>
          <div>
            <label className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="Nội dung thảo luận của bạn..."
              className="w-full bg-neutral-950 border border-white/5 p-2.5 text-white outline-none focus:border-accent transition-colors rounded-none resize-none"
            />
          </div>

          {contactStatus === "error" && (
            <p className="text-xs text-red-500">Đã xảy ra lỗi khi gửi. Vui lòng thử lại sau.</p>
          )}

          <button
            type="submit"
            disabled={contactStatus === "sending"}
            className="w-full bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex justify-center items-center gap-1.5 disabled:opacity-50"
          >
            {contactStatus === "sending" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-3 h-3" /> Submit Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

// ----------------------------------------------------
// Main sliding ContentPanel component
// ----------------------------------------------------

export const ContentPanel: React.FC<ContentPanelProps> = ({ activeSection, onClose }) => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Define section data models to adapt to user specs structure
  const sectionsData: Record<
    string,
    { index: string; title: string; subtitle: string; type: string; content: any }
  > = {
    About: {
      index: "01",
      title: "About",
      subtitle: "Cố vấn Giáo dục & Chuyên gia Phát triển Đời sống Học sinh nội trú",
      type: "about",
      content: {
        skillsList: [
          "Công lý Phục hồi & Kỷ luật Tích cực",
          "Ngôn ngữ học ứng dụng (SLA)",
          "Quản lý đời sống nội trú học đường",
          "EdTech & Ứng dụng AI",
        ],
      },
    },
    Work: {
      index: "02",
      title: "Work",
      subtitle: "Dự án giáo dục & bài viết chuyên môn",
      type: "work",
      content: mockBlogs.filter((post) => post.featured),
    },
    Skills: {
      index: "03",
      title: "Skills",
      subtitle: "Khung năng lực kiểm soát vi mô",
      type: "skills",
      content: [
        {
          name: "Student Life Management & Safety",
          level: "95%",
          desc: "Tổ chức quy chế nội trú tự quản, xây dựng SLA quản lý phòng trực, giám sát kỹ lưỡng và duy trì môi trường đa văn hóa an toàn.",
        },
        {
          name: "Restorative Practices & Mediation",
          level: "90%",
          desc: "Điều phối các cuộc họp hòa giải mâu thuẫn (conferences), hướng dẫn học sinh tự giải quyết dựa trên kỷ luật tích cực.",
        },
        {
          name: "Applied Linguistics & SLA Scaffolding",
          level: "85%",
          desc: "Áp dụng lý thuyết hấp thụ ngôn ngữ tự nhiên (SLA) vào thiết lập giàn giáo giúp giảm rào cản cảm xúc lo âu.",
        },
        {
          name: "EdTech & AI System Integration",
          level: "88%",
          desc: "Phát triển các công cụ hỗ trợ giáo án thông minh, hệ quản trị nội dung tích hợp mô hình ngôn ngữ lớn.",
        },
      ],
    },
    Philosophy: {
      index: "04",
      title: "Philosophy",
      subtitle: "Vòng tròn phục hồi & bộ lọc Krashen",
      type: "philosophy",
      content: {
        circles:
          "Thay vì tập trung trừng phạt hoặc lập biên bản hành chính, chúng tôi đưa học sinh vào một vòng tròn đối thoại bình đẳng. Quy trình này đòi hỏi người vi phạm lắng nghe tổn thương từ người bị hại, tự nhìn nhận trách nhiệm và đề xuất kế hoạch hành động sửa chữa lỗi lầm.",
        filter:
          "Stephen Krashen chứng minh rằng rào cản cảm xúc (sợ hãi, lo âu) sẽ ngăn chặn não bộ tiếp thu ngôn ngữ. Chúng tôi kiến tạo không gian sinh hoạt thoải mái nhất để hạ thấp bộ lọc này về mức tối thiểu, gia tăng khả năng hội nhập tự nhiên của học sinh.",
      },
    },
    Journal: {
      index: "05",
      title: "Journal",
      subtitle: "Nhật ký quan sát học đường",
      type: "journal",
      content: mockBlogs,
    },
    Contact: {
      index: "06",
      title: "Contact",
      subtitle: "Kết nối chuyên môn & trao đổi",
      type: "contact",
      content: {},
    },
  };

  const section = activeSection ? sectionsData[activeSection] : null;

  // Accessibility Focus Trap Implementation
  useEffect(() => {
    if (!activeSection) return;

    const focusableElementsSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const panel = panelRef.current;
    if (!panel) return;

    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      const focusableElements = panel.querySelectorAll(focusableElementsSelector);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Trap focus
      firstElement.focus();

      const handleTabTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener("keydown", handleTabTrap);
      return () => window.removeEventListener("keydown", handleTabTrap);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [activeSection]);

  // Lock body scroll when panel is active
  useEffect(() => {
    if (activeSection) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeSection]);

  return (
    <>
      <AnimatePresence>
        {activeSection && section && (
          <>
            {/* Background Backdrop Overlay with opacity fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-40 pointer-events-auto"
            />

            {/* Sliding Drawer Container with Spring Animation */}
            <motion.div
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[480px] max-w-[90vw] bg-[#0E0E0E]/95 border-l border-white/10 p-8 z-50 overflow-y-auto scrollbar-none flex flex-col justify-between pointer-events-auto"
            >
              <div>
                {/* Header */}
                <header className="border-b border-white/10 pb-4 mb-8 flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="meta">{section.index}</span>
                    <h2 className="text-display mt-1 text-white">{section.title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="meta border border-white/20 hover:border-white/50 text-white px-3 py-1 font-sans transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </header>

                {/* Subtitle */}
                <p className="text-display-italic mb-8">{section.subtitle}</p>

                {/* Dynamic Content Area */}
                <div className="space-y-6">
                  {section.type === "about" && <AboutContent data={section.content} />}
                  {section.type === "work" && (
                    <ProjectsList projects={section.content} onSelectProject={setSelectedBlog} />
                  )}
                  {section.type === "skills" && <SkillsGrid skills={section.content} />}
                  {section.type === "philosophy" && <BeliefsList beliefs={section.content} />}
                  {section.type === "journal" && (
                    <PostsList posts={section.content} onSelectPost={setSelectedBlog} />
                  )}
                  {section.type === "contact" && <ContactInfo />}
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-16 pt-6 border-t border-white/10 meta text-neutral-500 font-sans">
                © MMXXVI · Quang Long
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Blog Overlay Modal for Reading Details */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative bg-[#0F0F0F] border border-neutral-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-none p-8 z-10 shadow-2xl font-sans pointer-events-auto"
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-1.5 border border-white/10 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                {selectedBlog.category} — {selectedBlog.date}
              </div>
              <h1 className="text-2xl font-medium font-display text-white mb-6 leading-tight border-b border-white/5 pb-4">
                {selectedBlog.title}
              </h1>

              <div className="prose-custom">
                <ReactMarkdown>{selectedBlog.content}</ReactMarkdown>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
