import { NextResponse } from "next/server";
import {
  createAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
