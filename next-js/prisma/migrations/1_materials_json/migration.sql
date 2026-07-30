-- Flexible materials list (videos + presentations) instead of fixed URL columns

ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "materials" JSONB NOT NULL DEFAULT '[]';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'settings'
      AND column_name = 'video_1_url'
  ) THEN
    UPDATE "settings"
    SET "materials" = jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'video',
        'title', 'Видео 1',
        'url', COALESCE("video_1_url", ''),
        'orderIndex', 0
      ),
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'video',
        'title', 'Видео 2',
        'url', COALESCE("video_2_url", ''),
        'orderIndex', 1
      ),
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'presentation',
        'title', 'Презентация',
        'url', COALESCE("presentation_url", ''),
        'orderIndex', 2
      )
    )
    WHERE "materials" = '[]'::jsonb;
  END IF;
END $$;

ALTER TABLE "settings" DROP COLUMN IF EXISTS "video_1_url";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "video_2_url";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "presentation_url";
