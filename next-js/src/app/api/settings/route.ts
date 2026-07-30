import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultMaterials, normalizeMaterials } from "@/lib/materials";

export async function GET() {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    return NextResponse.json({ materials: defaultMaterials() });
  }
  return NextResponse.json({
    id: settings.id,
    materials: normalizeMaterials(settings.materials),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const materials = normalizeMaterials(body.materials);

    const existing = await prisma.settings.findFirst();
    const settings = existing
      ? await prisma.settings.update({
          where: { id: existing.id },
          data: { materials },
        })
      : await prisma.settings.create({
          data: { materials },
        });

    return NextResponse.json({
      id: settings.id,
      materials: normalizeMaterials(settings.materials),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
