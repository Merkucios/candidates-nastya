"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLogoutButton } from "@/components/admin-logout-button";

type OptionDraft = { optionText: string; isCorrect: boolean };
type Question = {
  id: string;
  questionText: string;
  type: "single" | "multiple" | "text";
  orderIndex: number;
  options: {
    id: string;
    optionText: string;
    isCorrect: boolean;
    orderIndex: number;
  }[];
};

const emptyForm = {
  questionText: "",
  type: "single" as "single" | "multiple" | "text",
  orderIndex: 0,
  options: [
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
  ] as OptionDraft[],
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/questions");
    if (res.ok) setQuestions(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(q: Question) {
    setEditingId(q.id);
    setForm({
      questionText: q.questionText,
      type: q.type,
      orderIndex: q.orderIndex,
      options:
        q.options.length > 0
          ? q.options.map((o) => ({
              optionText: o.optionText,
              isCorrect: o.isCorrect,
            }))
          : emptyForm.options,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      orderIndex: questions.length,
      options: [
        { optionText: "", isCorrect: true },
        { optionText: "", isCorrect: false },
      ],
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      questionText: form.questionText,
      type: form.type,
      orderIndex: form.orderIndex,
      options: form.type === "text" ? [] : form.options,
    };
    try {
      const res = await fetch(
        editingId ? `/api/admin/questions/${editingId}` : "/api/admin/questions",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }
      resetForm();
      await load();
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить вопрос?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Конструктор теста</h1>
          <p className="text-muted-foreground">
            <Link href="/admin/dashboard" className="underline-offset-4 hover:underline">
              ← Дашборд
            </Link>
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? "Редактирование вопроса" : "Новый вопрос"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Текст вопроса</Label>
              <Textarea
                id="questionText"
                value={form.questionText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, questionText: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Тип</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as typeof f.type,
                    }))
                  }
                >
                  <option value="single">Один правильный ответ</option>
                  <option value="multiple">Несколько правильных</option>
                  <option value="text">Текстовый / открытый</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Порядок (order_index)</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={form.orderIndex}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      orderIndex: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            {form.type !== "text" ? (
              <div className="space-y-3">
                <Label>Варианты ответа</Label>
                {form.options.map((o, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <Input
                      className="min-w-[12rem] flex-1"
                      placeholder={`Вариант ${i + 1}`}
                      value={o.optionText}
                      onChange={(e) =>
                        setForm((f) => {
                          const options = [...f.options];
                          options[i] = {
                            ...options[i],
                            optionText: e.target.value,
                          };
                          return { ...f, options };
                        })
                      }
                      required
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type={form.type === "single" ? "radio" : "checkbox"}
                        name="correct"
                        checked={o.isCorrect}
                        onChange={() =>
                          setForm((f) => {
                            const options = f.options.map((opt, idx) => {
                              if (f.type === "single") {
                                return { ...opt, isCorrect: idx === i };
                              }
                              if (idx === i) {
                                return { ...opt, isCorrect: !opt.isCorrect };
                              }
                              return opt;
                            });
                            return { ...f, options };
                          })
                        }
                      />
                      Верный
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          options: f.options.filter((_, idx) => idx !== i),
                        }))
                      }
                      disabled={form.options.length <= 1}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      options: [
                        ...f.options,
                        { optionText: "", isCorrect: false },
                      ],
                    }))
                  }
                >
                  Добавить вариант
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Открытый вопрос: варианты и эталон не нужны, ответ не влияет на
                балл.
              </p>
            )}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Сохранение…" : editingId ? "Сохранить" : "Добавить"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Список вопросов</h2>
        {questions.map((q) => (
          <Card key={q.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-3 pt-6">
              <div>
                <p className="font-medium">
                  [{q.orderIndex}] {q.questionText}
                </p>
                <p className="text-sm text-muted-foreground">
                  Тип: {q.type}
                  {q.type !== "text"
                    ? ` · вариантов: ${q.options.length}`
                    : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(q)}>
                  Изменить
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(q.id)}
                >
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
