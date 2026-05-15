import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "es" | "en";

const dict = {
  es: {
    appTagline: "jueves",
    subjects: "Materias",
    allSubjects: "Todas las materias",
    myStreak: "Mi racha",
    daysInRow: "días seguidos",
    progressToday: "Progreso hoy",
    tasksCompleted: "Tareas completadas",
    totalTasks: "Total tareas",
    completed: "Completadas",
    highPriority: "Prioridad alta",
    overdue: "Vencidas",
    todayPlan: "Plan de hoy — generado automáticamente",
    allCaughtUp: "¡Todo al día! No hay tareas pendientes 🎉",
    myTasks: "Mis tareas",
    newTask: "Nueva tarea",
    all: "Todas",
    high: "Alta prioridad",
    medium: "Media",
    low: "Baja",
    noTasksView: "No hay tareas en esta vista.",
    createNew: "Crear una nueva",
    title: "Título",
    titlePlaceholder: "Ej. Estudiar capítulo 4",
    subject: "Materia",
    newSubject: "Nueva materia",
    subjectName: "Nombre de la materia",
    addSubject: "Agregar materia",
    date: "Fecha",
    reminder: "Recordatorio",
    priority: "Prioridad",
    cancel: "Cancelar",
    saveTask: "Guardar tarea",
    theme: "Tema",
    language: "Idioma",
    light: "Claro",
    dark: "Oscuro",
    cherry: "Cherry pink",
    babyblue: "Baby blue",
    red: "Rojo intenso",
    pAlta: "alta",
    pMedia: "media",
    pBaja: "baja",
    overdueBy: (d: number) => `Vencida hace ${d}d`,
    dueToday: "Vence hoy",
    dueTomorrow: "Vence mañana",
    dueIn: (d: number) => `En ${d}d`,
    deleteSubjectConfirm: (n: string) => `¿Eliminar materia "${n}" y sus tareas?`,
    locale: "es",
  },
  en: {
    appTagline: "Thursday",
    subjects: "Subjects",
    allSubjects: "All subjects",
    myStreak: "My streak",
    daysInRow: "days in a row",
    progressToday: "Today's progress",
    tasksCompleted: "Tasks completed",
    totalTasks: "Total tasks",
    completed: "Completed",
    highPriority: "High priority",
    overdue: "Overdue",
    todayPlan: "Today's plan — auto-generated",
    allCaughtUp: "All caught up! No pending tasks 🎉",
    myTasks: "My tasks",
    newTask: "New task",
    all: "All",
    high: "High priority",
    medium: "Medium",
    low: "Low",
    noTasksView: "No tasks in this view.",
    createNew: "Create a new one",
    title: "Title",
    titlePlaceholder: "e.g. Study chapter 4",
    subject: "Subject",
    newSubject: "New subject",
    subjectName: "Subject name",
    addSubject: "Add subject",
    date: "Date",
    reminder: "Reminder",
    priority: "Priority",
    cancel: "Cancel",
    saveTask: "Save task",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    cherry: "Cherry pink",
    babyblue: "Baby blue",
    red: "Deep red",
    pAlta: "high",
    pMedia: "medium",
    pBaja: "low",
    overdueBy: (d: number) => `Overdue by ${d}d`,
    dueToday: "Due today",
    dueTomorrow: "Due tomorrow",
    dueIn: (d: number) => `In ${d}d`,
    deleteSubjectConfirm: (n: string) => `Delete subject "${n}" and its tasks?`,
    locale: "en",
  },
};

export type Dict = typeof dict.es;

interface I18nCtx {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "es";
    return (localStorage.getItem("studyflow:lang") as Lang) || "es";
  });
  useEffect(() => {
    localStorage.setItem("studyflow:lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  return <Ctx.Provider value={{ lang, t: dict[lang], setLang: setLangState }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
