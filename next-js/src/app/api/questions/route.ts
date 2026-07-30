import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Public: questions without isCorrect flags */
export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      options: {
        orderBy: { orderIndex: "asc" },
        select: { id: true, optionText: true, orderIndex: true },
      },
    },
  });
  return NextResponse.json(questions);
}
