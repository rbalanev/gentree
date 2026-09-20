# gentree — Family Tree Portal

Веб-портал для организации, хранения и визуализации генеалогического древа.

**Версия:** 0.0.1_build_009

## Возможности

- ✅ CRUD операции с участниками семьи
- ✅ Хранение данных в локальном `.xlsx` файле
- ✅ Визуализация генеалогического древа с корректным layout
- ✅ Цветное кодирование связей (отец/мать)
- ✅ Визуальная обратная связь при сохранении
- ✅ Ручной ввод данных через веб-форму
- ✅ Автолейаут дерева (top-down)
- ✅ Карточки участников с разделением по полу

## Стек

| Компонент | Технология |
|-----------|-----------|
| Backend | FastAPI (Python 3.8+) |
| Frontend | React 18 + Vite |
| Визуализация | Reactflow |
| Хранение | openpyxl (family_tree.xlsx) |

## Быстрый старт

### Требования

- Python 3.8+
- Node.js 18+
- npm или yarn

### Установка и запуск

**1. Backend:**

```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Frontend:**

```powershell
cd frontend
npm install
npm run dev
```

**3. Открыть:** `http://localhost:5173`

## Структура проекта

```
gentree/
├── backend/
│   ├── main.py                    # Точка входа FastAPI
│   ├── requirements.txt           # Python зависимости
│   ├── config.py                  # Конфигурация
│   ├── models.py                  # Pydantic модели
│   ├── database.py                # CRUD с xlsx
│   ├── routes/
│   │   └── members.py             # REST endpoints
│   └── data/
│       └── family_tree.xlsx       # База данных
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── hooks/
│       │   └── useMembers.js
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── MemberList.jsx
│       │   ├── MemberForm.jsx
│       │   ├── TreeView.jsx       # Reactflow с авто-лейаутом
│       │   └── PersonNode.jsx
│       └── styles/
│           └── App.css
├── CHANGELOG_build_009.md         # История версий
└── README.md                      # Этот файл
```

## API Endpoints

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/api/members/` | Получить всех участников |
| GET | `/api/members/{id}` | Получить по ID |
| POST | `/api/members/` | Создать участника |
| PUT | `/api/members/{id}` | Обновить участника |
| DELETE | `/api/members/{id}` | Удалить участника |

## Поля участника

| Поле | Тип | Описание |
|------|-----|----------|
| id | int | Автоинкремент |
| name | str | Имя |
| surname | str | Фамилия |
| birth_year | int? | Год рождения |
| gender | str | male / female |
| father_id | int? | ID отца |
| mother_id | int? | ID матери |
| notes | str? | Заметки |

## Версионирование

- `MAJOR_MINOR` — версия фичи (стабильная)
- `build_NNN` — номер итерации
- Пример: `0.0.1_build_001`

## Лицензия

MIT
