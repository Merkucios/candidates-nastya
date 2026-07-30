import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Дашборд администратора</h1>
          <p className="text-muted-foreground">Управление тестом и результатами</p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/results">
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg">Результаты</CardTitle>
              <CardDescription>
                Прохождения, баллы и ответы вожатых
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/questions">
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg">Конструктор</CardTitle>
              <CardDescription>Вопросы и варианты ответов</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/settings">
          <Card className="h-full transition-colors hover:bg-accent/40">
            <CardHeader>
              <CardTitle className="text-lg">Материалы</CardTitle>
              <CardDescription>Ссылки на видео и презентацию</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Button asChild variant="outline">
        <Link href="/">На публичную часть</Link>
      </Button>
    </main>
  );
}
