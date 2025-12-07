# ProjectFlow Backend

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных

Создайте файл `.env` в корне папки `backend` (скопируйте из `env.example`):

**Вариант 1: SQLite**
```env
PORT=4000
APP_SECRET=supersecret
DB_DIALECT=sqlite
```

**Вариант 2: PostgreSQL**
```env
PORT=4000
APP_SECRET=supersecret
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projectflow
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Запуск

```bash
npm run dev
```

Сервер запустится на `http://localhost:4000`

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя (требует токен)

### Проекты
- `GET /api/projects` - Список проектов
- `POST /api/projects` - Создать проект
- `PUT /api/projects/:projectId` - Обновить проект
- `DELETE /api/projects/:projectId` - Удалить проект

### Задачи
- `GET /api/tasks?projectId=...` - Список задач
- `POST /api/tasks` - Создать задачу
- `PUT /api/tasks/:taskId` - Обновить задачу
- `DELETE /api/tasks/:taskId` - Удалить задачу

### Комментарии
- `GET /api/comments/task/:taskId` - Список комментариев к задаче
- `POST /api/comments/task/:taskId` - Создать комментарий
- `PUT /api/comments/:commentId` - Обновить комментарий
- `DELETE /api/comments/:commentId` - Удалить комментарий

## Устранение проблем

### Ошибка "[nodemon] app crashed"

1. **Проверьте файл `.env`** - он должен существовать и содержать правильные настройки
2. **Для SQLite**: Убедитесь, что `DB_DIALECT=sqlite` в `.env`
3. **Для PostgreSQL**: Убедитесь, что PostgreSQL запущен и креды правильные
4. **Проверьте логи** - теперь сервер выводит детальную информацию об ошибках



