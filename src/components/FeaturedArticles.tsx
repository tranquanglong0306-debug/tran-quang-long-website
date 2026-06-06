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
    "from-white/5 via-white/[0.01] to-transparent",
    "from-white/8 via-white/[0.02] to-transparent",
    "from-white/3 via-white/[0.01] to-transparent",
  ];

  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 h-[340px] animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[16/10] bg-white/5 rounded-xl mb-4" />
                  <div className="h-6 w-1/3 bg-white/5 rounded mb-3" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
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
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                onClick={() => onSelectPost(post)}
                className="glass-card rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between h-full cursor-pointer group transition-all duration-500 relative hover:border-white/20"
              >
                {/* Background Subtle White Ambient Glow on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.03) 0%, transparent 60%)",
                  }}
                />

                <div>
                  {/* Article Thumbnail with abstract grayscale mesh */}
                  <div className="w-full aspect-[16/10] relative overflow-hidden rounded-t-2xl bg-black">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${gradients[idx]} z-0`} />
                    <div className="absolute inset-0 bg-white/[0.02] z-0" />
                    
                    {/* Grayscale visual lattice */}
                    <div className="absolute inset-0 cyber-grid opacity-20 group-hover:opacity-45 transition-all duration-700" />
                    
                    {/* Visual diagonal line representing modern architecture */}
                    <div className="absolute top-0 left-0 w-full h-full border-t border-r border-white/[0.02] transform -rotate-12 translate-x-4 scale-125 pointer-events-none" />

                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="px-2.5 py-1 text-[8px] font-mono tracking-widest text-white/70 uppercase rounded bg-white/5 border border-white/10 backdrop-blur-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left">
                    <h4 className="font-display font-bold text-base md:text-lg text-white mb-2 leading-snug group-hover:text-white/80 transition-colors duration-300">
                      {post.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-white/50 leading-relaxed font-light line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="px-6 pb-6 pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3 font-mono text-[9px] text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white/40" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-white/40" /> {post.readTime}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:text-white transition-colors duration-300">
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </span>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
