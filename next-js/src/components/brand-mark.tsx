import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-xl",
    md: "text-3xl sm:text-4xl",
    lg: "text-4xl sm:text-6xl",
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p
        className={cn(
          "font-display font-semibold text-pine leading-none",
          sizes[size]
        )}
      >
        ИНСТРУКТАЖ ПО ТЕХНИКЕ БЕЗОПАСНОСТИ 
      </p>
      <p className="text-sm text-muted-foreground tracking-wide">
        КГБНОУ КДЦ «Созвездие»
      </p>
    </div>
  );
}
