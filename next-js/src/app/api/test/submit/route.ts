import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreAnswers, type SubmittedAnswer } from "@/lib/scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidateId = String(body.candidateId ?? "");
    const submitted = (Array.isArray(body.answers) ? body.answers : []) as SubmittedAnswer[];

    if (!candidateId) {
      return NextResponse.json({ error: "Нет candidateId" }, { status: 400 });
    }

    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) {
      return NextResponse.json({ error: "Кандидат не найден" }, { status: 404 });
    }

    const questions = await prisma.question.findMany({
      orderBy: { orderIndex: "asc" },
      include: { options: true },
    });

    const { answers, score, totalScoredQuestions } = scoreAnswers(questions, submitted);

    await prisma.$transaction([
      prisma.answer.deleteMany({ where: { candidateId } }),
      prisma.answer.createMany({
        data: answers.map((a) => {
          const row: Prisma.AnswerCreateManyInput = {
            candidateId,
            questionId: a.questionId,
            answerText: a.answerText,
            isCorrect: a.isCorrect,
            answerGiven:
              a.answerGiven === null
                ? Prisma.DbNull
                : a.answerGiven,
          };
          return row;
        }),
      }),
      prisma.candidate.update({
        where: { id: candidateId },
        data: { score, totalScoredQuestions },
      }),
    ]);

    // Never return score to client
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
