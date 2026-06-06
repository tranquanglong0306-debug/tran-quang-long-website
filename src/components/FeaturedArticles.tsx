import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "../types";
import { mockBlogs } from "../data";

interface FeaturedArticlesProps {
  onSelectPost: (post: BlogPost) => void;
}

export default function FeaturedArticles({ onSelectPost }: FeaturedArticlesProps) {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Mất liên kết máy chủ");
        const data = await res.json();
        const featured = data.filter((post: BlogPost) => post.featured);
        setFeaturedPosts(featured.slice(0, 3));
      } catch (err) {
        console.warn("Chuyển hướng nạp dữ liệu cục bộ cho FeaturedArticles:", err);
        const featured = mockBlogs.filter((post) => post.featured);
        setFeaturedPosts(featured.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const gradients = [
    "from-blue-600/30 via-indigo-600/10 to-transparent",
    "from-indigo-600/30 via-purple-600/10 to-transparent",
    "from-slate-600/30 via-blue-600/10 to-transparent",
  ];

  const borders = [
    "group-hover:border-blue-500/30",
    "group-hover:border-indigo-500/30",
    "group-hover:border-slate-400/30",
  ];

  const glows = [
    "rgba(37,99,235,0.15)",
    "rgba(99,102,241,0.15)",
    "rgba(148,163,184,0.15)",
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 h-[380px] animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[16/10] bg-white/5 rounded-2xl mb-4" />
                  <div className="h-6 w-1/3 bg-white/5 rounded mb-3" />
                  <div className="h-4 w-5/6 bg-white/5 rounded mb-2" />
                  <div className="h-4 w-4/6 bg-white/5 rounded" />
                </div>
                <div className="h-6 w-1/4 bg-white/10 rounded" />
              </div>
            ))
          : featuredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -8, scale: 1.01 }}
                onClick={() => onSelectPost(post)}
                className={`glass-card rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between h-full cursor-pointer group transition-all duration-500 relative ${borders[idx]}`}
                style={{
                  boxShadow: `0 4px 30px rgba(0, 0, 0, 0.2)`,
                }}
              >
                {/* Background Ambient Glow on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 10%, ${glows[idx]} 0%, transparent 70%)`,
                  }}
                />

                <div>
                  {/* Article Thumbnail with animated mesh/gradient */}
                  <div className="w-full aspect-[16/10] relative overflow-hidden rounded-t-3xl">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${gradients[idx]} z-0`} />
                    <div className="absolute inset-0 bg-slate-950/20 z-0" />
                    
                    {/* Visual pattern overlay */}
                    <div className="absolute inset-0 cyber-grid opacity-20 group-hover:opacity-30 transition-opacity" />

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <span className="px-3 py-1 text-[9px] font-mono tracking-widest text-white uppercase rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h4 className="font-display font-extrabold text-base md:text-lg text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 leading-snug">
                      {post.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-slate-350 leading-relaxed font-light line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="px-6 pb-6 pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3 font-mono text-[9px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {post.readTime}
                    </span>
                  </div>

                  <span className="p-1 text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1 group-hover:text-white transition-all duration-300">
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </span>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
