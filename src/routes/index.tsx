import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStudyStore } from "@/lib/use-study-store";
import { ThemePicker } from "@/components/study/ThemePicker";
import { NewTaskModal } from "@/components/study/NewTaskModal";
import { TaskCard } from "@/components/study/TaskCard";
import { LangToggle } from "@/components/study/LangToggle";
import { Flame, Plus, Sparkles, Trash2 } from "lucide-react";
import { Priority } from "@/lib/study-types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyFlow — Organiza tus tareas y construye tu racha" },
      { name: "description", content: "App para organizar tareas escolares por materia, prioridad y fecha. Cambia el tema, crea materias propias y mantén tu racha de estudio." },
    ],
  }),
  component: StudyFlowApp,
});

type Filter = "todas" | Priority | "completadas" | "vencidas";

function StudyFlowApp() {
  const { state, setTheme, addTask, toggleTask, removeTask, addSubject, removeSubject } = useStudyStore();
  const { t, lang } = useI18n();
  const [activeSubject, setActiveSubject] = useState<string | "all">("all");
  const [filter, setFilter] = useState<Filter>("todas");
  const [modalOpen, setModalOpen] = useState(false);

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  const todayLabel = today.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });

  const filteredTasks = useMemo(() => {
    let list = state.tasks;
    if (activeSubject !== "all") list = list.filter((t) => t.subjectId === activeSubject);
    if (filter === "alta" || filter === "media" || filter === "baja") list = list.filter((t) => t.priority === filter);
    if (filter === "completadas") list = list.filter((t) => t.completed);
    if (filter === "vencidas") list = list.filter((t) => !t.completed && t.dueDate < todayISO);
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [state.tasks, activeSubject, filter, todayISO]);

  const stats = useMemo(() => {
    const total = state.tasks.length;
    const completed = state.tasks.filter((t) => t.completed).length;
    const high = state.tasks.filter((t) => t.priority === "alta" && !t.completed).length;
    const overdue = state.tasks.filter((t) => !t.completed && t.dueDate < todayISO).length;
    return { total, completed, high, overdue };
  }, [state.tasks, todayISO]);

  const todayPlan = useMemo(() => {
    return [...state.tasks]
      .filter((t) => !t.completed)
      .sort((a, b) => {
        const order = { alta: 0, media: 1, baja: 2 } as const;
        if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        return order[a.priority] - order[b.priority];
      })
      .slice(0, 5);
  }, [state.tasks]);

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];
  const todayDow = (today.getDay() + 6) % 7; // 0 = Mon

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">S</div>
            <span className="font-display text-2xl">StudyFlow</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex rounded-full bg-primary-soft px-3 py-1 text-sm text-accent-foreground capitalize">{todayLabel}</span>
            <LangToggle />
            <ThemePicker value={state.theme} onChange={setTheme} />
            <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-semibold">SF</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 px-6 py-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.subjects}</h3>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSubject("all")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${activeSubject === "all" ? "bg-primary-soft text-foreground font-medium" : "hover:bg-accent text-foreground"}`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  {t.allSubjects}
                </span>
                <span className="text-xs text-muted-foreground">{state.tasks.length}</span>
              </button>
              {state.subjects.map((s) => {
                const count = state.tasks.filter((t) => t.subjectId === s.id).length;
                return (
                  <div key={s.id} className="group relative">
                    <button
                      onClick={() => setActiveSubject(s.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${activeSubject === s.id ? "bg-primary-soft text-foreground font-medium" : "hover:bg-accent text-foreground"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        {s.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t.deleteSubjectConfirm(s.name))) removeSubject(s.id);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Streak */}
          <div>
            <h3 className="px-1 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.myStreak}</h3>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary ${state.streak.count > 0 ? "streak-glow" : ""}`}>
                  <Flame className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-display text-3xl leading-none">{state.streak.count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.daysInRow}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-between gap-1">
                {weekDays.map((d, i) => (
                  <div
                    key={i}
                    className={`grid h-7 flex-1 place-items-center rounded-md text-xs font-semibold ${i === todayDow ? "bg-primary text-primary-foreground" : i < todayDow && state.streak.count > 0 ? "bg-primary-soft text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <h3 className="px-1 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.progressToday}</h3>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{t.tasksCompleted}</span>
                <span className="text-muted-foreground">{stats.completed}/{stats.total}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-6 min-w-0">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label={t.totalTasks} value={stats.total} tone="primary" />
            <StatCard label={t.completed} value={stats.completed} tone="success" />
            <StatCard label={t.highPriority} value={stats.high} tone="destructive" />
            <StatCard label={t.overdue} value={stats.overdue} tone="warning" />
          </div>

          {/* Plan de hoy */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl text-primary">{t.todayPlan}</h2>
            </div>
            <div className="divide-y divide-border">
              {todayPlan.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">{t.allCaughtUp}</div>
              )}
              {todayPlan.map((task, idx) => {
                const subject = state.subjects.find((s) => s.id === task.subjectId);
                const time = task.reminder ?? `${8 + idx * 2}:00`;
                const tone = task.priority === "alta" ? "destructive" : task.priority === "media" ? "warning" : "success";
                const pLabel = task.priority === "alta" ? t.pAlta : task.priority === "media" ? t.pMedia : t.pBaja;
                return (
                  <div key={task.id} className="flex items-center gap-4 py-3">
                    <span className="w-12 text-sm tabular-nums text-muted-foreground">{time}</span>
                    {subject && <span className="h-2 w-2 rounded-full" style={{ background: subject.color }} />}
                    <span className="flex-1 text-sm text-foreground">{task.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${tone === "destructive" ? "bg-destructive/10 text-destructive" : tone === "warning" ? "bg-warning/15 text-warning-foreground dark:text-warning" : "bg-success/15 text-success"}`}>
                      {pLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tasks list */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl">{t.myTasks}</h2>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> {t.newTask}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {([
                ["todas", t.all],
                ["alta", t.high],
                ["media", t.medium],
                ["baja", t.low],
                ["completadas", t.completed],
                ["vencidas", t.overdue],
              ] as [Filter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === key ? "bg-primary-soft text-accent-foreground" : "text-muted-foreground hover:bg-accent"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredTasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                  <p className="text-muted-foreground text-sm">{t.noTasksView}</p>
                  <button onClick={() => setModalOpen(true)} className="mt-3 inline-flex items-center gap-1.5 text-primary text-sm font-medium">
                    <Plus className="h-4 w-4" /> {t.createNew}
                  </button>
                </div>
              )}
              {filteredTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  subject={state.subjects.find((s) => s.id === t.subjectId)}
                  onToggle={() => toggleTask(t.id)}
                  onRemove={() => removeTask(t.id)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <NewTaskModal
        subjects={state.subjects}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addTask}
        onAddSubject={addSubject}
      />
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "primary" | "success" | "destructive" | "warning" }) {
  const toneClass = {
    primary: "text-primary",
    success: "text-success",
    destructive: "text-destructive",
    warning: "text-warning-foreground dark:text-warning",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-4xl ${toneClass}`}>{value}</div>
    </div>
  );
}
