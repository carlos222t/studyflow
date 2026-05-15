import { Task, Subject, Priority } from "@/lib/study-types";
import { Calendar, X, Bell } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const priorityStyles: Record<Priority, string> = {
  alta: "bg-destructive/10 text-destructive",
  media: "bg-warning/15 text-warning-foreground dark:text-warning",
  baja: "bg-success/15 text-success",
};

interface Props {
  task: Task;
  subject?: Subject;
  onToggle: () => void;
  onRemove: () => void;
}

export function TaskCard({ task, subject, onToggle, onRemove }: Props) {
  const { t } = useI18n();
  const due = (() => {
    const d = new Date(task.dueDate + "T23:59:59");
    const now = new Date();
    const diff = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: t.overdueBy(Math.abs(diff)), overdue: true };
    if (diff === 0) return { text: t.dueToday, overdue: false };
    if (diff === 1) return { text: t.dueTomorrow, overdue: false };
    return { text: t.dueIn(diff), overdue: false };
  })();
  const pLabel = task.priority === "alta" ? t.pAlta : task.priority === "media" ? t.pMedia : t.pBaja;
  return (
    <div className={`group relative flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:shadow-sm ${task.completed ? "opacity-60" : ""}`}>
      <button
        onClick={onToggle}
        aria-label="Toggle"
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${task.completed ? "border-success bg-success check-pop" : "border-muted-foreground/40 hover:border-primary"}`}
      >
        {task.completed && (
          <svg viewBox="0 0 16 16" className="h-3 w-3 text-success-foreground" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium text-foreground ${task.completed ? "line-through" : ""}`}>{task.title}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          {subject && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: subject.color + "22", color: subject.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: subject.color }} />
              {subject.name}
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 capitalize ${priorityStyles[task.priority]}`}>{pLabel}</span>
          <span className={`inline-flex items-center gap-1 ${due.overdue && !task.completed ? "text-destructive font-medium" : "text-muted-foreground"}`}>
            <Calendar className="h-3 w-3" />
            {due.text}
          </span>
          {task.reminder && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Bell className="h-3 w-3" />
              {task.reminder}
            </span>
          )}
        </div>
      </div>

      <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
