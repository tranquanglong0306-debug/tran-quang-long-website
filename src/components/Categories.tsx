import { motion } from "motion/react";

interface CategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
  const categories = [
    { id: "all", label: "Tất cả", icon: "🌐" },
    { id: "Student Life", label: "Quản sinh & Đời sống", icon: "🎓" },
    { id: "AI in Education", label: "AI & Giáo dục", icon: "🤖" },
    { id: "Applied Linguistics", label: "Ngôn ngữ học Ứng dụng", icon: "🗣" },
    { id: "Educational Technology", label: "Công nghệ Giáo dục", icon: "💻" },
  ];

  return (
    <div className="w-full overflow-x-auto flex items-center justify-start md:justify-center gap-3 py-4 scrollbar-none shrink-0">
      <div className="flex gap-2.5 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? "text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 border border-blue-500/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="text-[14px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
