"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export default function AdminSettingsPage() {
  const [video1Url, setVideo1Url] = useState("");
  const [video2Url, setVideo2Url] = useState("");
  const [presentationUrl, setPresentationUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setVideo1Url(data.video1Url ?? "");
        setVideo2Url(data.video2Url ?? "");
        setPresentationUrl(data.presentationUrl ?? "");
      });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video1Url, video2Url, presentationUrl }),
      });
      if (!res.ok) {
        setMessage("Ошибка сохранения");
        return;
      }
      setMessage("Сохранено");
    } catch {
      setMessage("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Материалы</h1>
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
          <CardTitle>Ссылки для embed</CardTitle>
          <CardDescription>
            Google Drive / Яндекс.Диск — URL для iframe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="v1">Видео 1 URL</Label>
              <Input
                id="v1"
                value={video1Url}
                onChange={(e) => setVideo1Url(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v2">Видео 2 URL</Label>
              <Input
                id="v2"
                value={video2Url}
                onChange={(e) => setVideo2Url(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pres">Презентация URL</Label>
              <Input
                id="pres"
                value={presentationUrl}
                onChange={(e) => setPresentationUrl(e.target.value)}
              />
            </div>
            {message ? (
              <p className="text-sm text-muted-foreground">{message}</p>
            ) : null}
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение…" : "Сохранить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
