import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { CampAtmosphere } from "@/components/public-shell";

export default function ThanksPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <CampAtmosphere />
      <div className="animate-rise surface-glass w-full max-w-lg space-y-8 rounded-[2rem] p-8 text-center sm:p-12">
        <BrandMark size="md" className="items-center" />
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold text-pine sm:text-4xl">
            Спасибо!
          </h1>
          <p className="mx-auto max-w-sm text-muted-foreground leading-relaxed">
            Вы прошли тест. Ответы сохранены — дальше всё на стороне
            организаторов.
          </p>
        </div>
        <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-honey to-transparent" />
        <Button asChild variant="outline" size="lg">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  );
}
