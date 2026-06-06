export interface ShapeConfig {
  id: string;
  label: string;
  index: string;
  geometry: "sphere" | "box" | "torus" | "dodecahedron" | "cone" | "octahedron";
  color: string;
  position: [number, number, number];
  geometryArgs: number[];
  type: string;
  subtitle: string;
}

export const SHAPES: ShapeConfig[] = [
  {
    id: "about",
    label: "About",
    index: "01",
    geometry: "sphere",
    color: "#c2410c",
    position: [3, 0, 0],
    geometryArgs: [0.8, 64, 64],
    type: "about",
    subtitle: "Cố vấn Giáo dục & Chuyên gia Phát triển Đời sống Học sinh nội trú",
  },
  {
    id: "work",
    label: "Work",
    index: "02",
    geometry: "box",
    color: "#e8dcc4",
    position: [-3, 0, 0],
    geometryArgs: [1.2, 1.2, 1.2],
    type: "work",
    subtitle: "Dự án giáo dục & bài viết chuyên môn",
  },
  {
    id: "skills",
    label: "Skills",
    index: "03",
    geometry: "torus",
    color: "#3a3a3a",
    position: [0, 3, 0],
    geometryArgs: [0.8, 0.3, 32, 100],
    type: "skills",
    subtitle: "Khung năng lực kiểm soát vi mô",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    index: "04",
    geometry: "dodecahedron",
    color: "#6b2a1a",
    position: [0, -3, 0],
    geometryArgs: [0.9, 0],
    type: "philosophy",
    subtitle: "Vòng tròn phục hồi & bộ lọc Krashen",
  },
  {
    id: "journal",
    label: "Journal",
    index: "05",
    geometry: "cone",
    color: "#2d4a3e",
    position: [2.5, 2.5, -1],
    geometryArgs: [0.7, 1.3, 6],
    type: "journal",
    subtitle: "Nhật ký quan sát học đường",
  },
  {
    id: "contact",
    label: "Contact",
    index: "06",
    geometry: "octahedron",
    color: "#1a1a1a",
    position: [-2.5, -2.5, -1],
    geometryArgs: [0.9, 0],
    type: "contact",
    subtitle: "Kết nối chuyên môn & trao đổi",
  },
];

export const SECTIONS_CONTENT = {
  about: {
    bio: "Tôi là một nhà cố vấn giáo dục học đường và nhà phát triển chương trình đời sống nội trú quốc tế tại Việt Nam. Tập trung ứng dụng các lý thuyết ngôn ngữ học thực hành và công lý phục hồi.",
    meta: ["7+ Exp", "SGN / TYO", "Brand & Digital"],
  },
  work: [
    {
      title: "Maison Noir",
      cat: "Branding",
      year: "2026",
      note: "Hệ thống kỷ luật tích cực và bộ nhận diện văn hóa học xá.",
    },
    {
      title: "Kiln Studio",
      cat: "Web Design",
      year: "2025",
      note: "Phát triển công cụ AI và giàn giáo học tập thông minh.",
    },
  ],
  skills: ["React/Three.js", "Typography", "Blender", "Figma", "GLSL"],
  philosophy: [
    {
      quote: "Restraint is luxury",
      explanation:
        "Sự giản lược là đỉnh cao của sự sang trọng. Tối giản trong thiết kế và giáo dục giúp tập trung cao độ vào những giá trị cốt lõi nhất.",
    },
    {
      quote: "Type is voice",
      explanation:
        "Typography không chỉ là các chữ cái, nó chính là giọng nói của nội dung. Việc kiểm soát vi mô kiểu chữ định hình thái độ của người tiếp nhận.",
    },
  ],
  journal: [
    {
      title: "The weight of a single pixel",
      date: "May 2026",
      read: "8 min",
      excerpt:
        "Phân tích về tầm quan trọng của chi tiết nhỏ nhất trong thiết kế giao diện tối giản và sự ảnh hưởng của nó tới khả năng tương tác của người dùng.",
    },
  ],
  contact: {
    email: "hello@quanglong.studio",
    social: ["Instagram", "LinkedIn", "Read.cv"],
  },
};
