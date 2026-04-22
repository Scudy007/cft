import { prisma } from "@/prisma/client";
import { Table, Badge, Link as RadixLink, Flex, Heading, Text, Card, Grid, Button, Box } from "@radix-ui/themes";
import Link from "next/link";
import IssueFilter from "./IssueFilter";
import { Status, Criticality } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import DashboardCharts from "./DashboardCharts";

interface Props {
  searchParams: { 
    status?: Status; 
    criticality?: Criticality;
    assignedToUserId?: string;
    orderBy?: string; 
    createdAtFrom?: string;
    createdAtTo?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;
  
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status as Status) ? searchParams.status : undefined;
  const criticalities = Object.values(Criticality);
  const criticality = criticalities.includes(searchParams.criticality as Criticality) ? searchParams.criticality : undefined;

  const pageSize = 8;
  const currentPage = parseInt(searchParams.page || '1') || 1;

  let orderByObj: any = { createdAt: 'desc' };
  if (searchParams.orderBy === 'cvss') {
    orderByObj = { cvssScore: 'desc' };
  } else if (searchParams.orderBy === 'dread') {
    orderByObj = { dreadScore: 'desc' };
  }

  const where: any = {
    status,
    criticality,
    assignedToUserId: searchParams.assignedToUserId,
  };

