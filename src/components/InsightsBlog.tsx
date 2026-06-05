import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, X, ChevronRight } from "lucide-react";
import { BlogPost } from "../types";
import { mockBlogs } from "../data";

export default function InsightsBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load blog posts dynamically from server-side mock db
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Mất liên kết máy chủ");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.warn("Chuyển hướng nạp dữ liệu cục bộ:", err);
        setPosts(mockBlogs);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="w-full">
      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 h-[260px] animate-pulse flex flex-col justify-between">
                <div>
                  <div className="h-6 w-1/3 bg-white/5 rounded mb-3" />
                  <div className="h-4 w-5/6 bg-white/5 rounded mb-2" />
                  <div className="h-4 w-4/6 bg-white/5 rounded" />
                </div>
                <div className="h-6 w-1/4 bg-white/10 rounded" />
              </div>
            ))
          : posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedPost(post)}
                className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-full relative cursor-pointer group hover:border-blue-500/20"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-blue-400">
                    <span className="px-2 py-0.5 rounded border border-blue-500/10 bg-blue-500/5 uppercase">{post.category}</span>
                  </div>

                  <h5 className="font-display font-bold text-base md:text-lg text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h5>
                  <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed mb-6 font-light">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3 font-mono text-[9px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {post.readTime}
                    </span>
                  </div>

                  <span className="p-1 px-2 text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Xem bài <ChevronRight className="w-3 h-3 text-blue-400" />
                  </span>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Expanded Blog Modal Detail View */}
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
              <div className="p-6 border-b border-white/5 flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-blue-400 border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 rounded mb-2 inline-block uppercase">
                    {selectedPost.category}
                  </span>
                  <h4 className="font-display text-lg md:text-xl font-bold text-white leading-snug">
                    {selectedPost.title}
                  </h4>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400 mt-1">
                    <span>{selectedPost.date}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
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
    </div>
  );
}
