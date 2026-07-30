import type { Question, QuestionOption, QuestionType } from "@prisma/client";

type QuestionWithOptions = Question & { options: QuestionOption[] };

export type SubmittedAnswer = {
  questionId: string;
  /** option ids for single/multiple */
  optionIds?: string[];
  /** free text for text questions */
  answerText?: string;
};

export type ScoredAnswer = {
  questionId: string;
  answerGiven: string[] | null;
  answerText: string | null;
  isCorrect: boolean | null;
};

export function scoreAnswers(
  questions: QuestionWithOptions[],
  submitted: SubmittedAnswer[]
): { answers: ScoredAnswer[]; score: number; totalScoredQuestions: number } {
  const byId = new Map(submitted.map((s) => [s.questionId, s]));
  let score = 0;
  let totalScoredQuestions = 0;
  const answers: ScoredAnswer[] = [];

  for (const q of questions) {
    const sub = byId.get(q.id);

    if (q.type === "text") {
      answers.push({
        questionId: q.id,
        answerGiven: null,
        answerText: sub?.answerText?.trim() || "",
        isCorrect: null,
      });
      continue;
    }

    totalScoredQuestions += 1;
    const correctIds = q.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id)
      .sort();
    const givenIds = [...(sub?.optionIds ?? [])].sort();
    const isCorrect =
      correctIds.length === givenIds.length &&
      correctIds.every((id, i) => id === givenIds[i]);

    if (isCorrect) score += 1;

    answers.push({
      questionId: q.id,
      answerGiven: givenIds,
      answerText: null,
      isCorrect,
    });
  }

  return { answers, score, totalScoredQuestions };
}

export function isQuestionType(value: string): value is QuestionType {
  return value === "single" || value === "multiple" || value === "text";
}
