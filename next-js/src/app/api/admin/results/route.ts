import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      createdAt: true,
      score: true,
      totalScoredQuestions: true,
      _count: { select: { answers: true } },
    },
  });

  const rows = candidates.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    phone: c.phone,
    email: c.email,
    createdAt: c.createdAt,
    score: c.score,
    totalScoredQuestions: c.totalScoredQuestions,
    /** Зарегистрировался и отправил тест */
    testCompleted: c.score !== null || c._count.answers > 0,
  }));

  return NextResponse.json(rows);
}
