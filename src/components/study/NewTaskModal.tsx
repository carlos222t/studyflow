import { useState } from "react";
import { Subject, Priority, Task } from "@/lib/study-types";
import { X, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  subjects: Subject[];
  open: boolean;
  onClose: () => void;
  onSubmit: (t: Omit<Task, "id" | "completed">) => void;
  onAddSubject: (s: { name: string; color: string }) => void;
}

const PALETTE = ["#8b5cf6", "#ef4444", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

export function NewTaskModal({ subjects, open, onClose, onSubmit, onAddSubject }: Props) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("media");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [reminder, setReminder] = useState("09:00");
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState(PALETTE[0]);

  if (!open) return null;

  const submit = () => {
    if (!title.trim() || !subjectId) return;
    onSubmit({ title: title.trim(), subjectId, priority, dueDate, reminder });
    setTitle("");
    onClose();
  };

  const priorityLabel = (p: Priority) => (p === "alta" ? t.pAlta : p === "media" ? t.pMedia : t.pBaja);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl">{t.newTask}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.title}</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.subject}</label>
              <button onClick={() => setShowNewSubject((s) => !s)} className="text-xs font-medium text-primary inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> {t.newSubject}
              </button>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${subjectId === s.id ? "border-primary bg-primary-soft text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent"}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </button>
              ))}
            </div>
            {showNewSubject && (
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 space-y-2 pop-in">
                <input
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder={t.subjectName}
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex flex-wrap gap-1.5">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewSubjectColor(c)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform ${newSubjectColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (!newSubjectName.trim()) return;
                    onAddSubject({ name: newSubjectName.trim(), color: newSubjectColor });
                    setNewSubjectName("");
                    setShowNewSubject(false);
                  }}
                  className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  {t.addSubject}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.date}</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.reminder}</label>
              <input
                type="time"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.priority}</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["alta", "media", "baja"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${priority === p ? "border-primary bg-primary-soft" : "border-border hover:bg-accent"}`}
                >
                  {priorityLabel(p)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">{t.cancel}</button>
          <button onClick={submit} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">{t.saveTask}</button>
        </div>
      </div>
    </div>
  );
}
