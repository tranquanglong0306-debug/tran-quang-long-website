import { useState } from "react";
import { motion } from "motion/react";
import { resourcesList } from "../data";
import { FileText, Download, CheckCircle2, Loader2 } from "lucide-react";

export default function ResourceHub() {
  const [downloadStep, setDownloadStep] = useState<Record<string, "idle" | "securing" | "ready" | "done">>({});

  const handleDownload = (itemId: string, title: string, fileType: string) => {
    // Stage 1: Securing connection tunnel to local asset builder
    setDownloadStep((prev) => ({ ...prev, [itemId]: "securing" }));

    setTimeout(() => {
      // Stage 2: Readying client files
      setDownloadStep((prev) => ({ ...prev, [itemId]: "ready" }));

      setTimeout(() => {
        // Stage 3: Initiate real file builder in sandboxed memory
        const documentContent = `========================================================================
TRẦN QUANG LONG - HỆ THỐNG TÀI LIỆU SƯ PHẠM VÀ HƯỚNG DẪN THỰC THI
TÀI LIỆU THAM KHẢO: ${title.toUpperCase()}
MÃ ĐỊNH DANH MẪU: ${fileType}
========================================================================

Kính gửi Quý Nhà giáo & Chuyên gia Giáo dục,

Cảm ơn bạn đã tải tài liệu tham khảo từ Trung tâm Tài nguyên Giáo dục chuyên nghiệp của Trần Quang Long. Dưới đây là khung hướng dẫn hành động thực tiễn chi tiết được thiết kế dành cho các giám sát viên học sinh, cố vấn nội trú và nhà nghiên cứu Ngôn ngữ học Ứng dụng.

------------------------------------------------------------------------
CÁC BƯỚC CHUẨN ĐOÁN VÀ TRIỂN KHAI PHỤC HỒI CHI TIẾT
------------------------------------------------------------------------

1. ĐÁNH GIÁ BAN ĐẦU & PHƯƠNG PHÁP ĐỐI THOẠI VÒNG TRÒN
   * Thiết lập không gian phòng họp tròn yên tĩnh hoặc sảnh sinh hoạt chung trung lập.
   * Tiến hành phỏng vấn cá nhân ít áp lực nhất dựa trên ranh giới học thuyết SLA của Stephen Krashen.
   * Đảm bảo các rào cản ngôn ngữ được giàn giáo nâng đỡ khéo léo để tránh kích hoạt Bộ lọc lo âu (Affective Filter).
   * Đưa ra nhận xét khách quan kèm theo sự nâng đỡ mang tính định hình hành vi tích cực.

2. ÁP DỤNG CAN THIỆP KỶ LUẬT TÍCH CỰC
   * Thiết lập ranh giới vòng tròn thỏa thuận tự kiểm soát nơi học sinh tự ký cam kết tăng trưởng.
   * Thay thế các hình phạt cấm túc cô lập thông thường bằng các cơ chế tự chữa lành nhận thức sâu sắc.
   * Ghép đôi học sinh có nền tảng ngôn ngữ đa dạng trong các hoạt động lãnh đạo dựa trên nhiệm vụ giao tiếp thực tế.
   * Xây dựng nếp sống hòa nhập đồng đẳng tự nhiên để giảm bớt sự cục bộ chia rẽ giữa các nhóm sắc tộc.

3. ĐO LƯỜNG VÀ ĐIỀU CHỈNH ĐỊNH KỲ VÒNG TRÒN PHỤC HỒI
   * Giám sát xu hướng tập hợp nhóm xã hội tại phòng sinh hoạt chung mỗi tuần.
   * Ghi nhận và lưu giữ chỉ số tự tin của học sinh cùng biên bản thảo luận mâu thuẫn hàng tháng.
   * Tối ưu hóa các gợi ý giáo án giàn giáo ngôn ngữ trong lớp bằng các ứng dụng công nghệ trực quan.

------------------------------------------------------------------------
THÔNG TIN LIÊN HỆ & KHO SƯ PHẠM ĐỒNG HÀNH
------------------------------------------------------------------------
Tác giả & Kiểm định bởi: Trần Quang Long
Chức vụ: Cán bộ Quản lý Đời sống Học sinh (Supervisor) & Nghiên cứu sinh Ngôn ngữ học Ứng dụng
Triết lý giáo dục: "Kỷ luật là để phục hồi cảm xúc, và giao tiếp là để kiến tạo hòa nhập."
Địa chỉ hòm thư liên lạc chuyên môn: tranquanglong0306@gmail.com

========================================================================
Bản quyền tài liệu thuộc về Trần Quang Long. Công nghệ tải an toàn trong môi trường AI Studio.
========================================================================`;

        const blob = new Blob([documentContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.toLowerCase().replace(/\s+/g, "_")}_vietnamese_guide.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadStep((prev) => ({ ...prev, [itemId]: "done" }));

        // Reset stage back to idle after a few seconds
        setTimeout(() => {
          setDownloadStep((prev) => ({ ...prev, [itemId]: "idle" }));
        }, 3000);

      }, 1000);
    }, 1200);
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-950/25 via-indigo-950/15 to-transparent border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h4 className="font-display font-medium text-lg leading-tight text-white mb-1">
              Khung Sư phạm & Tài liệu Thiết kế Thể thức
            </h4>
            <p className="font-sans text-xs md:text-sm text-slate-400">
              Tải hồ sơ tài nguyên biểu mẫu quản lý hành chính học sinh và học thuyết thực nghiệm thụ đắc ngôn ngữ.
            </p>
          </div>
          <span className="shrink-0 font-mono text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full">
            TẢI BLUEPRINT THỰC HIỆN (.TXT HOẠT ĐỘNG)
          </span>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resourcesList.map((item) => {
            const step = downloadStep[item.id] || "idle";

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6 border border-white/5 relative flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{item.size}</span>
                  </div>

                  <h5 className="font-display font-bold text-base text-white mb-2 leading-snug">
                    {item.title}
                  </h5>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed mb-6 font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="font-mono text-[10px] text-blue-300">{item.downloads}</span>

                  <button
                    onClick={() => handleDownload(item.id, item.title, item.type)}
                    disabled={step !== "idle"}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      step === "idle"
                        ? "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        : step === "securing"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-wait"
                        : step === "ready"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 cursor-wait animate-pulse"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {step === "idle" && (
                      <>
                        <Download className="w-3.5 h-3.5" /> Tải tài liệu
                      </>
                    )}
                    {step === "securing" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Kết nối...
                      </>
                    )}
                    {step === "ready" && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Định cấu hình...
                      </>
                    )}
                    {step === "done" && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