  if (searchParams.createdAtFrom || searchParams.createdAtTo) {
    where.createdAt = {};
    if (searchParams.createdAtFrom) where.createdAt.gte = new Date(searchParams.createdAtFrom);
    if (searchParams.createdAtTo) {
      const toDate = new Date(searchParams.createdAtTo);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  if (searchParams.deadlineFrom || searchParams.deadlineTo) {
    where.deadline = {};
    if (searchParams.deadlineFrom) where.deadline.gte = new Date(searchParams.deadlineFrom);
    if (searchParams.deadlineTo) {
      const toDate = new Date(searchParams.deadlineTo);
      toDate.setHours(23, 59, 59, 999);
      where.deadline.lte = toDate;
    }
  }

  const issues = await prisma.issue.findMany({
    where,
    orderBy: orderByObj,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { assignedToUser: true },
  });

  const filteredCount = await prisma.issue.count({ where });
  const pageCount = Math.ceil(filteredCount / pageSize);

  const totalCount = await prisma.issue.count();
  const openCount = await prisma.issue.count({ where: { status: 'OPEN' } });
  const criticalCount = await prisma.issue.count({ where: { criticality: 'CRITICAL' } });

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    if (searchParams.status) params.append("status", searchParams.status);
    if (searchParams.criticality) params.append("criticality", searchParams.criticality);
    if (searchParams.assignedToUserId) params.append("assignedToUserId", searchParams.assignedToUserId);
    if (searchParams.createdAtFrom) params.append("createdAtFrom", searchParams.createdAtFrom);
    if (searchParams.createdAtTo) params.append("createdAtTo", searchParams.createdAtTo);
    if (searchParams.deadlineFrom) params.append("deadlineFrom", searchParams.deadlineFrom);
    if (searchParams.deadlineTo) params.append("deadlineTo", searchParams.deadlineTo);
    if (searchParams.orderBy) params.append("orderBy", searchParams.orderBy);
    
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    return `/?${params.toString()}`;
  };

  const isDateSort = !searchParams.orderBy || searchParams.orderBy === 'new';

  return (
    <Box className="max-w-7xl mx-auto py-6 px-4">
      
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="4">
        <Heading size="7" color="gray">Дашборд безопасности</Heading>
        
        <Button asChild size="3" color="indigo" variant="solid" className="cursor-pointer shadow-md hover:shadow-lg transition-all px-6 py-5">
          <Link href="/issues/new">
            <Text size="3" weight="bold">+ Новый аудит</Text>
          </Link>
        </Button>
      </Flex>

      <Grid columns={{ initial: '1', sm: '3' }} gap="5">
        <Box className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-indigo-500 to-violet-600">
          <Flex direction="column" gap="2">
            <Text size="3" className="text-indigo-100" weight="bold" uppercase>Всего замечаний</Text>
            <Text size="9" weight="bold" className="text-white">{totalCount}</Text>
          </Flex>
        </Box>
        <Box className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-500 to-cyan-400">
          <Flex direction="column" gap="2">
            <Text size="3" className="text-blue-100" weight="bold" uppercase>В работе</Text>
            <Text size="9" weight="bold" className="text-white">{openCount}</Text>
          </Flex>
        </Box>
        <Box className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-rose-500 to-orange-500">
          <Flex direction="column" gap="2">
            <Text size="3" className="text-rose-100" weight="bold" uppercase>Критический риск</Text>
            <Text size="9" weight="bold" className="text-white">{criticalCount}</Text>
          </Flex>
        </Box>
      </Grid>

      <Box mt="6" mb="2">
        <DashboardCharts />
      </Box>

      <Flex direction="column" gap="4" mt="4">
        <Heading size="5" color="gray">Детальный список уязвимостей</Heading>
        
        <Flex direction={{ initial: 'column', lg: 'row' }} justify="between" align="start" gap="4">
          <IssueFilter currentUserId={currentUserId} />
          <Flex gap="3" align="center" wrap="wrap">
            <Text size="2" weight="bold" color="gray">Сортировка:</Text>
            <Button variant={isDateSort ? 'solid' : 'soft'} asChild className="shadow-sm cursor-pointer">
              <Link href={buildUrl({ orderBy: 'new', page: '1' })}>По дате</Link>
            </Button>
            <Button color="red" variant={searchParams.orderBy === 'cvss' ? 'solid' : 'soft'} asChild className="shadow-sm cursor-pointer">
              <Link href={buildUrl({ orderBy: 'cvss', page: '1' })}>По CVSS Score</Link>
            </Button>
            <Button color="orange" variant={searchParams.orderBy === 'dread' ? 'solid' : 'soft'} asChild className="shadow-sm cursor-pointer">
              <Link href={buildUrl({ orderBy: 'dread', page: '1' })}>По DREAD Score</Link>
            </Button>
          </Flex>
        </Flex>

        <Box className="shadow-sm rounded-xl overflow-hidden border border-slate-200 mt-2">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Уязвимость</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden md:table-cell">Статус</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden md:table-cell">Критичность</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden lg:table-cell">Система</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden sm:table-cell">Баллы</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="hidden md:table-cell">Ответственный</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Создано</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Дедлайн</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {issues.map((issue) => {
                const now = new Date();
                
                const isOverdue = issue.deadline && new Date(issue.deadline) < now && issue.status !== 'CLOSED';
                const isActiveDeadline = issue.deadline && new Date(issue.deadline) >= now && issue.status !== 'CLOSED';
                
                const deadlineColor = isOverdue ? "red" : isActiveDeadline ? "green" : "gray";
                const deadlineWeight = (isOverdue || isActiveDeadline) ? "bold" : "regular";

                return (
                  <Table.Row 
                    key={issue.id} 
                    align="center"
                    className="transition-all duration-200 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 hover:shadow-md relative hover:z-10 cursor-default"
                  >
                    <Table.Cell>
                      <Link href={`/issues/${issue.id}`} passHref legacyBehavior>
                        <RadixLink weight="bold" className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">{issue.title}</RadixLink>
                      </Link>
                      <div className="block md:hidden mt-1">
                        <Flex gap="2">
                          <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
                          <Badge color={issue.criticality === 'CRITICAL' ? 'red' : issue.criticality === 'HIGH' ? 'orange' : issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'}>{issue.criticality}</Badge>
                        </Flex>
                      </div>
                    </Table.Cell>
                    
                    <Table.Cell className="hidden md:table-cell">
                      <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
                    </Table.Cell>
                    
                    <Table.Cell className="hidden md:table-cell">
                      <Badge color={issue.criticality === 'CRITICAL' ? 'red' : issue.criticality === 'HIGH' ? 'orange' : issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'}>{issue.criticality}</Badge>
                    </Table.Cell>

                    <Table.Cell className="hidden lg:table-cell">
                      <Text size="2">{issue.system}</Text>
                    </Table.Cell>

                    <Table.Cell className="hidden sm:table-cell">
                      <Flex direction="column" gap="1">
                        {issue.cvssScore != null && <Badge color="red" variant="soft">CVSS: {issue.cvssScore}</Badge>}
                        {issue.dreadScore != null && <Badge color="orange" variant="soft">DREAD: {issue.dreadScore}</Badge>}
                      </Flex>
                    </Table.Cell>

                    <Table.Cell className="hidden md:table-cell">
                      <Text size="2">{issue.assignedToUser?.name || "Не назначено"}</Text>
                    </Table.Cell>

                    <Table.Cell>
                      <Text size="2">{issue.createdAt.toLocaleDateString("ru-RU")}</Text>
                    </Table.Cell>

                    <Table.Cell>
                      <Text size="2" color={deadlineColor} weight={deadlineWeight}>
                        {issue.deadline ? new Date(issue.deadline).toLocaleDateString("ru-RU") : "—"}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>

        {pageCount > 1 && (
          <Flex align="center" justify="between" mt="4" className="px-2">
            <Text size="2" color="gray">
              Показаны {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredCount)} из {filteredCount}
            </Text>
            
            <Flex gap="3" align="center">
              <Button 
                variant="soft" 
                color="gray"
                disabled={currentPage === 1} 
                asChild={currentPage > 1}
                className={currentPage > 1 ? "cursor-pointer" : ""}
              >
                {currentPage > 1 ? <Link href={buildUrl({ page: (currentPage - 1).toString() })}>Назад</Link> : <span>Назад</span>}
              </Button>
              
              <Text size="2" weight="bold">
                Страница {currentPage} из {pageCount}
              </Text>

              <Button 
                variant="soft" 
                color="gray"
                disabled={currentPage === pageCount} 
                asChild={currentPage < pageCount}
                className={currentPage < pageCount ? "cursor-pointer" : ""}
              >
                {currentPage < pageCount ? <Link href={buildUrl({ page: (currentPage + 1).toString() })}>Вперед</Link> : <span>Вперед</span>}
              </Button>
            </Flex>
          </Flex>
        )}

        {issues.length === 0 && (
          <Text mt="4" color="gray" align="center" as="p">Задачи по заданным фильтрам не найдены.</Text>
        )}
      </Flex>
    </Box>
  );
}