import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcrypt'); 

const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем сидирование базы данных... ⏳');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'admin@cft.ru', name: 'Admin User', role: 'ADMIN' },
    { email: 'l1@cft.ru', name: 'Analyst L1', role: 'L1' },
    { email: 'l2@cft.ru', name: 'Analyst L2', role: 'L2' },
    { email: 'l3@cft.ru', name: 'Analyst L3', role: 'L3' },
  ];

  console.log('Создаем пользователей...');
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        // @ts-ignore
        role: user.role,
        password: hashedPassword,
      },
    });
  }

  console.log('Создаем тестовые уязвимости...');
  
  const issuesCount = await prisma.issue.count();
  
  if (issuesCount === 0) {
    const issues = [
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

    for (const issue of issues) {
      await prisma.issue.create({
        // @ts-ignore
        data: issue
      });
    }
    console.log(`Добавлено ${issues.length} уязвимостей.`);
  } else {
    console.log('Уязвимости уже существуют в базе. Пропускаем добавление.');
  }

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