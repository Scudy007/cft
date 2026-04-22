import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log('Начинаем сидирование базы данных... ⏳');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'admin@cft.ru', name: 'Admin User', role: 'ADMIN' },
    { email: 'l1@cft.ru', name: 'Analyst L1', role: 'L1' },
    { email: 'l2@cft.ru', name: 'Analyst L2', role: 'L2' },
    { email: 'l3@cft.ru', name: 'Analyst L3', role: 'L3' },
  ];

  console.log('Создаем или обновляем пользователей...');
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        role: user.role as any,
        password: hashedPassword,
      },
    });
  }

  console.log('Очищаем старые уязвимости, чтобы залить ровно 20 штук...');
  await prisma.issue.deleteMany();
  
  const initialIssues = [
    { 
      title: 'Открытый порт 22', system: 'Сервер авторизации', category: 'Сеть', status: 'OPEN', criticality: 'CRITICAL', 
      description: 'Обнаружен открытый SSH порт, доступный из внешней сети без ограничений по IP.' 
    },
    { 
      title: 'Устаревшая версия библиотеки', system: 'Биллинг', category: 'ПО', status: 'IN_PROGRESS', criticality: 'MEDIUM', 
      description: 'Используется уязвимая версия библиотеки, подверженная известным CVE.' 
    },
    { 
      title: 'Слабый пароль администратора', system: 'CRM система', category: 'Доступ', status: 'RESOLVED', criticality: 'HIGH', 
      description: 'Пароль учетной записи администратора не соответствует корпоративным политикам сложности.' 
    },
    { 
      title: 'Отсутствие шифрования бекапов', system: 'База данных', category: 'Данные', status: 'OPEN', criticality: 'HIGH', 
      description: 'Резервные копии базы данных хранятся на сервере в открытом виде.' 
    },
    { 
      title: 'Открытый S3 бакет', system: 'Хранилище', category: 'Облако', status: 'OPEN', criticality: 'CRITICAL', 
      description: 'Облачное хранилище имеет публичный доступ на чтение, возможна утечка документов.' 
    }
  ];

  const systems = ['Сервер авторизации', 'Биллинг', 'CRM система', 'База данных', 'Хранилище', 'API Шлюз', 'Фронтенд', 'Мобильное приложение', 'Корпоративный портал'];
  const categories = ['Сеть', 'ПО', 'Доступ', 'Данные', 'Облако', 'Архитектура', 'Логирование'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const criticalities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  for (let i = 6; i <= 20; i++) {
    initialIssues.push({
      title: `Автоматически найденная уязвимость #${i}`,
      system: getRandom(systems),
      category: getRandom(categories),
      status: getRandom(statuses),
      criticality: getRandom(criticalities),
      description: `Описание для сгенерированной уязвимости под номером ${i}. Требуется детальный анализ аналитиком соответствующей линии для подтверждения и устранения.`,
    });
  }

  console.log('Записываем 20 уязвимостей в базу...');
  for (const issue of initialIssues) {
    await prisma.issue.create({
      data: issue as any
    });
  }
  
  console.log(`Успешно добавлено ${initialIssues.length} уязвимостей.`);
  console.log('Сидирование успешно завершено! ✅');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидировании:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });