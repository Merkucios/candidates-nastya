import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatRuPhone, isCompleteRuPhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const phoneRaw = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!fullName || !phoneRaw || !email) {
      return NextResponse.json(
        { error: "Заполните ФИО, телефон и email" },
        { status: 400 }
      );
    }

    if (!isCompleteRuPhone(phoneRaw)) {
      return NextResponse.json(
        { error: "Введите телефон полностью: +7 (999) 123-45-67" },
        { status: 400 }
      );
    }

    const phone = formatRuPhone(phoneRaw);

    const candidate = await prisma.candidate.create({
      data: { fullName, phone, email },
      select: { id: true },
    });

    return NextResponse.json({ id: candidate.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
