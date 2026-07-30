-- Initial schema (I2). Applied via `prisma db push`.
-- For reference / future migrate history.

CREATE TYPE "QuestionType" AS ENUM ('single', 'multiple', 'text');

CREATE TABLE "candidates" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "total_scored_questions" INTEGER,
    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "question_options" (
    "id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "order_index" INTEGER NOT NULL,
    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "answers" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "answer_given" JSONB,
    "answer_text" TEXT,
    "is_correct" BOOLEAN,
    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "video_1_url" TEXT NOT NULL DEFAULT '',
    "video_2_url" TEXT NOT NULL DEFAULT '',
    "presentation_url" TEXT NOT NULL DEFAULT '',
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "answers" ADD CONSTRAINT "answers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
