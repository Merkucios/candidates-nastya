"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLogoutButton } from "@/components/admin-logout-button";

type Detail = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  score: number | null;
  totalScoredQuestions: number | null;
  answers: {
    id: string;
    answerGiven: string[] | null;
    answerText: string | null;
    isCorrect: boolean | null;
    question: {
      questionText: string;
      type: string;
      options: { id: string; optionText: string; isCorrect: boolean }[];
    };
  }[];
};

export default function AdminResultDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [data, setData] = useState<Detail | null>(null);

  useEffect(() => {
    fetch(`/api/admin/results/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [id]);

  if (!data) {
    return (
      <main className="p-8 text-muted-foreground">Загрузка…</main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{data.fullName}</h1>
          <p className="text-muted-foreground">
            <Link href="/admin/results" className="underline-offset-4 hover:underline">
              ← К результатам
            </Link>
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <Card>
        <CardContent className="space-y-1 pt-6 text-sm">
          <p>Телефон: {data.phone}</p>
          <p>Email: {data.email}</p>
          <p>Дата: {new Date(data.createdAt).toLocaleString("ru-RU")}</p>
          <p>
            Статус:{" "}
            {data.score !== null || data.answers.length > 0
              ? "тест пройден"
              : "только регистрация (тест не отправлен)"}
          </p>
          <p>
            Балл:{" "}
            {data.score == null
              ? "—"
              : `${data.score} / ${data.totalScoredQuestions ?? "—"}`}
          </p>
        </CardContent>
      </Card>

      {data.answers.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Ответов нет — кандидат зарегистрировался, но не завершил тест.
          </CardContent>
        </Card>
      ) : null}

      {data.answers.map((a) => {
        const givenIds = Array.isArray(a.answerGiven) ? a.answerGiven : [];
        return (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {a.question.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">Тип: {a.question.type}</p>
              {a.question.type === "text" ? (
                <p>
                  Ответ:{" "}
                  <span className="whitespace-pre-wrap">
                    {a.answerText || "—"}
                  </span>
                </p>
              ) : (
                <>
                  <ul className="list-disc space-y-1 pl-5">
                    {a.question.options.map((o) => (
                      <li key={o.id}>
                        {o.optionText}
                        {o.isCorrect ? " ✓" : ""}
                        {givenIds.includes(o.id) ? " (выбрано)" : ""}
                      </li>
                    ))}
                  </ul>
                  <p>
                    Результат:{" "}
                    {a.isCorrect == null
                      ? "—"
                      : a.isCorrect
                        ? "верно"
                        : "неверно"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button asChild variant="outline">
        <Link href="/admin/results">Назад</Link>
      </Button>
    </main>
  );
}
