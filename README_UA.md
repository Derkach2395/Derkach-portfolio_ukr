# Портфоліо Юрія Деркача

Вебзастосунок портфоліо на React, FastAPI та PostgreSQL. Каталог проєктів завантажується з API, а контактна форма записує заявки в базу даних.

## Запуск у Docker

Потрібен Docker Desktop із Compose. У корені проєкту виконайте:

```sh
docker compose up --build
```

Після запуску:

- Сайт: http://localhost:8000
- API та інтерактивна документація: http://localhost:8000/docs
- Перевірка API: http://localhost:8000/api/health

PostgreSQL зберігає дані у Docker volume `postgres_data`. При першому запуску API створює таблиці й додає демонстраційні проєкти, якщо каталог порожній.

## Локальна розробка

Запустіть PostgreSQL окремо (наприклад, `docker compose up db -d`). Потім у двох терміналах:

```sh
cd backend
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

```sh
npm install
npm run dev
```

Vite працює на http://localhost:5173 та звертається до API на `http://localhost:8000`. Для іншої адреси API задайте `VITE_API_URL` перед запуском Vite. Бекенд налаштовується через `DATABASE_URL` і `FRONTEND_ORIGINS`.

## API

- `GET /api/health` — стан API.
- `GET /api/projects` — список проєктів для портфоліо.
- `POST /api/contact` — створення заявки (`name`, `email`, необов’язковий `phone`, `message`).

Документація OpenAPI доступна на `/docs`. Початкові проєкти та адресу їхніх зображень можна змінити у `backend/app/main.py`. Файли зображень розміщуються у `public/assets/`.

## Структура

```text
src/                 React інтерфейс
backend/app/         FastAPI, SQLAlchemy моделі та API
public/assets/       зображення портфоліо
docker-compose.yml   PostgreSQL та API
```
