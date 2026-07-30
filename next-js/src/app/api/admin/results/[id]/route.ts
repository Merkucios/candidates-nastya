import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      answers: {
        include: {
          question: {
            include: { options: { orderBy: { orderIndex: "asc" } } },
          },
        },
      },
    },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Не найден" }, { status: 404 });
  }

  return NextResponse.json(candidate);
}
