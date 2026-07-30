# next-js — сайт аттестации вожатых

## Запуск

```bash
cd next-js
cp .env.example .env   # заполнить DATABASE_URL и ADMIN_PASSWORD
npm install
npx prisma db push
npm run db:seed
npm run dev
```

- Публичная часть: http://localhost:3000
- Админка: http://localhost:3000/admin

См. корневой `README.md` (ТЗ) и `ITERATIONS.md`.
