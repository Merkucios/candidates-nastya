import { cn } from "@/lib/utils";

const steps = [
  { id: "start", label: "Старт" },
  { id: "materials", label: "Материалы" },
  { id: "test", label: "Тест" },
] as const;

export type FlowStep = (typeof steps)[number]["id"];

export function FlowProgress({ current }: { current: FlowStep }) {
  const index = steps.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Этапы" className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, i) => {
        const active = i === index;
        const done = i < index;
        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-3">
            {i > 0 ? (
              <span
                className={cn(
                  "h-px w-6 sm:w-10",
                  done || active ? "bg-primary/50" : "bg-border"
                )}
              />
            ) : null}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  active && "bg-primary text-primary-foreground",
                  done && "bg-secondary text-secondary-foreground",
                  !active && !done && "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
