import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, X, ArrowUpRight } from "lucide-react";
import { BlogPost } from "../types";
import { mockBlogs } from "../data";

interface LatestPostsProps {
  activeCategory: string;
  onSelectPost: (post: BlogPost) => void;
}

export default function LatestPosts({ activeCategory, onSelectPost }: LatestPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Mất liên kết máy chủ");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.warn("Chuyển hướng nạp dữ liệu cục bộ cho LatestPosts:", err);
        setPosts(mockBlogs);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter posts based on active category
  const filteredPosts = activeCategory === "all"
    ? posts
    : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 h-[120px] animate-pulse flex flex-col justify-center"
            >
              <div className="h-6 w-1/3 bg-white/5 rounded mb-3" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center border border-white/5 font-mono text-xs text-slate-400">
          Chưa có bài viết nào thuộc chủ đề này.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => onSelectPost(post)}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left side: Category & title & summary */}
                <div className="flex-grow max-w-3xl text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider text-blue-400 bg-blue-500/5 border border-blue-500/10 rounded uppercase">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-display font-bold text-base md:text-lg text-white group-hover:text-blue-400 transition-colors duration-300 mb-1.5 leading-snug">
                    {post.title}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-350 leading-relaxed font-light line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                {/* Right side: Action Link */}
                <div className="shrink-0 flex items-center justify-end">
                  <span className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-blue-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500/30 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
