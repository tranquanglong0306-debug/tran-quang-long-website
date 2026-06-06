import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ProjectItem {
  title: string;
  cat: string;
  year: string;
  note: string;
}

interface ProjectsListProps {
  projects: ProjectItem[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState<"projects" | "ai-tools">("projects");
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
    <div className="space-y-4 font-sans">
      {/* Sub tabs */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab("projects")}
          className={`py-2 px-4 text-xs uppercase tracking-wider font-sans font-medium border-b-2 transition-all duration-300 ${
            activeTab === "projects" ? "border-white text-white" : "border-transparent text-neutral-500"
          }`}
        >
          Selected Projects
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

      {activeTab === "projects" ? (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-white/5 p-4 bg-white/[0.01] hover:border-accent/40 transition-colors"
            >
              <div className="flex justify-between items-baseline text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                <span>{project.cat}</span>
                <span className="num-tabular">{project.year}</span>
              </div>
              <h3 className="text-sm font-medium text-white mt-1.5">{project.title}</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {project.note}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
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
                    placeholder="Mô tả sự việc..."
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
                    <label className="block text-neutral-500 mb-1">Linguistic Focus</label>
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
              className="w-full bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex justify-center items-center gap-1.5 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Generation in progress...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" /> Draft with Gemini
                </>
              )}
            </button>
          </form>

          {aiResult && (
            <div className="border border-white/5 bg-black/30 p-4 animate-fade-in">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-2 border-b border-white/5 pb-1">
                Gemini Advisory Output
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

export default ProjectsList;
