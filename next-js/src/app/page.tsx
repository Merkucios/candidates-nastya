"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/brand-mark";
import { CampAtmosphere } from "@/components/public-shell";
import { saveCandidateId } from "@/lib/candidate-session";
import { formatRuPhone, isCompleteRuPhone } from "@/lib/phone";

export default function RegistrationPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!isCompleteRuPhone(phone)) {
      setError("Введите телефон полностью: +7 (999) 123-45-67");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось зарегистрироваться");
        return;
      }
      saveCandidateId(data.id);
      router.push("/materials");
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <CampAtmosphere />

      <main className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-0">
        <section className="animate-rise space-y-8 pt-6 lg:pt-0">
          <BrandMark size="lg" />
          <div className="max-w-xl space-y-4">
            <h1 className="font-display text-balance text-3xl font-semibold leading-tight text-pine sm:text-5xl">
              Готовься к смене уверенно
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Короткое обучение и аттестация для вожатых — спокойно, по делу и
              без лишней суеты.
            </p>
          </div>
          <div className="hidden h-px w-24 bg-gradient-to-r from-honey to-transparent lg:block" />
        </section>

        <section className="animate-rise-delay-1">
          <form
            onSubmit={onSubmit}
            className="surface-glass space-y-5 rounded-3xl p-6 sm:p-8"
          >
            <div className="space-y-1">
              <h2 className="font-display text-xl font-semibold">Регистрация</h2>
              <p className="text-sm text-muted-foreground">
                Заполните данные и начните обучение
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иванова Анна Сергеевна"
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(formatRuPhone(e.target.value))}
                onFocus={() => {
                  if (!phone) setPhone("+7 (");
                }}
                placeholder="+7 (999) 123-45-67"
                required
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anna@example.com"
                required
                autoComplete="email"
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="honey"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Сохраняем…" : "Начать обучение"}
              {!loading ? <ArrowRight /> : null}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
