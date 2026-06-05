export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  size: string;
  downloads: string;
  description: string;
}

export type AIToolType = "conflict-advisor" | "lesson-planner" | "report-drafter";

export interface ConflictInput {
  grade: string;
  severity: string;
  incidentDescription: string;
}

export interface LessonPlanInput {
  topic: string;
  studentLevel: string;
  duration: string;
  linguisticFocus: string;
}

export interface ReportInput {
  studentName: string;
  tone: string;
  strengths: string;
  growthAreas: string;
}
