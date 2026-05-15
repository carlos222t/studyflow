export type Priority = "alta" | "media" | "baja";

export interface Subject {
  id: string;
  name: string;
  color: string; // hex
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  priority: Priority;
  dueDate: string; // ISO date
  completed: boolean;
  completedAt?: string;
  notes?: string;
  reminder?: string; // HH:mm
}

export type ThemeName = "light" | "dark" | "cherry" | "babyblue" | "red";

export interface AppState {
  tasks: Task[];
  subjects: Subject[];
  theme: ThemeName;
  streak: {
    count: number;
    lastCompletedDate?: string; // YYYY-MM-DD
  };
}

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "math", name: "Matemáticas", color: "#8b5cf6" },
  { id: "spanish", name: "Español", color: "#ef4444" },
  { id: "science", name: "Ciencias", color: "#10b981" },
  { id: "history", name: "Historia", color: "#f59e0b" },
  { id: "english", name: "Inglés", color: "#3b82f6" },
];
