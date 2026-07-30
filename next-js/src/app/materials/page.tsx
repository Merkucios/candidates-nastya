"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicShell } from "@/components/public-shell";
import { getCandidateId } from "@/lib/candidate-session";
import type { MaterialItem } from "@/lib/materials";

function EmbedFrame({ title, src }: { title: string; src: string }) {
  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 text-sm text-muted-foreground">
        Материал скоро появится
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-pine/5 shadow-[0_20px_50px_-30px_oklch(0.32_0.06_155/0.45)]">
      <iframe
        title={title}
        src={src}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function MaterialsSkeleton() {
  return (
    <div className="space-y-8 animate-rise">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
      ))}
      <Skeleton className="h-12 w-56 rounded-xl" />
    </div>
  );
}

export default function MaterialsPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getCandidateId()) {
      router.replace("/");
      return;
    }
    let cancelled = false;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setMaterials(Array.isArray(data.materials) ? data.materials : []);
        }
      })
      .catch(() => {
        if (!cancelled) setMaterials([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <PublicShell step="materials" compactBrand>
      {loading ? (
        <MaterialsSkeleton />
      ) : (
        <div className="animate-rise space-y-10">
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold text-pine sm:text-4xl">
              Обучающие материалы
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Посмотрите видео и презентации — после этого можно перейти к
              тестированию.
            </p>
          </div>

          {materials.length === 0 ? (
            <p className="text-muted-foreground">
              Материалы пока не добавлены.
            </p>
          ) : (
            materials.map((item, index) => (
              <section
                key={item.id}
                className={
                  index === 0
                    ? "animate-rise-delay-1 space-y-3"
                    : index === 1
                      ? "animate-rise-delay-1 space-y-3"
                      : "animate-rise-delay-2 space-y-3"
                }
              >
                <h2 className="font-display text-lg font-medium">
                  {item.title}
                </h2>
                <EmbedFrame title={item.title} src={item.url} />
              </section>
            ))
          )}

          <Button
            size="lg"
            variant="honey"
            className="w-full sm:w-auto"
            onClick={() => router.push("/test")}
          >
            Перейти к тестированию
            <ArrowRight />
          </Button>
        </div>
      )}
    </PublicShell>
  );
}
