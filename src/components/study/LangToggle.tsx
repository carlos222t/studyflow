import { useI18n, Lang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang } = useI18n();
  const opts: { id: Lang; label: string }[] = [
    { id: "es", label: "ES" },
    { id: "en", label: "EN" },
  ];
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => setLang(o.id)}
          className={`rounded-full px-2.5 py-1 transition-colors ${lang === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
