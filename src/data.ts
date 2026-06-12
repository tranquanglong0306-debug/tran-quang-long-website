import { BlogPost } from "./types";

export interface Project {
  title: string;
  category: string;
  desc: string;
  tech: string;
  demoUrl: string;
  githubUrl: string;
}

export const mockBlogs: BlogPost[] = [
  {
    id: "post-1",
    title: "[Briefing 01] Restorative Circles in High-Stakes Classrooms",
    category: "Student Life",
    date: "June 2026",
    readTime: "5 min read",
    summary: "A study on utilizing structured circle dialogue protocols to resolve peer conflicts and minimize repeat behavioral infractions in multicultural school environments.",
    featured: true,
    content: `## [Briefing 01] Restorative Circles in High-Stakes Classrooms

### Context & Telemetry
In high-stress international academic environments, conventional punitive administrative measures fail to address the core communicational deficits that trigger behavior anomalies. 

### The Restorative Inquiry Framework
Rather than asking **"Who broke the regulation and what is the punishment?"**, our operational protocol shifts the focus to:
1. **What occurred, and what was the cognitive state of the actors at that instant?**
2. **Who has been affected, and what is the nature of the impact?**
3. **What corrective actions are required to repair the relationship and restore systemic equilibrium?**

### Operational Implementation
At the high school level, we deploy micro-mediation conferences. This structure brings students together, allowing them to express their perspectives safely, and sign a mutual growth commitment. We emphasize **positive discipline** and **peer-led mediation**, empowering students to regulate their own behavior.`
  },
  {
    id: "post-2",
    title: "[Briefing 02] Affective Filter Attenuation in Residential Life",
    category: "Applied Linguistics",
    date: "May 2026",
    readTime: "7 min read",
    summary: "Investigation into utilizing sociocognitive scaffolding to lower linguistic anxiety and enhance natural communicative output in international dormitories.",
    featured: true,
    content: `## [Briefing 02] Affective Filter Attenuation in Residential Life

### Affective Filter Hypothesis
In Stephen Krashen's Second Language Acquisition theory, high anxiety, low self-esteem, and school-related stress construct a cognitive barrier that blocks language input from reaching the brain's acquisition center.

### Correlation with Student Life
As a Student Life Officer, I observe that linguistic anxiety often manifests as social withdrawal or externalized behavioral friction.
- **Systemic Language Barriers**: When students perceive their English communication skills are being evaluated, they retreat into native-language subgroups, increasing social division.
- **Sociocognitive Scaffolding**: By integrating low-stakes group activities (board games, student podcasts, self-governing councils) in common areas, we lower the affective filter, fostering natural communicative output and a sense of belonging.`
  },
  {
    id: "post-3",
    title: "[Briefing 03] Report Comment Optimization: The Sandwich Protocol",
    category: "Educational Tech",
    date: "April 2026",
    readTime: "4 min read",
    summary: "Empathetic communication strategies designed to translate raw pedagogical observations into collaborative, trust-building feedback loop with parents.",
    featured: true,
    content: `## [Briefing 03] Report Comment Optimization: The Sandwich Protocol

### Context
Progress reporting is one of the most critical touchpoints in student advisory. A punitive tone triggers defensive reactions from parents, while vague comments fail to drive behavioral correction.

### The Modified 'Sandwich' Commentary Framework
1. **The Affirmation Base**: Identify a specific social or academic effort exhibited by the student.
2. **The Growth Gap**: Describe the objective behavioral area needing improvement, using non-judgmental language.
3. **The Collaborative Invitation**: Propose a specific, actionable joint support plan that parents can reinforce at home.`
  },
  {
    id: "post-4",
    title: "[Briefing 04] LLMs as Cognitive Scaffolds for L2 Learners",
    category: "AI in Education",
    date: "March 2026",
    readTime: "6 min read",
    summary: "Analyzing the integration of Large Language Models as personalized real-time scaffolding tools for students navigating academic writing barriers.",
    featured: false,
    content: `## [Briefing 04] LLMs as Cognitive Scaffolds for L2 Learners

### AI as Personalized Scaffolding
Using AI in education extends beyond automated grading or plagiarism checks. The primary value lies in creating personalized scaffolding that adjusts to individual student development.

### Practical Scaffolding Techniques
- Provides real-time grammatical feedback and explanations.
- Suggests contextual vocabulary in conversations.
- Lowers the anxiety barrier by allowing students to practice 1-1 with AI before public speaking.`
  },
  {
    id: "post-5",
    title: "[Briefing 05] Self-Governing Student Ecosystems: Diversity & Protocol",
    category: "Student Life",
    date: "February 2026",
    readTime: "5 min read",
    summary: "Structuring autonomous student-led mediation forums within residential halls to cultivate peer conflict resolution protocols.",
    featured: false,
    content: `## [Briefing 05] Self-Governing Student Ecosystems: Diversity & Protocol

### Context
Residential life requires high intercultural adaptability. By establishing self-governance structures, we cultivate environments where autonomy and mutual respect are actively practiced.`
  }
];

export const mockProjects: Project[] = [
  {
    title: 'Restorative Mediator AI',
    category: 'AI IN EDUCATION',
    desc: 'Cố vấn đối thoại học đường dựa trên mô hình ngôn ngữ lớn giúp giáo viên điều phối các cuộc họp hòa giải mâu thuẫn.',
    tech: 'React, Next.js, Gemini API, Tailwind CSS',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'SLA Lesson Scaffold AI',
    category: 'AI IN EDUCATION',
    desc: 'Hệ thống tự động hóa xây dựng giàn giáo bài giảng (scaffolding) phù hợp với mức độ tiếp thụ ngôn ngữ khác nhau của học sinh.',
    tech: 'TypeScript, Gemini API, Node.js',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Report Card Sandwich AI',
    category: 'AI IN EDUCATION',
    desc: 'Hỗ trợ giáo viên soạn thảo nhận xét học bạ theo phương pháp kẹp bánh mì giúp phản hồi tích cực và hợp tác với phụ huynh.',
    tech: 'React, Vite, OpenAI API',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Restorative Justice Platform',
    category: 'SYSTEM INTEGRATION',
    desc: 'Nền tảng quản lý hành chính ghi nhận biên bản đối thoại hòa giải và tiến trình cam kết sửa đổi hành vi của học sinh.',
    tech: 'React, Firebase Auth, Firestore SDK',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'SLA Interactive Dashboard',
    category: 'DATA VISUALIZATION',
    desc: 'Bảng theo dõi và trực quan hóa thời gian thực về độ tự tin ngôn ngữ của học sinh trong các không gian sinh hoạt chung.',
    tech: 'Three.js, D3.js, React, Zustand',
    demoUrl: '#',
    githubUrl: '#'
  }
];
