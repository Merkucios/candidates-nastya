"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
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
import {
  createMaterial,
  type MaterialItem,
  type MaterialType,
} from "@/lib/materials";

export default function AdminSettingsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setMaterials(Array.isArray(data.materials) ? data.materials : []);
      });
  }, []);

  function updateItem(id: string, patch: Partial<MaterialItem>) {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }

  function addItem(type: MaterialType) {
    setMaterials((prev) => {
      const sameTypeCount = prev.filter((m) => m.type === type).length;
      const title =
        type === "video"
          ? `Видео ${sameTypeCount + 1}`
          : sameTypeCount === 0
            ? "Презентация"
            : `Презентация ${sameTypeCount + 1}`;
      return [...prev, createMaterial(type, prev.length, title)];
    });
  }

  function removeItem(id: string) {
    setMaterials((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m, i) => ({ ...m, orderIndex: i }))
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materials: materials.map((m, i) => ({ ...m, orderIndex: i })),
        }),
      });
      if (!res.ok) {
        setMessage("Ошибка сохранения");
        return;
      }
      const data = await res.json();
      setMaterials(Array.isArray(data.materials) ? data.materials : materials);
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
            <Link
              href="/admin/dashboard"
              className="underline-offset-4 hover:underline"
            >
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
            Google Drive / Яндекс.Диск — URL для iframe. Можно добавить любое
            количество видео и презентаций.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {materials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Пока нет материалов. Добавьте видео или презентацию.
              </p>
            ) : null}

            {materials.map((item, index) => (
              <div
                key={item.id}
                className="space-y-3 rounded-xl border border-border/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.type === "video" ? "Видео" : "Презентация"} #
                    {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`title-${item.id}`}>Название</Label>
                  <Input
                    id={`title-${item.id}`}
                    value={item.title}
                    onChange={(e) =>
                      updateItem(item.id, { title: e.target.value })
                    }
                    placeholder={
                      item.type === "video" ? "Видео 1" : "Презентация"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`url-${item.id}`}>URL</Label>
                  <Input
                    id={`url-${item.id}`}
                    value={item.url}
                    onChange={(e) =>
                      updateItem(item.id, { url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem("video")}
              >
                <Plus className="size-4" />
                Добавить видео
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem("presentation")}
              >
                <Plus className="size-4" />
                Добавить презентацию
              </Button>
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
