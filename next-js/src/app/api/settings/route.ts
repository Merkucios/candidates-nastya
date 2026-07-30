import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    return NextResponse.json({
      video1Url: "",
      video2Url: "",
      presentationUrl: "",
    });
  }
  return NextResponse.json({
    id: settings.id,
    video1Url: settings.video1Url,
    video2Url: settings.video2Url,
    presentationUrl: settings.presentationUrl,
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const video1Url = String(body.video1Url ?? "");
    const video2Url = String(body.video2Url ?? "");
    const presentationUrl = String(body.presentationUrl ?? "");

    const existing = await prisma.settings.findFirst();
    const settings = existing
      ? await prisma.settings.update({
          where: { id: existing.id },
          data: { video1Url, video2Url, presentationUrl },
        })
      : await prisma.settings.create({
          data: { video1Url, video2Url, presentationUrl },
        });

    return NextResponse.json(settings);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
