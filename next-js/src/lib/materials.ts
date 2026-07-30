export type MaterialType = "video" | "presentation";

export type MaterialItem = {
  id: string;
  type: MaterialType;
  title: string;
  url: string;
  orderIndex: number;
};

function newId() {
  return crypto.randomUUID();
}

export function defaultMaterials(): MaterialItem[] {
  return [
    {
      id: newId(),
      type: "video",
      title: "Видео 1",
      url: "",
      orderIndex: 0,
    },
    {
      id: newId(),
      type: "video",
      title: "Видео 2",
      url: "",
      orderIndex: 1,
    },
    {
      id: newId(),
      type: "presentation",
      title: "Презентация",
      url: "",
      orderIndex: 2,
    },
  ];
}

export function createMaterial(
  type: MaterialType,
  orderIndex: number,
  title?: string
): MaterialItem {
  const videoCount = orderIndex + 1;
  return {
    id: newId(),
    type,
    title:
      title ??
      (type === "video" ? `Видео ${videoCount}` : "Презентация"),
    url: "",
    orderIndex,
  };
}

export function normalizeMaterials(raw: unknown): MaterialItem[] {
  if (!Array.isArray(raw)) return [];

  const items: MaterialItem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const type = rec.type === "presentation" ? "presentation" : "video";
    const title =
      typeof rec.title === "string" && rec.title.trim()
        ? rec.title.trim()
        : type === "video"
          ? `Видео ${i + 1}`
          : "Презентация";
    items.push({
      id: typeof rec.id === "string" && rec.id ? rec.id : newId(),
      type,
      title,
      url: typeof rec.url === "string" ? rec.url.trim() : "",
      orderIndex:
        typeof rec.orderIndex === "number" && Number.isFinite(rec.orderIndex)
          ? rec.orderIndex
          : i,
    });
  }

  return items
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((m, i) => ({ ...m, orderIndex: i }));
}
