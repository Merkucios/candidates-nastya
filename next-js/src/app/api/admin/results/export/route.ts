import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

function csvEscape(value: string | number | null | undefined | boolean) {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { answers: true } } },
  });

  const header = [
    "id",
    "full_name",
    "phone",
    "email",
    "created_at",
    "test_completed",
    "score",
    "total_scored_questions",
  ];

  const rows = candidates.map((c) => {
    const testCompleted = c.score !== null || c._count.answers > 0;
    return [
      c.id,
      c.fullName,
      c.phone,
      c.email,
      c.createdAt.toISOString(),
      testCompleted ? "yes" : "no",
      c.score,
      c.totalScoredQuestions,
    ]
      .map(csvEscape)
      .join(",");
  });

  const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="results.csv"',
    },
  });
}
