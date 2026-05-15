import { useEffect, useState, useCallback } from "react";
import { AppState, DEFAULT_SUBJECTS, Task, Subject, ThemeName } from "./study-types";

const STORAGE_KEY = "studyflow:v1";

const initialState = (): AppState => {
  const today = new Date();
  const iso = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  return {
    tasks: [
      { id: crypto.randomUUID(), title: "Resolver ejercicios pp. 45–50", subjectId: "math", priority: "alta", dueDate: iso(0), completed: false, reminder: "09:30" },
      { id: crypto.randomUUID(), title: "Leer capítulo 3 — La Revolución", subjectId: "history", priority: "alta", dueDate: iso(1), completed: false, reminder: "11:00" },
      { id: crypto.randomUUID(), title: "Lab reporte — célula vegetal", subjectId: "science", priority: "media", dueDate: iso(2), completed: false, reminder: "08:00" },
      { id: crypto.randomUUID(), title: "Vocabulary unit 5 quiz prep", subjectId: "english", priority: "baja", dueDate: iso(3), completed: false, reminder: "13:00" },
      { id: crypto.randomUUID(), title: "Ecuaciones cuadráticas — práctica", subjectId: "math", priority: "baja", dueDate: iso(4), completed: false, reminder: "15:00" },
      { id: crypto.randomUUID(), title: "Ensayo: el Quijote intro", subjectId: "spanish", priority: "media", dueDate: iso(5), completed: true, completedAt: new Date().toISOString() },
    ],
    subjects: DEFAULT_SUBJECTS,
    theme: "light",
    streak: { count: 0 },
  };
};

export function useStudyStore() {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === "undefined") return initialState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...initialState(), ...JSON.parse(raw) };
    } catch {}
    return initialState();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-cherry", "theme-babyblue", "theme-red");
    if (state.theme === "dark") root.classList.add("dark");
    else if (state.theme === "cherry") root.classList.add("theme-cherry");
    else if (state.theme === "babyblue") root.classList.add("theme-babyblue");
    else if (state.theme === "red") root.classList.add("theme-red", "dark");
  }, [state.theme]);

  const setTheme = useCallback((theme: ThemeName) => {
    setState((s) => ({ ...s, theme }));
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "completed">) => {
    setState((s) => ({ ...s, tasks: [{ ...task, id: crypto.randomUUID(), completed: false }, ...s.tasks] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return s;
      const nowDone = !task.completed;
      const tasks = s.tasks.map((t) =>
        t.id === id ? { ...t, completed: nowDone, completedAt: nowDone ? new Date().toISOString() : undefined } : t,
      );

      // Update streak when completing
      let streak = s.streak;
      if (nowDone) {
        const today = new Date().toISOString().slice(0, 10);
        if (streak.lastCompletedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yISO = yesterday.toISOString().slice(0, 10);
          const newCount = streak.lastCompletedDate === yISO ? streak.count + 1 : 1;
          streak = { count: newCount, lastCompletedDate: today };
        }
      }
      return { ...s, tasks, streak };
    });
  }, []);

  const addSubject = useCallback((subject: Omit<Subject, "id">) => {
    setState((s) => ({ ...s, subjects: [...s.subjects, { ...subject, id: crypto.randomUUID() }] }));
  }, []);

  const removeSubject = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      subjects: s.subjects.filter((sub) => sub.id !== id),
      tasks: s.tasks.filter((t) => t.subjectId !== id),
    }));
  }, []);

  return { state, setTheme, addTask, updateTask, removeTask, toggleTask, addSubject, removeSubject };
}
