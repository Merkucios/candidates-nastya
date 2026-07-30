"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicShell } from "@/components/public-shell";
import { cn } from "@/lib/utils";
import { getCandidateId } from "@/lib/candidate-session";

type Option = { id: string; optionText: string; orderIndex: number };
type Question = {
  id: string;
  questionText: string;
  type: "single" | "multiple" | "text";
  options: Option[];
};

function TestSkeleton() {
  return (
    <div className="space-y-6 animate-rise">
      <div className="space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="surface-glass space-y-4 rounded-3xl p-5 sm:p-6">
          <Skeleton className="h-6 w-4/5" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-5/6 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function OptionRow({
  selected,
  onSelect,
  children,
  type,
  name,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  type: "radio" | "checkbox";
  name?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition-all",
        selected
          ? "border-primary/40 bg-secondary/70"
          : "border-border/70 bg-card/50 hover:border-primary/25 hover:bg-card/80"
      )}
    >
      <input
        type={type}
        name={name}
        className="sr-only"
        checked={selected}
        onChange={onSelect}
      />
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
          type === "radio" ? "rounded-full" : "rounded-md",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card"
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="leading-relaxed">{children}</span>
    </label>
  );
}

export default function TestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!getCandidateId()) {
      router.replace("/");
      return;
    }
    let cancelled = false;
    fetch("/api/questions")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setQuestions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError("Не удалось загрузить вопросы");
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function toggleMulti(questionId: string, optionId: string) {
    setMultiAnswers((prev) => {
      const cur = prev[questionId] ?? [];
      return {
        ...prev,
        [questionId]: cur.includes(optionId)
          ? cur.filter((id) => id !== optionId)
          : [...cur, optionId],
      };
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const candidateId = getCandidateId();
    if (!candidateId) {
      router.replace("/");
      return;
    }
    setLoading(true);
    setError("");

    const answers = questions.map((q) => {
      if (q.type === "text") {
        return { questionId: q.id, answerText: textAnswers[q.id] ?? "" };
      }
      if (q.type === "single") {
        const id = singleAnswers[q.id];
        return { questionId: q.id, optionIds: id ? [id] : [] };
      }
      return { questionId: q.id, optionIds: multiAnswers[q.id] ?? [] };
    });

    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, answers }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка отправки");
        return;
      }
      router.push("/thanks");
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell step="test" compactBrand>
      {fetching ? (
        <TestSkeleton />
      ) : (
        <div className="animate-rise space-y-8">
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold text-pine sm:text-4xl">
              Тестирование
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Ответьте спокойно и честно. Итог видит только администратор — вам
              достаточно пройти до конца.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {questions.length === 0 ? (
              <div className="surface-glass rounded-3xl p-6 text-sm text-muted-foreground">
                Вопросов пока нет. Обратитесь к администратору.
              </div>
            ) : null}

            {questions.map((q, index) => (
              <article
                key={q.id}
                className="surface-glass animate-rise-delay-1 space-y-4 rounded-3xl p-5 sm:p-6"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {index + 1}
                  </span>
                  <h2 className="pt-1 text-base font-medium leading-snug sm:text-lg">
                    {q.questionText}
                  </h2>
                </div>

                <div className="space-y-2 pl-0 sm:pl-11">
                  {q.type === "single"
                    ? q.options.map((o) => (
                        <OptionRow
                          key={o.id}
                          type="radio"
                          name={q.id}
                          selected={singleAnswers[q.id] === o.id}
                          onSelect={() =>
                            setSingleAnswers((prev) => ({
                              ...prev,
                              [q.id]: o.id,
                            }))
                          }
                        >
                          {o.optionText}
                        </OptionRow>
                      ))
                    : null}

                  {q.type === "multiple"
                    ? q.options.map((o) => (
                        <OptionRow
                          key={o.id}
                          type="checkbox"
                          selected={(multiAnswers[q.id] ?? []).includes(o.id)}
                          onSelect={() => toggleMulti(q.id, o.id)}
                        >
                          {o.optionText}
                        </OptionRow>
                      ))
                    : null}

                  {q.type === "text" ? (
                    <div className="space-y-2">
                      <Label htmlFor={`text-${q.id}`}>Ваш ответ</Label>
                      <Textarea
                        id={`text-${q.id}`}
                        value={textAnswers[q.id] ?? ""}
                        onChange={(e) =>
                          setTextAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        placeholder="Напишите своими словами…"
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Этот ответ не влияет на балл — его прочитает
                        администратор.
                      </p>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              variant="honey"
              className="w-full sm:w-auto"
              disabled={loading || questions.length === 0}
            >
              {loading ? "Отправляем…" : "Отправить ответы"}
            </Button>
          </form>
        </div>
      )}
    </PublicShell>
  );
}
