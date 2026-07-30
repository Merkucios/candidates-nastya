"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { CampAtmosphere } from "@/components/public-shell";
import { cn } from "@/lib/utils";

type CandidateRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  score: number | null;
  totalScoredQuestions: number | null;
  testCompleted: boolean;
};

function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminResultsPage() {
  const [rows, setRows] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/results")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = rows.filter((r) => r.testCompleted).length;

  return (
    <div className="relative min-h-screen">
      <CampAtmosphere />
      <main className="relative mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-pine">
              Результаты
            </h1>
            <p className="text-muted-foreground">
              <Link
                href="/admin/dashboard"
                className="underline-offset-4 hover:underline"
              >
                ← Дашборд
              </Link>
              {!loading ? (
                <span className="ml-2 text-sm">
                  · прошли тест {completedCount} из {rows.length}
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/api/admin/results/export";
              }}
            >
              Экспорт CSV
            </Button>
            <AdminLogoutButton />
          </div>
        </div>

        <Card className="surface-glass border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Все регистрации</CardTitle>
            <p className="text-sm text-muted-foreground">
              Галочка — кандидат отправил тест. Без галочки — только
              зарегистрировался.
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <ResultsSkeleton />
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-3 font-medium" title="Тест пройден">
                      Тест
                    </th>
                    <th className="py-2 pr-3 font-medium">ФИО</th>
                    <th className="py-2 pr-3 font-medium">Телефон</th>
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Дата</th>
                    <th className="py-2 pr-3 font-medium">Балл</th>
                    <th className="py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-b last:border-0",
                        !r.testCompleted && "bg-muted/30"
                      )}
                    >
                      <td className="py-3 pr-3">
                        <span
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-md border",
                            r.testCompleted
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-transparent"
                          )}
                          title={
                            r.testCompleted
                              ? "Тест пройден"
                              : "Только регистрация"
                          }
                          aria-label={
                            r.testCompleted
                              ? "Тест пройден"
                              : "Только регистрация"
                          }
                        >
                          {r.testCompleted ? (
                            <Check className="size-3.5" strokeWidth={3} />
                          ) : (
                            "·"
                          )}
                        </span>
                      </td>
                      <td className="py-3 pr-3 font-medium">{r.fullName}</td>
                      <td className="py-3 pr-3">{r.phone}</td>
                      <td className="py-3 pr-3">{r.email}</td>
                      <td className="py-3 pr-3">
                        {new Date(r.createdAt).toLocaleString("ru-RU")}
                      </td>
                      <td className="py-3 pr-3">
                        {!r.testCompleted
                          ? "—"
                          : r.score == null
                            ? "—"
                            : `${r.score}${
                                r.totalScoredQuestions != null
                                  ? ` / ${r.totalScoredQuestions}`
                                  : ""
                              }`}
                      </td>
                      <td className="py-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/results/${r.id}`}>Детали</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-muted-foreground">
                        Пока нет регистраций
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
