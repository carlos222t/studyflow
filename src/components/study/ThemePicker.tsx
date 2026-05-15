import { ThemeName } from "@/lib/study-types";
import { Check, Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

const themes: { id: ThemeName; labelKey: "light" | "dark" | "cherry" | "babyblue" | "red"; swatch: string[] }[] = [
  { id: "light", labelKey: "light", swatch: ["#ffffff", "#8b5cf6"] },
  { id: "dark", labelKey: "dark", swatch: ["#1f1d2b", "#a78bfa"] },
  { id: "cherry", labelKey: "cherry", swatch: ["#fff1f4", "#e11d48"] },
  { id: "babyblue", labelKey: "babyblue", swatch: ["#eff6ff", "#3b82f6"] },
  { id: "red", labelKey: "red", swatch: ["#1a0808", "#ef4444"] },
];

export function ThemePicker({ value, onChange }: { value: ThemeName; onChange: (t: ThemeName) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t: tr } = useI18n();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <Palette className="h-4 w-4" />
        {tr.theme}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-lg z-50 pop-in">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onChange(t.id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex">
                  <span className="h-5 w-5 rounded-full border border-border" style={{ background: t.swatch[0] }} />
                  <span className="-ml-2 h-5 w-5 rounded-full border border-border" style={{ background: t.swatch[1] }} />
                </span>
                {tr[t.labelKey]}
              </span>
              {value === t.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
