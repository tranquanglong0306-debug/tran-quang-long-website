import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import {
  Brain,
  ShieldCheck,
  FileText,
  Loader2,
  Sparkles,
  Terminal,
  Send,
  HelpCircle,
} from "lucide-react";
import { AIToolType, ConflictInput, LessonPlanInput, ReportInput } from "../types";

export default function AIEducatorAssistant() {
  const [activeTool, setActiveTool] = useState<AIToolType>("conflict-advisor");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States for discrete inputs
  const [conflictInput, setConflictInput] = useState<ConflictInput>({
    grade: "Trung học (Lớp 9-10)",
    severity: "Nhẹ / Tranh cãi ồn ào",
    incidentDescription: "Hai học sinh tranh cãi gay gắt tại khu vực tủ đồ cá nhân về điểm số dự án nhóm, dẫn đến việc cô lập bè phái và rào cản từ vựng xã hội.",
  });

  const [lessonInput, setLessonInput] = useState<LessonPlanInput>({
    topic: "Kiến tạo Thành ngữ Giao tiếp Hợp tác",
    studentLevel: "Tiếng Anh Trung cấp (B2)",
    duration: "45 Phút",
    linguisticFocus: "Bộ lọc lo âu của Krashen & Giàn giáo đầu ra của Swain",
  });

  const [reportInput, setReportInput] = useState<ReportInput>({
    studentName: "Nguyễn Minh Anh",
    tone: "Đồng cảm & Khích lệ (Can thiệp Phục hồi)",
    strengths: "Giao tiếp trôi chảy và tự tin trong các buổi thảo luận tự do, tích cực đồng hành nâng đỡ bạn học trong hoạt động nhóm.",
    growthAreas: "Đôi khi vào lớp muộn sau tiếng chuông, còn ngập ngừng khi tự viết các cấu trúc luận văn phức tạp.",
  });

  // Action dispatcher
  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    // Dynamic loading text sequences
    const sequences = [
      "Đang kết nối Mô hình Giáo dục Gemini...",
      "Đang cấu trúc các ràng buộc sư phạm...",
      "Đang phân tích các chỉ số ngôn ngữ của Krashen...",
      "Đang tinh chỉnh các yếu tố phục hồi...",
      "Đang định hình văn bản kết quả đầu ra...",
    ];

    let seqIdx = 0;
    setLoadingStatus(sequences[0]);
    const seqInterval = setInterval(() => {
      seqIdx = (seqIdx + 1) % sequences.length;
      setLoadingStatus(sequences[seqIdx]);
    }, 1300);

    const activeInputs =
      activeTool === "conflict-advisor"
        ? conflictInput
        : activeTool === "lesson-planner"
        ? lessonInput
        : reportInput;

    try {
      const response = await fetch("/api/ai-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: activeTool,
          inputs: activeInputs,
        }),
      });

      const data = await response.json();
      clearInterval(seqInterval);

      if (!response.ok) {
        throw new Error(data.error || "Gặp sự cố lỗi phản hồi từ máy chủ.");
      }

      setResult(data.result);
    } catch (error: any) {
      console.error(error);
      clearInterval(seqInterval);
      setErrorMsg(
        error.message || "Không thể kết nối với công cụ trí tuệ nhân tạo. Hãy kiểm tra khóa API của bạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Visual background lights */}
      <div className="absolute right-0 top-0 w-80 h-80 ambient-glow-navy blur-3xl pointer-events-none rounded-full" />

      {/* Tool Selector Buttons Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          {
            id: "conflict-advisor",
            label: "Cố vấn Hoà giải",
            desc: "Thiết lập kịch bản giảng giải mâu thuẫn",
            icon: ShieldCheck,
          },
          {
            id: "lesson-planner",
            label: "Thiết lập Giáo án",
            desc: "Giàn giáo lý thuyết Ngôn ngữ học",
            icon: Brain,
          },
          {
            id: "report-drafter",
            label: "Soạn thảo Nhận xét",
            desc: "Tạo văn bản đánh giá thấu hiểu phụ huynh",
            icon: FileText,
          },
        ].map((toolItem) => {
          const ToolIcon = toolItem.icon;
          const isSelected = activeTool === toolItem.id;

          return (
            <button
              key={toolItem.id}
              onClick={() => {
                setActiveTool(toolItem.id as AIToolType);
                setResult(null);
                setErrorMsg(null);
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? "bg-slate-900 border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                  : "glass-card border-white/5 hover:border-white/15"
              }`}
            >
              {/* Active neon strip */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-400" />
              )}

              <div className="flex gap-3 items-center">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected ? "bg-white/10 text-white" : "bg-white/5 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <ToolIcon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-display font-bold text-xs md:text-sm text-white">{toolItem.label}</h5>
                  <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{toolItem.desc}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form + Results Screen Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Dynamic Input Frame */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <form onSubmit={handleAISubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-white/5">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest font-semibold">
                THÔNG SỐ ĐẦU VÀO MÔ HÌNH
              </span>
            </div>

            {/* Render Conflict Advisor Form */}
            {activeTool === "conflict-advisor" && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Khối lớp học sinh</label>
                  <select
                    value={conflictInput.grade}
                    onChange={(e) => setConflictInput({ ...conflictInput, grade: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm border border-white/10 focus:border-blue-500 bg-slate-950 text-white cursor-pointer"
                  >
                    <option>THCS / Trung học cơ sở (Lớp 6-8)</option>
                    <option>Trung học (Lớp 9-10)</option>
                    <option>Dự bị Đại học / THPT (Lớp 11-12)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Mức độ nghiêm trọng của mâu thuẫn</label>
                  <select
                    value={conflictInput.severity}
                    onChange={(e) => setConflictInput({ ...conflictInput, severity: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm border border-white/10 focus:border-blue-500 bg-slate-950 text-white cursor-pointer"
                  >
                    <option>Nhẹ / Tranh cãi ồn ào</option>
                    <option>Vừa phải / Bắt nạt, chia bè phái</option>
                    <option>Nghiêm trọng / Mâu thuẫn hệ thống phức tạp</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Mô tả cuộc xung đột cụ thể</label>
                  <textarea
                    rows={4}
                    value={conflictInput.incidentDescription}
                    onChange={(e) => setConflictInput({ ...conflictInput, incidentDescription: e.target.value })}
                    className="glass-input p-3 rounded-xl text-xs sm:text-sm leading-relaxed border border-white/10 bg-slate-950 text-white focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {/* Render Lesson Planner Form */}
            {activeTool === "lesson-planner" && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Đề tài bài học giáo án</label>
                  <input
                    type="text"
                    value={lessonInput.topic}
                    onChange={(e) => setLessonInput({ ...lessonInput, topic: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm border border-white/10 focus:border-indigo-500 bg-slate-950 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-display font-medium text-xs text-slate-300">Trình độ SLA học sinh</label>
                    <select
                      value={lessonInput.studentLevel}
                      onChange={(e) => setLessonInput({ ...lessonInput, studentLevel: e.target.value })}
                      className="glass-input p-3 rounded-xl text-sm border border-white/10 focus:border-indigo-500 bg-slate-950 text-white cursor-pointer"
                    >
                      <option>Sơ cấp (A1-A2)</option>
                      <option>Tiếng Anh Trung cấp (B2)</option>
                      <option>Học thuật Cao cấp (C1)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-display font-medium text-xs text-slate-300">Thời lượng</label>
                    <input
                      type="text"
                      value={lessonInput.duration}
                      onChange={(e) => setLessonInput({ ...lessonInput, duration: e.target.value })}
                      className="glass-input p-3 rounded-xl text-sm border border-white/10 focus:border-indigo-500 bg-slate-950 text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Trọng tâm Ngôn ngữ học Ứng dụng</label>
                  <input
                    type="text"
                    value={lessonInput.linguisticFocus}
                    onChange={(e) => setLessonInput({ ...lessonInput, linguisticFocus: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm border border-white/10 focus:border-indigo-500 bg-slate-950 text-white"
                  />
                </div>
              </>
            )}

            {/* Render Report Card Form */}
            {activeTool === "report-drafter" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-display font-medium text-xs text-slate-300">Tên học sinh</label>
                    <input
                      type="text"
                      value={reportInput.studentName}
                      onChange={(e) => setReportInput({ ...reportInput, studentName: e.target.value })}
                      className="glass-input p-3 rounded-xl text-sm border border-white/10 bg-slate-950 text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-display font-medium text-xs text-slate-300">Giọng văn yêu thích</label>
                    <select
                      value={reportInput.tone}
                      onChange={(e) => setReportInput({ ...reportInput, tone: e.target.value })}
                      className="glass-input p-3 rounded-xl text-sm border border-white/10 bg-slate-950 text-white cursor-pointer"
                    >
                      <option>Đồng cảm & Khích lệ (Can thiệp Phục hồi)</option>
                      <option>Trực diện & Kiến tạo hành vi</option>
                      <option>Trang trọng & Học thuật</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Các thế mạnh cốt lõi nổi bật</label>
                  <input
                    type="text"
                    value={reportInput.strengths}
                    onChange={(e) => setReportInput({ ...reportInput, strengths: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm border border-white/10 bg-slate-950 text-white"
                    placeholder="Ví dụ: sẵn lòng giúp học sinh học yếu, giao tiếp lưu loát"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-medium text-xs text-slate-300">Các phương diện học tập cần cải thiện</label>
                  <textarea
                    rows={3}
                    value={reportInput.growthAreas}
                    onChange={(e) => setReportInput({ ...reportInput, growthAreas: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm border border-white/10 bg-slate-950 text-white"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-400 hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all text-white font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Đang xử lý phân tích...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  Gửi yêu cầu tổng hợp
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Screen Board */}
        <div className="glass-card rounded-3xl p-6 md:p-8 relative h-full flex flex-col min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs text-slate-350 tracking-widest uppercase font-semibold">
                KẾT QUẢ PHÂN TÍCH AI SƯ PHẠM
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          </div>

          <div className="flex-grow flex flex-col justify-center overflow-y-auto max-h-[500px] pr-2">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loader-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                  <p className="font-display font-medium text-white mb-2">{loadingStatus}</p>
                  <p className="font-mono text-[10px] text-indigo-400 animate-pulse">Đang vận hành mô hình siêu dữ liệu Gemini...</p>
                </motion.div>
              )}

              {errorMsg && !loading && (
                <motion.div
                  key="error-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-sans"
                >
                  <p className="font-bold mb-1">Điểm nghẽn liên thông hệ thống:</p>
                  <p className="text-white/70 mb-3">{errorMsg}</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Lưu ý: Để kích hoạt API vận hành trực tiếp, vui lòng chắc chắn cấu hình mã bảo mật <strong>GEMINI_API_KEY</strong> trong bảng điều khiển <strong>Settings &gt; Secrets</strong> của AI Studio.
                  </p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body text-xs sm:text-sm text-slate-200 leading-relaxed text-left"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              )}

              {!loading && !result && !errorMsg && (
                <motion.div
                  key="idle-panel"
                  className="text-center py-20 flex flex-col items-center justify-center"
                >
                  <div className="p-4 bg-white/5 rounded-full border border-white/10 mb-4 animate-float text-slate-400">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h6 className="font-display font-medium text-white mb-1 text-sm">Đang đợi tham số từ nhà sư sư phạm</h6>
                  <p className="text-xs text-slate-400 font-sans max-w-xs leading-relaxed">
                    Vui lòng hoàn thành các thông số nghiệp vụ sư phạm ở phía bên trái và nhấp "Gửi yêu cầu tổng hợp" để xây dựng kịch bản phục hồi nâng cao trong vài giây.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
