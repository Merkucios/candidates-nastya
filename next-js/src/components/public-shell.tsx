import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand-mark";
import { FlowProgress, type FlowStep } from "@/components/flow-progress";

function CampDecor() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      {/* Soft sun */}
      <circle cx="1180" cy="120" r="64" fill="oklch(0.88 0.12 85 / 0.55)" />
      <circle cx="1180" cy="120" r="110" fill="oklch(0.9 0.1 85 / 0.18)" />

      {/* Distant hills */}
      <path
        d="M0 620 C180 560 320 580 480 540 C640 500 760 560 920 530 C1080 500 1240 470 1440 500 L1440 900 L0 900 Z"
        fill="oklch(0.55 0.05 160 / 0.12)"
      />
      <path
        d="M0 680 C220 620 400 650 560 610 C740 560 900 620 1080 590 C1240 565 1340 575 1440 560 L1440 900 L0 900 Z"
        fill="oklch(0.42 0.06 155 / 0.14)"
      />

      {/* Lake band */}
      <path
        d="M0 760 C260 730 520 780 780 745 C1040 710 1260 740 1440 720 L1440 900 L0 900 Z"
        fill="oklch(0.72 0.06 200 / 0.18)"
      />

      {/* Pine silhouettes left */}
      <g fill="oklch(0.32 0.06 155 / 0.22)" transform="translate(40 480)">
        <path d="M70 280 L40 180 L55 180 L25 100 L40 100 L10 20 L100 20 L70 100 L85 100 L55 180 L70 180 Z" />
        <path d="M150 300 L125 210 L138 210 L112 140 L125 140 L100 70 L175 70 L150 140 L163 140 L137 210 L150 210 Z" />
        <path d="M210 310 L190 240 L200 240 L178 180 L188 180 L165 120 L230 120 L210 180 L220 180 L198 240 L210 240 Z" />
      </g>

      {/* Pine silhouettes right */}
      <g fill="oklch(0.32 0.06 155 / 0.18)" transform="translate(1120 500)">
        <path d="M80 260 L55 175 L68 175 L42 110 L55 110 L30 45 L110 45 L85 110 L98 110 L72 175 L85 175 Z" />
        <path d="M150 280 L130 205 L140 205 L118 150 L128 150 L105 95 L170 95 L150 150 L160 150 L138 205 L150 205 Z" />
      </g>

      {/* Tent */}
      <g transform="translate(620 620)" fill="oklch(0.32 0.06 155 / 0.28)">
        <path d="M100 140 L20 140 L100 20 L180 140 Z" />
        <path d="M100 20 L100 140" stroke="oklch(0.32 0.06 155 / 0.35)" strokeWidth="3" fill="none" />
        <path d="M70 140 L100 70 L130 140" fill="oklch(0.32 0.06 155 / 0.12)" />
      </g>

      {/* Campfire glow */}
      <g transform="translate(700 745)">
        <ellipse cx="20" cy="18" rx="28" ry="10" fill="oklch(0.78 0.14 75 / 0.25)" />
        <path d="M20 2 C12 14 14 22 20 28 C26 22 28 14 20 2 Z" fill="oklch(0.75 0.16 55 / 0.55)" />
        <path d="M12 22 L8 30 M28 22 L32 30 M20 24 L20 32" stroke="oklch(0.35 0.04 60 / 0.4)" strokeWidth="2" />
      </g>

      {/* Fireflies */}
      <g fill="oklch(0.9 0.12 85 / 0.65)">
        <circle cx="220" cy="260" r="2.2" className="camp-spark" />
        <circle cx="380" cy="180" r="1.6" className="camp-spark-delay" />
        <circle cx="860" cy="220" r="2" className="camp-spark" />
        <circle cx="980" cy="300" r="1.5" className="camp-spark-delay" />
        <circle cx="520" cy="140" r="1.8" className="camp-spark" />
        <circle cx="1320" cy="250" r="1.7" className="camp-spark-delay" />
      </g>
    </svg>
  );
}

export function CampAtmosphere({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% -10%, oklch(0.9 0.08 85 / 0.55), transparent 55%),
            radial-gradient(ellipse 70% 45% at 90% 10%, oklch(0.88 0.06 200 / 0.45), transparent 50%),
            linear-gradient(180deg, oklch(0.96 0.02 180) 0%, oklch(0.95 0.025 155) 45%, oklch(0.93 0.03 145) 100%)
          `,
        }}
      />
      <div
        className="absolute -left-20 top-10 size-[28rem] rounded-full opacity-40 blur-3xl"
        style={{
          background: "oklch(0.85 0.1 75 / 0.5)",
          animation: "drift 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-16 bottom-0 size-[32rem] rounded-full blur-3xl"
        style={{
          background: "oklch(0.78 0.07 200 / 0.35)",
          animation: "lake-glow 10s ease-in-out infinite",
        }}
      />
      <CampDecor />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B4D3E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export function PublicShell({
  children,
  step,
  compactBrand = false,
}: {
  children: React.ReactNode;
  step?: FlowStep;
  compactBrand?: boolean;
}) {
  return (
    <div className="relative min-h-screen">
      <CampAtmosphere />
      <header className="mx-auto flex w-full max-w-3xl items-end justify-between gap-4 px-4 pb-2 pt-6 sm:px-8 sm:pt-10">
        <BrandMark size={compactBrand ? "sm" : "md"} className="animate-rise" />
        {step ? (
          <div className="animate-rise-delay-1 pb-1">
            <FlowProgress current={step} />
          </div>
        ) : null}
      </header>
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4 sm:px-8">
        {children}
      </div>
    </div>
  );
}
