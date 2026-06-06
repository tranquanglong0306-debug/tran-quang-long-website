import React, { useState } from "react";
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
  ArrowLeft
} from "lucide-react";
import { AIToolType, ConflictInput, LessonPlanInput, ReportInput } from "../types";

export default function AIEducatorAssistant() {
  const [activeTool, setActiveTool] = useState<AIToolType>("conflict-advisor");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    const sequences = [
      "Đang kết nối Mô hình Giáo dục Gemini...",
      "Đang cấu trúc các ràng buộc sư phạm...",
      "Đang phân tích các chỉ số ngôn ngữ...",
      "Đang tinh chỉnh các yếu tố phục hồi...",
      "Đang định hình văn bản kết quả...",
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
    <div className="w-full relative z-10 text-left">
      {/* Tool Selector Buttons Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            id: "conflict-advisor",
            label: "Cố vấn Hoà giải",
            desc: "Kịch bản đối thoại phục hồi hành vi",
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
            desc: "Nhận xét thấu cảm gửi phụ huynh",
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
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? "bg-white/[0.04] border-white/30 shadow-lg"
                  : "glass-card border-white/5 hover:border-white/15"
              }`}
            >
              {/* Active top line */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white" />
              )}

              <div className="flex gap-3 items-center">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isSelected ? "bg-white/10 text-white" : "bg-white/5 text-white/40 group-hover:text-white"
                  }`}
                >
                  <ToolIcon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-xs md:text-sm text-white">{toolItem.label}</h5>
                  <span className="font-mono text-[10px] text-white/40 block mt-0.5">{toolItem.desc}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form + Results Screen Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Dynamic Input Frame */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <form onSubmit={handleAISubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-white/5">
              <Terminal className="w-4 h-4 text-white/60" />
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest font-semibold">
                THÔNG SỐ ĐẦU VÀO MÔ HÌNH
              </span>
            </div>

            {/* Render Conflict Advisor Form */}
            {activeTool === "conflict-advisor" && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Khối lớp học sinh</label>
                  <select
                    value={conflictInput.grade}
                    onChange={(e) => setConflictInput({ ...conflictInput, grade: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs border border-white/10 focus:border-white bg-black text-white cursor-pointer"
                  >
                    <option>THCS / Trung học cơ sở (Lớp 6-8)</option>
                    <option>Trung học (Lớp 9-10)</option>
                    <option>Dự bị Đại học / THPT (Lớp 11-12)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Mức độ nghiêm trọng</label>
                  <select
                    value={conflictInput.severity}
                    onChange={(e) => setConflictInput({ ...conflictInput, severity: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs border border-white/10 focus:border-white bg-black text-white cursor-pointer"
                  >
                    <option>Nhẹ / Tranh cãi ồn ào</option>
                    <option>Vừa phải / Bắt nạt, chia bè phái</option>
                    <option>Nghiêm trọng / Mâu thuẫn hệ thống phức tạp</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Mô tả cuộc xung đột cụ thể</label>
                  <textarea
                    rows={4}
                    value={conflictInput.incidentDescription}
                    onChange={(e) => setConflictInput({ ...conflictInput, incidentDescription: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs leading-relaxed border border-white/10 bg-black text-white focus:border-white"
                  />
                </div>
              </>
            )}

            {/* Render Lesson Planner Form */}
            {activeTool === "lesson-planner" && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Đề tài bài học giáo án</label>
                  <input
                    type="text"
                    value={lessonInput.topic}
                    onChange={(e) => setLessonInput({ ...lessonInput, topic: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs border border-white/10 focus:border-white bg-black text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans font-semibold text-xs text-white/75">Trình độ SLA</label>
                    <select
                      value={lessonInput.studentLevel}
                      onChange={(e) => setLessonInput({ ...lessonInput, studentLevel: e.target.value })}
                      className="glass-input p-3 rounded-lg text-xs border border-white/10 focus:border-white bg-black text-white cursor-pointer"
                    >
                      <option>Sơ cấp (A1-A2)</option>
                      <option>Tiếng Anh Trung cấp (B2)</option>
                      <option>Học thuật Cao cấp (C1)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans font-semibold text-xs text-white/75">Thời lượng</label>
                    <input
                      type="text"
                      value={lessonInput.duration}
                      onChange={(e) => setLessonInput({ ...lessonInput, duration: e.target.value })}
                      className="glass-input p-3 rounded-lg text-xs border border-white/10 focus:border-white bg-black text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Trọng tâm Ngôn ngữ học</label>
                  <input
                    type="text"
                    value={lessonInput.linguisticFocus}
                    onChange={(e) => setLessonInput({ ...lessonInput, linguisticFocus: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs border border-white/10 focus:border-white bg-black text-white"
                  />
                </div>
              </>
            )}

            {/* Render Report Card Form */}
            {activeTool === "report-drafter" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans font-semibold text-xs text-white/75">Tên học sinh</label>
                    <input
                      type="text"
                      value={reportInput.studentName}
                      onChange={(e) => setReportInput({ ...reportInput, studentName: e.target.value })}
                      className="glass-input p-3 rounded-lg text-xs border border-white/10 bg-black text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans font-semibold text-xs text-white/75">Giọng văn</label>
                    <select
                      value={reportInput.tone}
                      onChange={(e) => setReportInput({ ...reportInput, tone: e.target.value })}
                      className="glass-input p-3 rounded-lg text-xs border border-white/10 bg-black text-white cursor-pointer"
                    >
                      <option>Đồng cảm & Khích lệ (Can thiệp Phục hồi)</option>
                      <option>Trực diện & Kiến tạo hành vi</option>
                      <option>Trang trọng & Học thuật</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Thế mạnh cốt lõi</label>
                  <input
                    type="text"
                    value={reportInput.strengths}
                    onChange={(e) => setReportInput({ ...reportInput, strengths: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs border border-white/10 bg-black text-white"
                    placeholder="Ví dụ: sẵn lòng giúp bạn học, tự tin giao tiếp"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-xs text-white/75">Điểm cần cải thiện</label>
                  <textarea
                    rows={3}
                    value={reportInput.growthAreas}
                    onChange={(e) => setReportInput({ ...reportInput, growthAreas: e.target.value })}
                    className="glass-input p-3 rounded-lg text-xs border border-white/10 bg-black text-white"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 px-6 rounded-xl bg-white hover:bg-white/90 transition-all text-black font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Đang xử lý phân tích...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  Gửi yêu cầu tổng hợp
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Screen Board */}
        <div className="glass-card rounded-2xl p-6 md:p-8 relative h-full flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/60" />
              <span className="font-mono text-xs text-white/40 tracking-widest uppercase font-semibold">
                KẾT QUẢ PHÂN TÍCH AI SƯ PHẠM
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-white/40 animate-pulse" />
          </div>

          <div className="flex-grow flex flex-col justify-center overflow-y-auto max-h-[500px] pr-2">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loader-panel"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <Loader2 className="w-10 h-10 text-white/60 animate-spin mb-4" />
                  <p className="font-sans font-medium text-white mb-2">{loadingStatus}</p>
                  <p className="font-mono text-[10px] text-white/40 animate-pulse">Vận hành mô hình ngôn ngữ lớn Gemini...</p>
                </motion.div>
              )}

              {errorMsg && !loading && (
                <motion.div
                  key="error-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-white/80 text-xs sm:text-sm font-sans"
                >
                  <p className="font-bold mb-1">Điểm nghẽn liên thông hệ thống:</p>
                  <p className="text-white/60 mb-3">{errorMsg}</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Lưu ý: Để kích hoạt API vận hành trực tiếp, vui lòng chắc chắn cấu hình mã bảo mật <strong>GEMINI_API_KEY</strong> trong bảng điều khiển <strong>Settings &gt; Secrets</strong> của AI Studio.
                  </p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body text-xs sm:text-sm text-white/80 leading-relaxed text-left"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              )}

              {!loading && !result && !errorMsg && (
                <motion.div
                  key="idle-panel"
                  className="text-center py-20 flex flex-col items-center justify-center"
                >
                  <div className="p-4 bg-white/5 rounded-full border border-white/10 mb-4 text-white/30 animate-pulse">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h6 className="font-sans font-bold text-white mb-1 text-xs uppercase tracking-wider">Đang đợi tham số đầu vào</h6>
                  <p className="text-[11px] text-white/40 font-sans max-w-xs leading-relaxed mt-1">
                    Vui lòng điền đầy đủ các thông số ở biểu thức bên trái và bấm nút "Gửi yêu cầu tổng hợp".
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
