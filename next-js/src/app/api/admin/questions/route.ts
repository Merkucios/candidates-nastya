import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isQuestionType } from "@/lib/scoring";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const questions = await prisma.question.findMany({
    orderBy: { orderIndex: "asc" },
    include: { options: { orderBy: { orderIndex: "asc" } } },
  });
  return NextResponse.json(questions);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const questionText = String(body.questionText ?? "").trim();
    const type = String(body.type ?? "");
    const orderIndex = Number(body.orderIndex ?? 0);
    const options = Array.isArray(body.options) ? body.options : [];

    if (!questionText || !isQuestionType(type)) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        questionText,
        type,
        orderIndex: Number.isFinite(orderIndex) ? orderIndex : 0,
        options:
          type === "text"
            ? undefined
            : {
                create: options.map(
                  (
                    o: { optionText: string; isCorrect: boolean; orderIndex?: number },
                    i: number
                  ) => ({
                    optionText: String(o.optionText ?? "").trim(),
                    isCorrect: Boolean(o.isCorrect),
                    orderIndex: Number(o.orderIndex ?? i),
                  })
                ),
              },
      },
      include: { options: { orderBy: { orderIndex: "asc" } } },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
