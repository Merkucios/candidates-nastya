import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isQuestionType } from "@/lib/scoring";

type Params = { params: Promise<{ id: string }> };

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const body = await request.json();
    const questionText = String(body.questionText ?? "").trim();
    const type = String(body.type ?? "");
    const orderIndex = Number(body.orderIndex ?? 0);
    const options = Array.isArray(body.options) ? body.options : [];

    if (!questionText || !isQuestionType(type)) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    await prisma.questionOption.deleteMany({ where: { questionId: id } });

    const question = await prisma.question.update({
      where: { id },
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

    return NextResponse.json(question);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  try {
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
