# ITERATIONS — журнал разработки

> **Протокол для агентов:** в начале сессии прочитай этот файл. В конце каждой итерации обнови статус, «Сделано», «Следующий шаг» и при необходимости «Блокеры» / «Решения».

## Текущий статус

- **Активная итерация:** UI polish (фон / маска телефона / статус теста)
- **Последняя завершённая:** I11
- **Следующий шаг:** ручной smoke-тест обновлённого UI

## Ключевые решения

- Приложение в **`next-js/`**
- Тема «Огонёк»: лагерный фон (сосны, палатка, костёр, светлячки)
- Телефон: маска `+7 (999) 123-45-67`
- В админке все регистрации; чекбокс «Тест» = отправил ответы (`score != null` или есть answers)
- Next.js 15 + Tailwind v4 + shadcn + Prisma 7 + `@prisma/adapter-pg`
- Neon: `db push` через **unpooled** URL надёжнее; runtime — pooled `DATABASE_URL`
- Админ: `ADMIN_PASSWORD` + httpOnly cookie `admin_session`
- Кандидат не видит балл; `text` не скорится; безлимит попыток
- Шрифты: Unbounded + Manrope (fontsource)

## Блокеры

- Нет

---

## Журнал

### I0 — Continuity (completed)
### I1 — Scaffold (completed)
### I2 — Schema (completed)

- Prisma models: candidates, questions, question_options, answers, settings
- `prisma db push` на Neon + seed settings
- Adapter: `@prisma/adapter-pg` + `pg`

### I3 — Registration (completed)

- `/` форма → `POST /api/candidates` → sessionStorage `candidateId` → `/materials`

### I4 — Admin auth (completed)

- `/admin` логин, `src/lib/auth.ts`, middleware `/admin/*`, logout

### I5 — Constructor (completed)

- `/admin/questions` CRUD + 3 типа + order_index + options

### I6 — Materials (completed)

- `/materials` embeds из settings; `/admin/settings` редактирование URL

### I7 — Test + scoring (completed)

- `/test`, `POST /api/test/submit`, `src/lib/scoring.ts` (server-only score)

### I8 — Thanks (completed)

- `/thanks` без баллов/статуса

### I9 — Results (completed)

- `/admin/results` + `/admin/results/[id]` детальный просмотр

### I10 — CSV (completed)

- `GET /api/admin/results/export`

### I11 — Polish (completed)

- Адаптив, единый UI, `npm run build` OK, README в `next-js/`
