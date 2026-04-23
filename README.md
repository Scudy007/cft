# 🛡️ SecAudit | Аудит безопасности финансовых систем

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)

**SecAudit** — это внутренний корпоративный веб-сервис для работы с результатами аудитов информационной безопасности финансовых систем. 

Проект разработан для автоматизации работы аналитиков различных линий (L1, L2, L3) и администраторов, обеспечивая удобный трекинг инцидентов, оценку рисков и контроль SLA.

---

## ✨ Реализованная функциональность

В системе полностью реализованы требования технического задания:

* 🔐 **Ролевая модель доступа (RBAC):** Поддержка ролей Admin, Analyst L1, Analyst L2 и Analyst L3 с разграничением прав на просмотр, редактирование и смену статусов.
* 📋 **Управление результатами аудитов:** Детальный список уязвимостей с поддержкой пагинации, многофакторной фильтрации (по статусу, критичности, дате, ответственному) и сортировки.
* 📊 **Аналитические дашборды:** Визуализация данных (с использованием `Recharts`) для оценки распределения уязвимостей по критичности, статусам и целевым финансовым системам.
* 🧮 **Интерактивные калькуляторы:** * *Калькулятор рисков* (CVSS/DREAD) для вычисления Risk Score.
  * *Калькулятор SLA* для контроля дедлайнов и просрочек по устранению уязвимостей.
* 📝 **Карточка инцидента:** Подробный просмотр найденного нарушения с поддержкой Markdown-разметки, истории изменения статусов и назначения ответственных.
* 🎨 **Современный UI/UX:** Интерфейс построен на `Radix UI` и `Tailwind CSS`, обеспечивая интуитивно понятную и эстетичную рабочую среду (включая эффекты Glassmorphism и настраиваемые панели).

---

## 🛠 Технологический стек

* **Фреймворк:** [Next.js (App Router)](https://nextjs.org/)
* **Язык:** [TypeScript](https://www.typescriptlang.org/)
* **Стилизация:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI Themes](https://www.radix-ui.com/)
* **База данных:** PostgreSQL + [Prisma ORM](https://www.prisma.io/)
* **Аутентификация:** [NextAuth.js](https://next-auth.js.org/)
* **Формы и валидация:** `React Hook Form` + `Zod`

---

## 🚀 Инструкция по запуску локально

Следуйте этим шагам, чтобы развернуть копию проекта на вашем компьютере.

### 1. Клонирование репозитория
Откройте терминал и выполните команду:
```bash
git clone https://github.com/Scudy007/cft.git
cd cft
```

### 2. Установка зависимостей
Убедитесь, что у вас установлен Node.js (рекомендуется версия v18+).
```bash
npm install
```

### 3. Подготовка базы данных
Если вы разворачиваете проект на чистой системе, сначала установите СУБД и создайте локальную базу данных:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Создаем пользователя и базу данных для проекта
sudo -u postgres psql -c "CREATE USER sec_user WITH PASSWORD '12345';"
sudo -u postgres psql -c "CREATE DATABASE secaudit OWNER sec_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE secaudit TO sec_user;"
```

### 4. Настройка переменных окружения
В целях безопасности ключи и пароли не хранятся в репозитории. В корне проекта есть безопасный шаблон .env.example.
Скопируйте его, чтобы создать свой локальный конфигурационный файл:
```bash
cp .env.example .env
```

Откройте созданный файл .env и укажите данные для подключения к вашей базе:
```env
# Строка подключения к PostgreSQL (замените на свои данные, если нужно)
DATABASE_URL="postgresql://sec_user:12345@localhost:5432/secaudit"

# Секретный ключ для сессий NextAuth (можно сгенерировать: openssl rand -base64 32)
NEXTAUTH_SECRET="your_super_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```


### 5. Инициализация базы данных
Сгенерируйте клиент Prisma, примените схему к вашей пустой базе данных и загрузите стартовые (тестовые) данные:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 6. Запуск сервера разработки
Запустите проект в режиме разработчика:
```bash
npm run dev
```
После успешного запуска откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 👥 Тестовые учетные записи

Для проверки ролевой модели используйте следующие тестовые данные:

* **Admin:** `admin@cft.ru` / `пароль` (Полный доступ, управление системой)
* **Analyst L3:** `l3@cft.ru` / `пароль` (Изменение критичности, финальные решения)
* **Analyst L1/L2:** `analyst@cft.ru` / `пароль` (Обработка, маршрутизация)


---

## 📸 Скриншоты системы

<details>
<summary>Нажмите, чтобы развернуть скриншоты</summary>
<br>

* **Дашборд:** ![Dashboard](/public/screenshots/dashboard.png)
* **Канбан-доска:** ![Kanban](/public/screenshots/kanban.png)
* **Редактирование:** ![Settings](/public/screenshots/issue.png)

</details>
