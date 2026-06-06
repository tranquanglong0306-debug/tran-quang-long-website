import { motion } from "motion/react";

interface CategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
  const categories = [
    { id: "all", label: "Tất cả", icon: "•" },
    { id: "Student Life", label: "Quản sinh & Đời sống", icon: "•" },
    { id: "AI in Education", label: "AI & Giáo dục", icon: "•" },
    { id: "Applied Linguistics", label: "Ngôn ngữ học Ứng dụng", icon: "•" },
    { id: "Educational Technology", label: "Công nghệ Giáo dục", icon: "•" },
  ];

  return (
    <div className="w-full overflow-x-auto flex items-center justify-start md:justify-center gap-3 py-4 scrollbar-none shrink-0 relative z-10">
      <div className="flex gap-2 p-1.5 rounded-xl bg-white/[0.01] border border-white/5 backdrop-blur-md">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-350 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? "text-black font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-white rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="text-[10px] opacity-50">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
