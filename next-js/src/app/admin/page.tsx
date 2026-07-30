"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/brand-mark";
import { CampAtmosphere } from "@/components/public-shell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка входа");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <CampAtmosphere />
      <form
        onSubmit={onSubmit}
        className="animate-rise surface-glass w-full max-w-sm space-y-5 rounded-3xl p-7 sm:p-8"
      >
        <BrandMark size="sm" />
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold">Админ-панель</h1>
          <p className="text-sm text-muted-foreground">Введите мастер-пароль</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Мастер-пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Вход…" : "Войти"}
        </Button>
      </form>
    </div>
  );
}
